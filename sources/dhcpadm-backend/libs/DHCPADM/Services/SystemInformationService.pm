# ******************************************************************************************
# Copyright (C) AlexandrinKS
# https://akscf.me/
# ******************************************************************************************
package DHCPADM::Services::SystemInformationService;

use strict;

use Log::Log4perl;
use DHCPADM::Defs qw(:ALL);
use DHCPADM::Models::SystemStatus;

sub new ($$;$) {
	my ( $class, $mgr ) = @_;
	my $self = {
		logger          => Log::Log4perl::get_logger(__PACKAGE__),
		class_name      => $class,
		mgr             => $mgr,
        sec_mgr         => $mgr->{sec_mgr},
        info            => DHCPADM::Models::SystemStatus->new()
	};
	bless( $self, $class ); 
	#
	my $os_name = `uname`;
	$self->{info}->productName('DHCP Manager');
	$self->{info}->productVersion('1.0.0');
	$self->{info}->instanceName('noname');
	$self->{info}->vmInfo('Perl '.$]);
	$self->{info}->osInfo($os_name);
	$self->{info}->uptime(0);
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
sub rpc_getStatus {
	my ($self, $sec_ctx) = @_;

    $self->restrict_access($sec_ctx, [ROLE_ADMIN]);

    my $info = $self->{info};
    my $ts_start = $self->{mgr}->{start_time};
    my $ts_cur = time();

	$info->uptime(($ts_cur - $ts_start));
	return $info;
}


# ---------------------------------------------------------------------------------------------------------------------------------
# private methods
# ---------------------------------------------------------------------------------------------------------------------------------
sub restrict_access {
    my ($self, $ctx, $roles) = @_;
    my $ident = $self->{sec_mgr}->identify($ctx);
    $self->{sec_mgr}->pass($ident, $roles);    
}

1;
