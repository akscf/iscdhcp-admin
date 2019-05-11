# ******************************************************************************************
# User authentication service
# 
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::Services::AuthenticationService;

use strict;

use Log::Log4perl;
use WSP::Boolean;
use Digest::SHA::PurePerl qw(sha1_hex);
use DHCPMGR::Defs qw(:ALL);
use DHCPMGR::AuthenticationResponse;

# ---------------------------------------------------------------------------------------------------------------------------------
sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger          	=> Log::Log4perl::get_logger(__PACKAGE__),
		class_name      	=> $class,
		mgr             	=> $mgr,
        sec_mgr         	=> $mgr->{sec_mgr}
	};
	bless( $self, $class );    
	return $self;
}

sub get_class_name {
	my ($self) = @_;
	return $self->{class_name};
}

# ---------------------------------------------------------------------------------------------------------------------------------
# public methods
# ---------------------------------------------------------------------------------------------------------------------------------
# create and return the new session-id
sub rpc_login {
	my ( $self, $sec_ctx, $login, $password, $captcha ) = @_;
	my $sec_mgr = $self->{sec_mgr};
	my $mgr = $self->{mgr};
    #	    
	return undef unless(defined($login) || defined($password));

	my $admin_name = $mgr->get_config('users', 'admin_name');
	my $admin_pass = $mgr->get_config('users', 'admin_secret');
	my $admin_enable = $mgr->get_config('users', 'admin_enable');

	my $viewer_name = $mgr->get_config('users', 'viewer_name');
	my $viewer_pass = $mgr->get_config('users', 'viewer_secret');
	my $viewer_enable = $mgr->get_config('users', 'viewer_enable');

	# is admin
	if (($admin_enable eq 'true') && ($admin_name eq $login)) {
		my $sha_pass = sha1_hex($admin_pass);
		if($sha_pass ne $password) {
			$self->{logger}->warn("Password mismatch for user: ".$login.", client-ip: ".$sec_ctx->{remoteIp});
			return undef;
		}
		my $sid = $sec_mgr->session_create($login, 'Administrator',  ROLE_ADMIN);
		my $o = DHCPMGR::AuthenticationResponse->new(sessionId => $sid); 
		$o->properties('title', 'Administrator');
		$o->properties('workplace', ROLE_ADMIN);	
		$o->properties('allow_change_wp', 0);
		#
		$self->{logger}->warn("User logged in: ".$login." / ".ROLE_ADMIN.", remote-ip: ".$sec_ctx->{remoteIp});
		return $o;
	}
	
	# is viewer
	if (($viewer_enable eq 'true') && ($viewer_name eq $login)) {
		my $sha_pass = sha1_hex($viewer_pass);
		if($sha_pass ne $password) {
			$self->{logger}->warn("Password mismatch for user: ".$login.", client-ip: ".$sec_ctx->{remoteIp});
			return undef;
		}
		my $sid = $sec_mgr->session_create($login, 'Viewer',  ROLE_VIEWER);
		my $o = DHCPMGR::AuthenticationResponse->new(sessionId => $sid); 
		$o->properties('title', 'Operator');
		$o->properties('workplace', ROLE_VIEWER);	
		$o->properties('allow_change_wp', 0);
		#
		$self->{logger}->warn("User logged in: ".$login." / ".ROLE_VIEWER.", remote-ip: ".$sec_ctx->{remoteIp});		
		return $o;
	}
	#
	$self->{logger}->warn("Unknown user: ".$login.", remote-ip: ".$sec_ctx->{remoteIp});
	return undef;
}

# delete session 
sub rpc_lgout {
	my ( $self, $sec_ctx ) = @_;
	my $sec_mgr = $self->{sec_mgr};
	#
    my $ident = $self->restrict_access($sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);
    $sec_mgr->session_delete($ident->{sid});
}

# update the session
sub rpc_ping {
	my ( $self, $sec_ctx ) = @_;
    my $ident = $self->{sec_mgr}->identify($sec_ctx);
}

# ---------------------------------------------------------------------------------------------------------------------------------
# private methods
# ---------------------------------------------------------------------------------------------------------------------------------
sub restrict_access {
    my ($self, $ctx, $roles) = @_;
    #
    my $ident = $self->{sec_mgr}->identify($ctx);
    $self->{sec_mgr}->pass($ident, $roles);
	#
    return $ident;
}

# ---------------------------------------------------------------------------------------------------------------------------------
1;
