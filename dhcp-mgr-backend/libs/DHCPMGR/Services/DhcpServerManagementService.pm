# ******************************************************************************************
# DHCP server services
# 
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::Services::DhcpServerManagementService;

use strict;

use Log::Log4perl;
use File::Slurp;
use File::Copy;
use ReadBackwards;
use WSP::WspException;
use WSP::WspDefs qw(:ALL);
use DHCPMGR::Defs qw(:ALL);
use DHCPMGR::Models::ServerStatus;
use DHCPMGR::FilterSettings;

# ---------------------------------------------------------------------------------------------------------------------------------
sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger          => Log::Log4perl::get_logger(__PACKAGE__),
		class_name      => $class,
		mgr             => $mgr,
        sec_mgr         => $mgr->{sec_mgr}
	};
	bless( $self, $class ); 
	#
	return $self;
}

sub get_class_name {
	my ($self) = @_;
	return $self->{class_name};
}

# ---------------------------------------------------------------------------------------------------------------------------------
# public methods
# ---------------------------------------------------------------------------------------------------------------------------------
sub rpc_serverStart {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};	
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $mgr->get_config('dhcp','cmd_start');
    unless($cmd) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.cmd_start', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    srv_control_lock($self, 1);
    system($cmd);
    my $res = $?;
    srv_control_lock($self, 0);
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Failed to start server: ".$err." (".$cmd.")");
    	die WSP::WspException->new( "Failed to start server: ".$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
    #
	return 1;
}

