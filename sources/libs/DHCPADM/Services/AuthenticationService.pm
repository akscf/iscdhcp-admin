# ******************************************************************************************
#
# (C)2021 aks
# https://github.com/akscf/
# ******************************************************************************************
package DHCPADM::Services::AuthenticationService;

use strict;

use Log::Log4perl;
use WSP::Boolean;
use WSP::Models::AuthenticationResponse;
use Digest::SHA::PurePerl qw(sha1_hex);
use DHCPADM::Defs qw(:ALL);

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
sub rpc_login {
	my ( $self, $sec_ctx, $login, $password, $captcha ) = @_;
	my $sec_mgr = $self->{sec_mgr};
    #       
	unless(defined($login) || defined($password)) {
		return undef
	}
	my $admin_name = $self->{mgr}->get_config('users', 'admin_name');
	my $admin_pass = $self->{mgr}->get_config('users', 'admin_secret');
	my $admin_enable = $self->{mgr}->get_config('users', 'admin_enable');
        
	my $digest_type = 0;
	my $remote_seed = undef;
	my $local_password = undef;
	my $remote_password = $password;
        
	if($password =~ /^DIGEST\s(.*)\:(.*)$/) {
		$remote_seed = $1; $remote_password = $2; $digest_type = 1;
	} elsif($password =~ /^DIGEST2\s(.*)\:(.*)$/) {
		$remote_seed = $1; $remote_password = $2; $digest_type = 2;
	} else {
		$self->{logger}->warn("Unsupported auth type: plain, client-ip: ".$sec_ctx->{remoteIp});
		return undef;
	}
                
	if (($admin_enable eq 'true') && ($admin_name eq $login)) {
		if($digest_type == 1) {
			$local_password = sha1_hex($remote_seed . $admin_pass);
		} elsif($digest_type == 2) {
			$local_password = sha1_hex($remote_seed . sha1_hex($admin_pass));
		} 
		if($local_password ne $remote_password) {
			$self->{logger}->warn("Password mismatch for user: ".$login.", client-ip: ".$sec_ctx->{remoteIp});
			return undef;
		}
		my $sid = $sec_mgr->session_create($login, 'Administrator',  ROLE_ADMIN);
		my $o = WSP::Models::AuthenticationResponse->new(sessionId => $sid);
		$o->properties('title', 'Administrator');
		$o->properties('workplace', ROLE_ADMIN);
		#
		$self->{logger}->warn("User logged in: ".$login." / ".ROLE_ADMIN.", remote-ip: ".$sec_ctx->{remoteIp});
		return $o;
	}

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
    my $ident = $self->{sec_mgr}->identify($ctx);
    $self->{sec_mgr}->pass($ident, $roles);

    return $ident;
}

1;
