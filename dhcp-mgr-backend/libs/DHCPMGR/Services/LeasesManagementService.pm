# ******************************************************************************************
# Leases DB service
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::Services::LeasesManagementService;

use strict;

use Data::Dumper;

use Log::Log4perl;
use File::Copy;
use File::Temp;
use WSP::WspException;
use WSP::WspDefs qw(:ALL);
use DHCPMGR::Defs qw(:ALL);
use DHCPMGR::Models::LeaseEntry;


# ---------------------------------------------------------------------------------------------------------------------------------
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
# searching by leasesdb
sub rpc_search {
	my ( $self, $sec_ctx, $filter, $settings) = @_;
	my $mgr = $self->{mgr};
	my $result = [];
	#
	#$self->{logger}->debug("SEARCH, filter: ".$filter.", settings: ".Dumper($settings));
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);
    #
    my $leases_file = $mgr->get_config('dhcp','leases_file');
    unless($leases_file) {
    	die WSP::WspException->new('Missing configuration property: dhcp.leases_file', RPC_ERR_CODE_INTERNAL_ERROR);
    }
    my $tmp_file = tmpnam();
    unless(copy($leases_file, $tmp_file)) {
    	die WSP::WspException->new("Can't copy lease file: ".$leases_file, RPC_ERR_CODE_INTERNAL_ERROR);	
    }
    # load leases db
	unless(open(LEASES, "< ".$tmp_file)) {
		unlink($tmp_file);
		die WSP::WspException->new("Can't reead file: ".$tmp_file, RPC_ERR_CODE_INTERNAL_ERROR);	
	}
	my @lines = <LEASES>;
	close(LEASES);
	#
	my $lease_entry = undef;
	my $lease_fnd = 0;
	my $lease_count = 0;
	my $use_filter = ($filter && length($filter) > 3);
	#
	foreach my $line (@lines) {
		if ($line=~/host\s(.*?)\s.*/) {
			$lease_entry = DHCPMGR::Models::LeaseEntry->new();
			$lease_entry->{name} = $1;
			$lease_entry->{type} = 'host';
			$lease_entry->{state} = 'active';
			$lease_fnd = 1;
			$lease_count++;			
		}
        if ($line=~/lease\s(\d+\.\d+\.\d+\.\d+)/) {
        	$lease_entry = DHCPMGR::Models::LeaseEntry->new();
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
        if ($lease_fnd && $line=~/^}/){
        	if($use_filter) {
        		if($lease_entry->{ip} =~ /$filter/ || $lease_entry->{mac} =~ /$filter/) {
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
	my $om = $self->{om_mgr};
	#
	restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
	#
	return $om->obj_create($entity);
}

sub rpc_update {
	my ( $self, $sec_ctx, $entity) = @_;
	my $om = $self->{om_mgr};
	#
	restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
	#
	return $om->obj_update($entity);
}

sub rpc_get {
	my ( $self, $sec_ctx, $mac) = @_;
	my $om = $self->{om_mgr};
	#
	restrict_access($self, $sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);	
	#
	return $om->obj_get($mac);
}

sub rpc_delete {
	my ( $self, $sec_ctx, $mac) = @_;
	my $om = $self->{om_mgr};
	#
	restrict_access($self, $sec_ctx, [ROLE_ADMIN]);
	#
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

# ---------------------------------------------------------------------------------------------------------------------------------
1;