sub rpc_serverStop {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $mgr->get_config('dhcp','cmd_stop');
    unless($cmd) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.cmd_stop', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    srv_control_lock($self, 1);
    system($cmd); 
    my $res = $?;
    srv_control_lock($self, 0);
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Failed to stop server: ".$err." (".$cmd.")");
    	die WSP::WspException->new( 'Failed to stop server: '.$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
	return 1;
}

sub rpc_serverReload {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    my $cmd = $mgr->get_config('dhcp','cmd_reload');
    unless($cmd) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.cmd_reload', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    srv_control_lock($self, 1);
    system($cmd); 
    my $res = $?;
    srv_control_lock($self, 0);
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Failed to reload server: ".$err." (".$cmd.")");
    	die WSP::WspException->new( 'Failed to reload server: '.$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
    #
	return 1;
}

sub rpc_serverGetStatus {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
	my $status = DHCPMGR::Models::ServerStatus->new(pid => 0, state => 'unknown', version => 'unknown');
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $mgr->get_config('dhcp','cmd_status');
    unless($cmd) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.cmd_status', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    my $st  = `$cmd`;
    #    
    my @tt  = split('\n', $st);    
    foreach my $l (@tt) {
		if($l =~ /Main PID\:\s(\d+)\s\((.*)\)$/) { # Main PID: 24534 (code=exited, status=1/FAILURE)
			$status->{pid} = $1;
			$status->{state} = $2;
    		last;
    	}
	}
	# get daemon version (it's temporary)
	my $tt = '/tmp/.xtmp'.$$;
	system('dhcpd --version 2> '.$tt);
	my $r = open( my $x, "<".$tt );
	if($r) {$status->{version}=<$x>; close($x); chomp($status->{version});}
	unlink($tt);
    #
	return $status;
}

sub rpc_configRead {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $cfg_file = $mgr->get_config('dhcp','config_file');
    unless($cfg_file) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.config_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    #
    unless( -e $cfg_file ) {
    	die WSP::WspException->new( 'File not found: '.$cfg_file, RPC_ERR_CODE_NOT_FOUND );
    }    
    return read_file($cfg_file);
}

sub rpc_configWrite {
	my ( $self, $sec_ctx, $txt) = @_;
	my $mgr = $self->{mgr};
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $cfg_file = $mgr->get_config('dhcp','config_file');
    unless($cfg_file) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.config_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    #
    unless( -e $cfg_file ) {
    	die WSP::WspException->new( 'File not found: '.$cfg_file, RPC_ERR_CODE_NOT_FOUND );
    }
    if($txt && length($txt) <= 10) {
    	die WSP::WspException->new( 'Configuration is too small', RPC_ERR_CODE_INTERNAL_ERROR );	
    }
    
    srv_config_lock($self, 1);
    
    copy($cfg_file, $cfg_file.'.old');
    write_file($cfg_file, $txt);

    srv_config_lock($self, 0);

    return 1;
}

sub rpc_listenInterfacesGet {
	my ( $self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
	my $result='';
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);
    #
    my $os_type = $mgr->get_config('os','type');
    if($os_type eq 'linux') {
    	my @tt = read_file('/etc/default/isc-dhcp-server', chomp => 1);
    	foreach my $l (@tt) {
    		if($l =~ /^INTERFACES\=\"(.*)\"$/ ) { $result=$1; last; }
    	}
    } elsif ($os_type eq 'freebsd') {
    	my @tt = read_file('/etc/rc.conf', chomp => 1);
    	foreach my $l (@tt) {
    		if($l =~ /^dhcpd_ifaces\=\"(.*)\"$/ ) { $result=$1; last; }
    	}
    }
    return $result;
}

sub rpc_listenInterfacesSet {
	my ( $self, $sec_ctx, $iface) = @_;
	my $mgr = $self->{mgr};
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
    #
    my $os_type = $mgr->get_config('os','type');    
    if($os_type eq 'linux') {
    	#srv_config_lock($self, 1);
    	die WSP::WspException->new( 'Not yet implemented', RPC_ERR_CODE_INTERNAL_ERROR );
        #srv_config_lock($self, 0);

    } elsif ($os_type eq 'freebsd') {
        #srv_config_lock($self, 1);
    	die WSP::WspException->new( 'Not yet implemented', RPC_ERR_CODE_INTERNAL_ERROR );
        #srv_config_lock($self, 0);

    }
    return 1;
}

sub rpc_logRead {
	my ( $self, $sec_ctx, $filter, $settings) = @_;
	my $mgr = $self->{mgr};
	my $result=[];
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);
    #
    my $log_file = $mgr->get_config('dhcp','log_file');
    unless($log_file) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.log_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    #
    unless( -e $log_file ) {
    	die WSP::WspException->new( 'File not found: '.$log_file, RPC_ERR_CODE_NOT_FOUND );
    }
    #
    my $bw = File::ReadBackwards->new( $log_file ) || die WSP::WspException->new( "Can't read logfile: $!", RPC_ERR_CODE_NOT_FOUND ); 
  	my $ofs = ($settings && $settings->offset() ? $settings->offset() : 0);
    my $count = ($settings && $settings->count() ? $settings->count() : 100);
    #
	while(defined(my $l = $bw->readline())) {
		$count-- if($count >= 0);
		push(@{$result}, $l);
	}
    #
    return $result;
}

# ---------------------------------------------------------------------------------------------------------------------------------
# private methods
# ---------------------------------------------------------------------------------------------------------------------------------
sub restrict_access {
    my ($self, $ctx, $roles) = @_;
    #
    my $ident = $self->{sec_mgr}->identify($ctx);
    $self->{sec_mgr}->pass($ident, $roles);    
}

sub srv_control_lock {
    my ($self, $action) = @_;
    my $mgr = $self->{mgr};
    # 1=set, else unser
    if($action == 1) {
        my $v = $mgr->{wsp}->store_get('mutex_srvctl');
        if($v) {
            die WSP::WspException->new( 'Try again later, another process is locked this resource', RPC_ERR_CODE_OBJECT_LOCKED );
        }
        $mgr->{wsp}->store_put('mutex_srvctl', 1);
    } else {
        $mgr->{wsp}->store_put('mutex_srvctl', undef);    
    }
}

sub srv_config_lock {
    my ($self, $action) = @_;
    my $mgr = $self->{mgr};
    # 1=se, else unser
    if($action == 1) {
        my $v = $mgr->{wsp}->store_get('mutex_srvcfg');
        if($v) {
            die WSP::WspException->new( 'Try again later, another process is locked this resource', RPC_ERR_CODE_OBJECT_LOCKED );
        }
        $mgr->{wsp}->store_put('mutex_srvcfg', 1);
    } else {
        $mgr->{wsp}->store_put('mutex_srvcfg', undef);    
    }
}

# ---------------------------------------------------------------------------------------------------------------------------------
1;
