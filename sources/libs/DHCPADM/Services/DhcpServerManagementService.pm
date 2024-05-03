# ******************************************************************************************
#
# (C)2021 aks
# https://github.com/akscf/
# ******************************************************************************************
package DHCPADM::Services::DhcpServerManagementService;

use strict;

use Log::Log4perl;
use File::Slurp;
use File::Copy;
use ReadBackwards;
use WSP::WspException;
use WSP::Models::SearchFilter;
use WSP::WspDefs qw(:ALL);
use DHCPADM::Defs qw(:ALL);
use DHCPADM::Models::ServerStatus;

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
	#
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $self->{mgr}->get_config('dhcp','cmd_start');
    unless($cmd) {
    	die WSP::WspException->new('Missing configuration property: dhcp.cmd_start', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    $self->control_lock(1);
    system($cmd);
    my $res = $?;
    $self->control_lock(0);	
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Couldn't start server: ".$err." (".$cmd.")");
    	die WSP::WspException->new("Couldn't start server: ".$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
	return 1;
}

sub rpc_serverStop {
	my ( $self, $sec_ctx) = @_;
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $self->{mgr}->get_config('dhcp','cmd_stop');
    unless($cmd) {
    	die WSP::WspException->new('Missing configuration property: dhcp.cmd_stop', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    $self->control_lock(1);
    system($cmd); 
    my $res = $?;
    $self->control_lock(0);
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Couldn't stop server: ".$err." (".$cmd.")");
    	die WSP::WspException->new("Couldn't stop server: ".$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
	return 1;
}

sub rpc_serverReload {
	my ( $self, $sec_ctx) = @_;
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
	#
    my $cmd = $self->{mgr}->get_config('dhcp','cmd_reload');
    unless($cmd) {
    	die WSP::WspException->new('Missing configuration property: dhcp.cmd_reload', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    $self->control_lock(1);
    system($cmd); 
    my $res = $?;
    $self->control_lock(0);
    if ($res == -1) {
    	my $err = $!;
    	$self->{logger}->error("Couldn't reload server: ".$err." (".$cmd.")");
    	die WSP::WspException->new("Couldn't reload server: ".$err, RPC_ERR_CODE_INTERNAL_ERROR );    	
	}
    #
	return 1;
}

sub rpc_serverGetStatus {
	my ( $self, $sec_ctx) = @_;
	my $status = DHCPADM::Models::ServerStatus->new(pid => 0, state => 'unknown', version => 'unknown');
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $cmd = $self->{mgr}->get_config('dhcp','cmd_status');
    unless($cmd) {
    	die WSP::WspException->new( 'Missing configuration property: dhcp.cmd_status', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    my $st  = `$cmd`;
    # daemon status  
    my @tt  = split('\n', $st);    
    foreach my $l (@tt) {
		if($l =~ /Active:\s(.*)$/) {
		   $status->{state} = $1;
		   next;
		}
    	if($l =~ /Main PID\:\s(\d+)\s\((.*)\)$/) {
			$status->{pid} = $1;
			$status->{state}=$2 unless($status->{state});
    		last;
    	}
	}
	# isc version
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
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $cfg_file = $self->{mgr}->get_config('dhcp','config_file');
    unless($cfg_file) {
    	die WSP::WspException->new('Missing configuration property: dhcp.config_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    unless(-e $cfg_file)  {
    	die WSP::WspException->new('File not found: '.$cfg_file, RPC_ERR_CODE_NOT_FOUND );
    }    
    return read_file($cfg_file);
}

sub rpc_configWrite {
	my ($self, $sec_ctx, $txt) = @_;	
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $cfg_file = $self->{mgr}->get_config('dhcp','config_file');
    unless($cfg_file) {
    	die WSP::WspException->new('Missing configuration property: dhcp.config_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    unless(-e $cfg_file ) {
    	die WSP::WspException->new('File not found: '.$cfg_file, RPC_ERR_CODE_NOT_FOUND );
    }
    if($txt && length($txt) <= 10) {
    	die WSP::WspException->new('Configuration is too small', RPC_ERR_CODE_INTERNAL_ERROR );	
    }
    #
    $self->config_lock(1);    
    copy($cfg_file, $cfg_file.'.old');
    write_file($cfg_file, $txt);
    $self->config_lock(0);
	#
    return 1;
}

sub rpc_listenInterfacesGet {
	my ( $self, $sec_ctx) = @_;
	my $result='';
    #
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $os_type = $self->{mgr}->get_config('os','type');
	if($os_type eq 'linux') {
    	my @tt = read_file('/etc/default/isc-dhcp-server', chomp => 1);
    	foreach my $l (@tt) {
    		if($l =~ /^INTERFACES\=\"(.*)\"$/ ) { $result = $1; last; }
    	}
    } elsif ($os_type eq 'freebsd') {
    	my @tt = read_file('/etc/rc.conf', chomp => 1);
    	foreach my $l (@tt) {
    		if($l =~ /^dhcpd_ifaces\=\"(.*)\"$/ ) { $result = $1; last; }
    	}
    }
    return $result;
}

sub rpc_listenInterfacesSet {
	my ( $self, $sec_ctx, $iface) = @_;
    #
	$self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $os_type = $self->{mgr}->get_config('os','type');
	die WSP::WspException->new( 'Not yet implemented', RPC_ERR_CODE_INTERNAL_ERROR );
}

sub rpc_logRead {
	my ( $self, $sec_ctx, $filter) = @_;
	my ($ftext, $fstart, $fcount) = (undef, 0, 250);
	my $result=[];
	#
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $log_file = $self->{mgr}->get_config('dhcp','log_file');
    unless($log_file) {
    	die WSP::WspException->new('Missing configuration property: dhcp.log_file', RPC_ERR_CODE_INTERNAL_ERROR );
    }
    unless(-e $log_file ) {
    	die WSP::WspException->new('File not found: '.$log_file, RPC_ERR_CODE_NOT_FOUND );
    }
    #
    my $bw = File::ReadBackwards->new( $log_file ) || die WSP::WspException->new("Couldn't read logfile: $!", RPC_ERR_CODE_NOT_FOUND ); 
	if($filter) {
		$ftext  = $filter->text();
		$fstart = ($filter->resultsStart() ? $filter->resultsStart() : $fstart);
		$fcount = ($filter->resultsLimit() ? $filter->resultsLimit() : $fcount);
	}	
	while(defined(my $l = $bw->readline())) {
        $fcount-- if($fcount >= 0);
        last unless($fcount);
        unless($ftext) {
			push(@{$result}, $l);
		} else {
			push(@{$result}, $l) if($l =~ m/\Q$ftext/);
		}
    }
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

sub control_lock {
    my ($self, $action) = @_;
    my $wsp = $self->{mgr}->{wsp};
    if($action == 1) {
        if($wsp->sdb_get('lck_srvctl')) {
			die WSP::WspException->new( 'Try again later, another process is locked this resource', RPC_ERR_CODE_OBJECT_LOCKED );
		}
        $wsp->sdb_put('lck_srvctl', 1);
    } else {
        $wsp->sdb_put('lck_srvctl', undef);    
    }
}

sub config_lock {
    my ($self, $action) = @_;
    my $wsp = $self->{mgr}->{wsp};
    if($action == 1) {
        if($wsp->sdb_get('lck_srvcfg')) {
			die WSP::WspException->new( 'Try again later, another process is locked this resource', RPC_ERR_CODE_OBJECT_LOCKED );
		}
        $wsp->sdb_put('lck_srvcfg', 1);
    } else {
        $wsp->sdb_put('lck_srvctl', undef);    
    }
}

1;
