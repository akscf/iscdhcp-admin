# ******************************************************************************************
# temporary implementation on omshell
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::OmapiManager;

use strict;
use Data::Dumper;

use Log::Log4perl;
use File::Temp qw(tempfile);
use File::Slurp;

use WSP::WspException;
use WSP::WspDefs qw(:ALL);
use WSP::Boolean;
use DHCPMGR::Defs qw(:ALL);

# ---------------------------------------------------------------------------------------------------------------------------------
sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger     			=> Log::Log4perl::get_logger(__PACKAGE__),
		class_name 			=> $class,
		mgr             	=> $mgr,
		omapi_enabled		=> ($mgr->get_config('dhcp','omapi_enable') eq 'true' ? 1 : 0)
	};
	bless( $self, $class );
	$self->{logger}->debug("OMAPI: ".($self->{omapi_enabled} ? "enabled" : "disabled"));    
	return $self;
}

sub get_class_name {
	my ($self) = @_;
	return $self->{class_name};
}

# ---------------------------------------------------------------------------------------------------------------------------------
# public methods
# ---------------------------------------------------------------------------------------------------------------------------------
sub obj_create {
	my ($self, $entity) = @_;
	#
	unless($self->{omapi_enabled}) {
		die WSP::WspException->new( 'OMAPI disabled', RPC_ERR_CODE_INTERNAL_ERROR );
	}
	#
	$self->{logger}->debug("OBJ CREATE: ".Dumper($entity));
    return $entity;
}

sub obj_update {
	my ($self, $entity) = @_;
	#
	unless($self->{omapi_enabled}) {
		die WSP::WspException->new( 'OMAPI disabled', RPC_ERR_CODE_INTERNAL_ERROR );
	}
	#
	$self->{logger}->debug("OBJ UPDATE: ".Dumper($entity));	
    return $entity;
}

sub obj_get {
	my ($self, $mac) = @_;
	#
	unless($self->{omapi_enabled}) {
		die WSP::WspException->new( 'OMAPI disabled', RPC_ERR_CODE_INTERNAL_ERROR );
	}
	#
	my($map, $err) = om_exec($self, "new \"lease\"\nset hardware-address=".$mac."\nopen\n");
	if($err) {
		if($err eq 'not found') {
			($map, $err) = om_exec($self, "new \"host\"\nset hardware-address=".$mac."\nopen\n");
		}
		if($err) {
			om_throw_exception($self, $err);
			return undef;
		}	
	}
	my $o = om_fill_lease_bject($self, $map, DHCPMGR::Models::LeaseEntry->new());
	$o->{state} = 'active' if($o->{type} eq 'host');
	#
	return $o;
}

sub obj_delete {
	my ($self, $mac) = @_;
	#
	unless($self->{omapi_enabled}) {
		die WSP::WspException->new( 'OMAPI disabled', RPC_ERR_CODE_INTERNAL_ERROR );
	}		
	#
	my($map, $err) = om_exec($self, "new \"host\"\nset hardware-address=".$mac."\nopen\nremove\n");
	if($err) {
		om_throw_exception($self, $err);
		return undef;
	}	
    return 1;
}

