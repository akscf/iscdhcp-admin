# *********************************************************************************************************************************
#
# (C)2021 aks
# https://github.com/akscf/
# *********************************************************************************************************************************
package DHCPADM;

use strict;

use Log::Log4perl;
use WSP::WspDefs qw(RPC_ERR_CODE_INTERNAL_ERROR);
use WSP::WspException;
use DHCPADM::SecurityManager;
use DHCPADM::OmapiManager;
use DHCPADM::Services::SystemInformationService;
use DHCPADM::Services::AuthenticationService;
use DHCPADM::Services::DhcpServerManagementService;
use DHCPADM::Services::LeasesManagementService;

sub new ($$;$) {
	my ($class) = @_;
	my $self = {
		logger      => Log::Log4perl::get_logger(__PACKAGE__),
		class_name  => $class,
		version     => 1.0,
		description => "",
		start_time	=> time(),
		wsp         => undef,
		sec_mgr	    => undef,
	};
	bless( $self, $class );
	return $self;
}

sub get_class_name {
        my ($self) = @_;
        return $self->{class_name};
}

#---------------------------------------------------------------------------------------------------------------------------------
sub init {
    my ($self, $wsp) = @_;
    $self->{'wsp'} = $wsp;
}

sub start {
	my ($self, $arg1, $arg2) = @_;
	$self->{'wsp'}->cfg_load(__PACKAGE__, sub {
        my $cfg = shift;
		die("Missing configureation file!");
	});
	
	$self->{'sec_mgr'} = DHCPADM::SecurityManager->new($self);
	$self->{'om_mgr'} = DHCPADM::OmapiManager->new($self);
	
	$self->{'wsp'}->rpc_service_register('SystemInformationService', DHCPADM::Services::SystemInformationService->new($self));
	$self->{'wsp'}->rpc_service_register('AuthenticationService', DHCPADM::Services::AuthenticationService->new($self));
	$self->{'wsp'}->rpc_service_register('DhcpServerManagementService', DHCPADM::Services::DhcpServerManagementService->new($self));
	$self->{'wsp'}->rpc_service_register('LeasesManagementService', DHCPADM::Services::LeasesManagementService->new($self));
}

sub stop {
	my ($self) = @_;
}

#---------------------------------------------------------------------------------------------------------------------------------
# api
#---------------------------------------------------------------------------------------------------------------------------------
sub get_config {
	my ($self, $section, $property) = @_;
	my $wsp = $self->{wsp}; 
	return $wsp->cfg_get(__PACKAGE__, $section, $property);	
}

return DHCPADM->new();
