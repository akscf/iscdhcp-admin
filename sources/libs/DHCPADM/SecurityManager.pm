# ******************************************************************************************
# Copyright (C) AlexandrinKS
# https://akscf.me/
# ******************************************************************************************
package DHCPADM::SecurityManager;

use strict;

use Log::Log4perl;
use Digest::SHA::PurePerl qw(sha1_hex);
use Crypt::RandPasswd;
use MIME::Base64;
use WSP::WspException;
use WSP::WspDefs qw(:ALL);
use WSP::Boolean;
use WSP::JSON;
use DHCPADM::Defs qw(:ALL);
use DHCPADM::UserIdentity;

my $ANONYMOUS = DHCPADM::UserIdentity->new(id => -1, role => ROLE_ANONYMOUS, title => 'anonymous');

sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger     			=> Log::Log4perl::get_logger(__PACKAGE__),
		class_name 			=> $class,
		mgr        			=> $mgr,
		ttl 				=> 3600, 	# 1 hour
		json	   			=> WSP::JSON->new(auto_bless => 1)
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
sub session_create {
	my ($self, $login, $title, $role) = @_;
	my $mgr = $self->{mgr};
	#
	my $expiry = (time() + $self->{ttl});
	my $sid = encode_base64(Crypt::RandPasswd->chars( 48, 48 ));
    $sid =~ s/\n|\r//g;    
	my $obj = {sid => $sid, id => 0, login => $login, title => $title, role => $role, expiry => $expiry};
	my $skey = "sid_".$sid;
	#
	my $js = $self->{json}->encode($obj);
	$mgr->{wsp}->sdb_put($skey => $js);
	#
    return $sid;
}

sub session_delete {
	my ($self, $sid) = @_;
	my $mgr = $self->{mgr};
	my $skey = "sid_".$sid;
	#
	$mgr->{wsp}->sdb_put($skey => undef);
	#
	return 1;
}

sub session_get {
	my ($self, $sid) = @_;
	my $mgr = $self->{mgr};
	my $skey = "sid_".$sid;
	#
	my $js = $mgr->{wsp}->sdb_get($skey);
	return $self->{json}->decode($js) if($js);
	return undef;
}

# identify user by session-id or credentials
# @return UserIdentity
sub identify {
	my ($self, $sec_ctx) = @_;
	my $mgr = $self->{mgr};
	my $sid = $sec_ctx->{sessionId};
	my $skey = "sid_".$sid;
	#
	unless($sec_ctx) {
		return $ANONYMOUS;
	}
	if (!$sid && !$sec_ctx->{credentials}) {
		return $ANONYMOUS;
	}

	# lookup session
	if($sid) {
		my $session = session_get($self, $sid);
		return $ANONYMOUS unless($session);		
		
		# check expiry		
		my $ts = time();
		if($ts >= $session->{expiry}) {
			session_delete($self, $sid);
			return $ANONYMOUS;
		}

		# update 
		$session->{expiry} = (time() + $self->{ttl});
		$mgr->{wsp}->sdb_put($skey => $self->{json}->encode($session)); 

		# return identy
		return DHCPADM::UserIdentity->new(id => $session->{id}, role => $session->{role}, title => $session->{title});
	}
	
	# lookup by credentials
	if ($sec_ctx->{credentials}) {
		my $auth = 0;

		my $admin_name = $mgr->get_config('users', 'admin_name');
		my $admin_pass = $mgr->get_config('users', 'admin_secret');
		my $admin_enable = $mgr->get_config('users', 'admin_enable');

		my $viewer_name = $mgr->get_config('users', 'viewer_name');
		my $viewer_pass = $mgr->get_config('users', 'viewer_secret');
		my $viewer_enable = $mgr->get_config('users', 'viewer_enable');

		# admin
		if ($admin_enable eq 'true') {
			if((($admin_name eq $sec_ctx->{credentials}->{user}) && ($admin_pass eq $sec_ctx->{credentials}->{password}))) {
				return DHCPADM::UserIdentity->new(id => 0, role => ROLE_ADMIN, title => 'Administrator');
			}			
		}
		
		# viewer
		if ($viewer_enable eq 'true') {
			if((($viewer_name eq $sec_ctx->{credentials}->{user}) && ($viewer_pass eq $sec_ctx->{credentials}->{password}))) {
				return DHCPADM::UserIdentity->new(id => 0, role => ROLE_VIEWER, title => 'Viewer');
			}			
		}
	}
	
	# return anonymous ident
	return $ANONYMOUS;
}

sub pass {
	my ($self, $user_identity, $roles) = @_;
	#
	unless($user_identity) {
		die WSP::WspException->new( 'Unauthorized', RPC_ERR_CODE_UNAUTHORIZED_ACCESS );
	}
	unless($roles) {
		die WSP::WspException->new( 'Unauthorized', RPC_ERR_CODE_UNAUTHORIZED_ACCESS );
	}
	#
	my $urole = $user_identity->role();
	my $pass = 0;
	
	if($urole eq ROLE_ANONYMOUS) {
		die WSP::WspException->new( 'Unauthorized', RPC_ERR_CODE_UNAUTHORIZED_ACCESS );
	}
	
	if (ref($roles) eq 'SCALAR') {
		$pass = 1 if ($urole eq $roles);
	} else {
		foreach my $r (@{$roles}) {
			if ($urole eq $r) {
				$pass = 1;
				last;
			}		
		}		
	}	
	unless($pass) {
		die WSP::WspException->new( 'Permission denined', RPC_ERR_CODE_PERMISSION_DENIED );
	}	
}

sub reject {
	my ($self, $user_identity, $roles) = @_;
	#
	unless($user_identity) {
		die WSP::WspException->new( 'Unauthorized', RPC_ERR_CODE_UNAUTHORIZED_ACCESS );
	}
	#
	my $pass = 1;
	my $urole = $user_identity->role();
	if (ref($roles) eq 'SCALAR') {
		$pass = 0 if ($urole eq $roles);
	} else {
		foreach my $r (@{$roles}) {
			if ($urole eq $r) {
				$pass = 0;
				last;
			}		
		}		
	}	
	if($pass) {
		die WSP::WspException->new( 'Permission denined', RPC_ERR_CODE_PERMISSION_DENIED );
	}		
}

1;
