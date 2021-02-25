# ******************************************************************************************
# Copyright (C) AlexandrinKS
# https://akscf.me/
# ******************************************************************************************
package DHCPADM::Services::LeasesManagementService;

use strict;

use Log::Log4perl;
use File::Copy;
use File::Temp;
use WSP::WspException;
use WSP::WspDefs qw(:ALL);
use DHCPADM::Defs qw(:ALL);
use DHCPADM::Models::LeaseEntry;

sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger          => Log::Log4perl::get_logger(__PACKAGE__),
		class_name      => $class,
		mgr             => $mgr,
        sec_mgr         => $mgr->{sec_mgr},
        om_mgr          => $mgr->{om_mgr}
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
sub rpc_browse {
	my ( $self, $sec_ctx, $filter) = @_;
	my ($ftext, $fstart, $fcount) = (undef, 0, 250);
	my $result = [];
	#
    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);
    #
    my $leases_file = $self->{mgr}->get_config('dhcp','leases_file');
    unless($leases_file) {
    	die WSP::WspException->new('Missing configuration property: dhcp.leases_file', RPC_ERR_CODE_INTERNAL_ERROR);
    }
    my $tmp_file = tmpnam();
    unless(copy($leases_file, $tmp_file)) {
    	die WSP::WspException->new("Couldn't copy lease file: ".$leases_file, RPC_ERR_CODE_INTERNAL_ERROR);	
    }
	unless(open(LEASES, "< ".$tmp_file)) {
		unlink($tmp_file);
		die WSP::WspException->new("Couldn't read file: ".$tmp_file, RPC_ERR_CODE_INTERNAL_ERROR);	
	}
	my @lines = <LEASES>;
	close(LEASES);
	
	if($filter) {
		$ftext  = $filter->text();
		# todo 
		#$fstart = ($filter->resultsStart() ? $filter->resultsStart() : $fstart);
		#$fcount = ($filter->resultsLimit() ? $filter->resultsLimit() : $fcount);
	}	
	my $lease_entry = undef;
	my $lease_fnd = 0;
	my $lease_count = 0;

	foreach my $line (@lines) {
		if ($line=~/host\s(.*?)\s.*/) {
			$lease_entry = DHCPADM::Models::LeaseEntry->new();
			$lease_entry->{name} = $1;
			$lease_entry->{type} = 'host';
			$lease_entry->{state} = 'active';
			$lease_fnd = 1;
			$lease_count++;			
		}
        if ($line=~/lease\s(\d+\.\d+\.\d+\.\d+)/) {
        	$lease_entry = DHCPADM::Models::LeaseEntry->new();
			$lease_entry->{type} = 'lease';
			$lease_entry->{ip} = $1;
			$lease_fnd = 1;
			$lease_count++;
        }
        if ($lease_fnd && $line =~/fixed-address\s(.*?)\;/) {
        	$lease_entry->{ip} = $1;
        }
        if ($lease_fnd && $line =~/hardware\sethernet\s(.*?)\;/) {
        	$lease_entry->{mac} = $1;
        }
        if ($lease_fnd && $line =~/client-hostname\s"(.*?)"\;/) {
        	$lease_entry->{name} = $1;
        }
        if ($lease_fnd && $line=~/starts\s\d\s(\d+\/\d+\/\d+\s\d+:\d+:\d+)\;/) {
        	$lease_entry->{startTime} = $1;
  		}
        if ($lease_fnd && $line=~/ends\s\d\s(\d+\/\d+\/\d+\s\d+:\d+:\d+)\;/) {
        	$lease_entry->{endTime} = $1;
        }
        if ($lease_fnd && $line=~/^\s+binding\sstate\s(.*?)\;/) {
			$lease_entry->{state} = $1;
        }
        if ($lease_fnd && $line=~/^\s+deleted\;/) {
        	$lease_entry = undef;
			$lease_fnd = 0;			
			$lease_count--;        	
        }
        if ($lease_fnd && $line=~/^}/){
        	if($ftext) {				
				if($lease_entry->{ip} =~ m/\Q$ftext/ || $lease_entry->{mac} =~ m/\Q$ftext/) {
					push(@{$result}, $lease_entry);
				}
        	} else {
        		push(@{$result}, $lease_entry);
        	}
			$lease_fnd = 0;
        }
	}
	unlink($tmp_file);
    #
    return $result;
}

sub rpc_add {
	my ( $self, $sec_ctx, $entity) = @_;
	
	$self->restrict_access($sec_ctx, [ROLE_ADMIN]);

	my $om = $self->{om_mgr};
	return $om->obj_create($entity);
}

sub rpc_update {
	my ( $self, $sec_ctx, $entity) = @_;

	$self->restrict_access($sec_ctx, [ROLE_ADMIN]);

	my $om = $self->{om_mgr};
	return $om->obj_update($entity);
}

sub rpc_get {
	my ( $self, $sec_ctx, $mac) = @_;
	
	$self->restrict_access($sec_ctx, [ROLE_ADMIN]);	

	my $om = $self->{om_mgr};
	return $om->obj_get($mac);
}

sub rpc_delete {
	my ( $self, $sec_ctx, $mac) = @_;
	
	$self->restrict_access($sec_ctx, [ROLE_ADMIN]);

	my $om = $self->{om_mgr};
	return $om->obj_delete($mac);
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

1;
