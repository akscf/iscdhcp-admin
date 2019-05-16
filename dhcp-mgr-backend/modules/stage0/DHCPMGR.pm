# *********************************************************************************************************************************
# Main module
#
# @author AlexandrinK <aks@cforge.org>
# *********************************************************************************************************************************
package DHCPMGR;

use strict;

use Log::Log4perl;
use WSP::WspException;
use WSP::WspDefs qw(RPC_ERR_CODE_INTERNAL_ERROR);

use DHCPMGR::SecurityManager;
use DHCPMGR::Services::SystemInformationService;
use DHCPMGR::Services::AuthenticationService;
use DHCPMGR::Services::DhcpServerManagementService;
use DHCPMGR::Services::LeasesManagementService;

#---------------------------------------------------------------------------------------------------------------------------------
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
        my ( $self, $wsp ) = @_;
        $self->{'wsp'} = $wsp;
}

sub start {
	my ( $self, $arg1, $arg2 ) = @_;

        # load the config or create new
        $self->{'wsp'}->cfg_load(__PACKAGE__, sub {            
            my $cfg = shift;
            $cfg->{'os'}->{'type'}                  = 'linux';  # freebsd 

            $cfg->{'dhcp'}->{'config_file'} 		= '/etc/dhcp/dhcpd.conf';
            $cfg->{'dhcp'}->{'leases_file'} 		= '/var/lib/dhcp/dhcpd.leases';
            $cfg->{'dhcp'}->{'log_file'} 			= '/var/log/syslog';

            $cfg->{'dhcp'}->{'cmd_start'} 			= '/etc/init.d/isc-dhcp-server start';            
            $cfg->{'dhcp'}->{'cmd_stop'} 			= '/etc/init.d/isc-dhcp-server stop';
            $cfg->{'dhcp'}->{'cmd_reload'}          = '/etc/init.d/isc-dhcp-server reload';
            $cfg->{'dhcp'}->{'cmd_status'}          = '/etc/init.d/isc-dhcp-server status';            

            $cfg->{'dhcp'}->{'omapi_enable'} 		= 'false';
            $cfg->{'dhcp'}->{'omapi_host'} 			= '127.0.0.1';
            $cfg->{'dhcp'}->{'omapi_port'} 			= '9111';
            $cfg->{'dhcp'}->{'omapi_key'} 			= '-your-key-';

            $cfg->{'users'}->{'admin_enable'} 		= 'true';
            $cfg->{'users'}->{'admin_name'} 		= 'admin';
            $cfg->{'users'}->{'admin_secret'} 		= 'secret';
            
            $cfg->{'users'}->{'viewer_enable'} 	    = 'true';
            $cfg->{'users'}->{'viewer_name'} 		= 'viewer';
            $cfg->{'users'}->{'viewer_secret'} 	    = 'secret';

        });

		# init other services
		$self->{'sec_mgr'} = DHCPMGR::SecurityManager->new($self);

        # rpc services
        $self->{'wsp'}->rpc_service_register('SystemInformationService', DHCPMGR::Services::SystemInformationService->new($self));
        $self->{'wsp'}->rpc_service_register('AuthenticationService', DHCPMGR::Services::AuthenticationService->new($self));
        $self->{'wsp'}->rpc_service_register('DhcpServerManagementService', DHCPMGR::Services::DhcpServerManagementService->new($self));
        $self->{'wsp'}->rpc_service_register('LeasesManagementService', DHCPMGR::Services::LeasesManagementService->new($self));
}

sub stop {
	my ($self) = @_;
	#
	if($self->{'dbi'}) {
		$self->{'dbi'}->destroy();
	}
}

#---------------------------------------------------------------------------------------------------------------------------------
# api
#---------------------------------------------------------------------------------------------------------------------------------
sub get_config {
	my ($self, $section, $property) = @_;
	my $wsp = $self->{wsp}; 
	return $wsp->cfg_get(__PACKAGE__, $section, $property);	
}

sub dao_register {
	my ($self, $inst) = @_;
	my $dao = $self->{dao};
	#
	unless($inst) {		
		die WSP::WspException->new("Invalid argument: inst");
	}	
	my @t = split('::', $inst->get_class_name());
	my $sz = scalar(@t);
	my $name = ($sz > 0 ? $t[$sz - 1] : $inst->get_class_name());	
	#
	if(exists($dao->{$name})) {
		die WSP::WspException->new("Duplicate DAO class: ".$name);
	}
	$dao->{$name} = $inst;
	$self->{logger}->debug("DAO registered: ".$name." => ".$inst->get_class_name());	
}

sub dao_lookup {
	my ($self, $name, $quiet) = @_;
	my $dao = $self->{dao};
	#
	unless(exists($dao->{$name})) {
		return undef if ($quiet);
		die WSP::WspException->new("Unknown DAO class: ".$name);
	}
	return $dao->{$name};
	
}
#---------------------------------------------------------------------------------------------------------------------------------
return DHCPMGR->new();
