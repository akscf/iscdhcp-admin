# *****************************************************************************************
# Constants
#
# @author AlexandrinK <aks@cforge.org>
# *****************************************************************************************
package DHCPMGR::Defs;

use constant ROLE_ADMIN  	 => 'ADMIN';
use constant ROLE_VIEWER   	 => 'VIEWER';
use constant ROLE_ANONYMOUS  => 'ANONYMOUS';

use Exporter qw(import);
our @EXPORT_OK = qw(
    ROLE_ADMIN
    ROLE_VIEWER
    ROLE_ANONYMOUS
);
our %EXPORT_TAGS = ( 'ALL' => \@EXPORT_OK );

# -------------------------------------------------------------------------------------------
1;
