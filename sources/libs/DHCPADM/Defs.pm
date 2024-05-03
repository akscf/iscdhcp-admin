# *****************************************************************************************
#
# (C)2021 aks
# https://github.com/akscf/
# *****************************************************************************************
package DHCPADM::Defs;

use constant RPC_ERR_CODE_OBJECT_LOCKED => 2001;

use constant ROLE_ADMIN  	 => 'ADMIN';
use constant ROLE_VIEWER   	 => 'VIEWER';
use constant ROLE_ANONYMOUS  => 'ANONYMOUS';

use Exporter qw(import);
our @EXPORT_OK = qw(
    ROLE_ADMIN
    ROLE_VIEWER
    ROLE_ANONYMOUS
    RPC_ERR_CODE_OBJECT_LOCKED
);
our %EXPORT_TAGS = ( 'ALL' => \@EXPORT_OK );

1;