# -------------------------------------------------------------------------------------------
# private
# -------------------------------------------------------------------------------------------
sub om_exec {
	my ($self, $ucmd) = @_;
	my $mgr = $self->{mgr};
	my $err_msg = undef;
	my $result = {};
	my ($tfh, $tfname) = tempfile(DIR => '/tmp', UNLINK => 1);
	#
	my $scmd .= "server ".$mgr->get_config('dhcp','omapi_host')."\n";
	$scmd .= "port ".$mgr->get_config('dhcp','omapi_port')."\n";
	$scmd .= "key ".$mgr->get_config('dhcp','omapi_key')."\n";
	$scmd .= "connect\n";
	#
	unless(open(OMSHELL, '|omshell > '.$tfname.' 2>&1')) {
		$err_msg='Could not open omshell';
		return ($result, $err_msg);
    }
	print(OMSHELL $scmd);
	print(OMSHELL $ucmd);
	close(OMSHELL);
	#
	my @arr = read_file($tfname, chomp => 1);
	foreach my $l (@arr) {
		if($l =~ /not connected/) {$err_msg='not connected'; last; }
		if($l =~ /can\'t open object\:\s(.*)/) {$err_msg=$1; last; }
		if($l =~ /can\'t update object\:\s(.*)/) {$err_msg=$1; last; }		
		#
		if($l =~ /hardware-address\s=\s(.*)/) {$result->{'hardware-address'}=$1;}		
		if($l =~ /obj\:\s(.*)/) {$result->{'type'}=om_normalize_string($self, $1);}
		if($l =~ /client-hostname\s=\s(.*)/) {$result->{'client-hostname'}=om_normalize_string($self, $1);}
		if($l =~ /name\s=\s(.*)/) {$result->{'client-hostname'}=om_normalize_string($self, $1);}
		if($l =~ /ip-address\s=\s(.*)/) {$result->{'ip-address'}=om_normalize_ip($self, $1);}
		if($l =~ /starts\s=\s(.*)/) {$result->{'starts'}=om_normalize_date($self, $1);}
		if($l =~ /ends\s=\s(.*)/) {$result->{'ends'}=om_normalize_date($self,$1);}
		if($l =~ /state\s=\s(.*)/) {$result->{'state'}=om_normalize_state($self, $1);}		
	}
	close($tfh);
	#	
	return ($result, $err_msg);
}

sub om_throw_exception {
	my ($self, $err) = @_;
	
	unless($err) {
		return 0;
	}	
	if($err eq 'not found') {
		die WSP::WspException->new( 'Object not found', RPC_ERR_CODE_NOT_FOUND );
	}
	if($err eq 'already exists') {
		die WSP::WspException->new( 'Object already exists', RPC_ERR_CODE_ALREADY_EXISTS );
	}
	die WSP::WspException->new( "OMAPI: ".$err, RPC_ERR_CODE_INTERNAL_ERROR );
}

sub om_normalize_string {
	my ($self, $val) = @_;
	return $val unless($val);
	$val =~ s/\"//g;
	return $val;
}

sub om_normalize_ip {
	my ($self, $val) = @_;	
	my @t = split(':', $val, 4);	
	return $val if(scalar(@t) < 4);
	return sprintf("%i.%i.%i.%i", hex($t[0]), hex($t[1]), hex($t[2]), hex($t[3]));
}
sub om_normalize_state {
	my ($self, $val) = @_;
	my @t = split(':', $val, 4);	
	return $val if(scalar(@t) < 4);
	my $i = unpack('N', pack('C4', hex($t[0]), hex($t[1]), hex($t[2]), hex($t[3])));
	return($i != 2 ? 'free' : 'active');
}
sub om_normalize_date {
	my ($self, $val) = @_;
	my @t = split(':', $val, 4);	
	return $val if(scalar(@t) < 4);
	my $i = unpack('N', pack('C4', hex($t[0]), hex($t[1]), hex($t[2]), hex($t[3])));
	my ($sec, $min, $hour, $mday, $mon, $year) = (localtime($i))[0..5];
	return sprintf("%d/%02d/%02d %02d:%02d:%02d", ($year + 1900), ($mon + 1), $mday, $hour, $min, $sec);
}
sub om_fill_lease_bject {	
	my ($self, $map, $entity) = @_;
	$entity->{name} = $map->{'client-hostname'};
	$entity->{type} = $map->{'type'};
	$entity->{state} = $map->{'state'};
	$entity->{ip} = $map->{'ip-address'};
	$entity->{mac} = $map->{'hardware-address'};
	$entity->{startTime} = $map->{'starts'};
	$entity->{endTime} = $map->{'ends'};
	return $entity;
}
# -------------------------------------------------------------------------------------------
1;
