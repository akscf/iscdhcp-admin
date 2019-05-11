# ******************************************************************************************
# Date time helper functions
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::DateHelper;

use POSIX qw(strftime);
use Exporter qw(import);
our @EXPORT = qw(iso_format_datetime iso_datetime_now json_format_datetime);

# -------------------------------------------------------------------------------------------
sub iso_format_datetime {
    my ($t) = @_;
    return strftime("%d-%m-%Y %H:%M:%S", localtime($t));
}

sub iso_datetime_now {
    return strftime("%d-%m-%Y %H:%M:%S", gmtime());
}

sub json_format_datetime {
    my ($t) = @_;
    # (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)Z
    return strftime("%Y-%m-%dT%H:%M:%S\.000Z", localtime($t));
}

# -------------------------------------------------------------------------------------------
1;
