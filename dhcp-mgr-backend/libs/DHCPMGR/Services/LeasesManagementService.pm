# ******************************************************************************************
# Leases DB services
#
# NOTE: 
#   it isn't optimized version, use OMAPI service for manager the leasesdb
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::Services::LeasesManagementService;

use strict;

use Log::Log4perl;
use DHCPMGR::Defs qw(:ALL);

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
sub rpc_lookup {
	my ( $self, $sec_ctx, $filter) = @_;
	my $mgr = $self->{mgr};
	my $result=[];
    #
    restrict_access($self, $sec_ctx, [ROLE_ADMIN, ROLE_VIEWER]);
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

# ---------------------------------------------------------------------------------------------------------------------------------
1;
