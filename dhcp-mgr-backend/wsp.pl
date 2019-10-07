#!/usr/bin/perl
# *****************************************************************************************
# wsp bootstrap script
#
# @author AlexandrinK <aks@cforge.org>
# *****************************************************************************************
$| = 1;
use POSIX;
use Getopt::Std;
use Config::INI::Simple;
use UUID::Tiny ':std';
use WSP::WspCore;

# -------------------------------------------------------------------------------------
my $WSP      = undef;
my $RET_CODE = 0;
my $CONFIG   = undef;
my $GHOME    = undef;

# -------------------------------------------------------------------------------------
# INIT
# -------------------------------------------------------------------------------------
getopt( 'ha', \%opts );
$GHOME = $opts{'h'};
if ( !defined( $opts{'h'} ) || !defined( $opts{'a'} ) ) {
	main_usage();
	exit(1);
}
if ( $opts{'a'} eq 'start' ) {
	main_start();
	exit($RET_CODE);

}
elsif ( $opts{'a'} eq 'stop' ) {
	main_stop();
	exit($RET_CODE);
}
print STDERR "FATAL: unsupported action '" . $opts->{'a'} . "'\n";
exit(1);

# -------------------------------------------------------------------------------------
# FUNCTIONS
# -------------------------------------------------------------------------------------
sub hlp_ldconfig {
	my $cfname = $GHOME . '/configs/wsp.conf';
	$CONFIG = Config::INI::Simple->new($cfname);
	unless ( keys(%$CONFIG) ) {
		# wsp settings		
		$CONFIG->{'server'}->{'id'}  			= create_uuid_as_string(UUID_V4);
		$CONFIG->{'server'}->{'address'}  		= "127.0.0.1";
		$CONFIG->{'server'}->{'port'}     		= "8080";
		$CONFIG->{'server'}->{'workers'}		= "10";
		$CONFIG->{'server'}->{'welcome_file'} 	= 'index.html';
		$CONFIG->{'server'}->{'www_root'} 		= 'default';
		$CONFIG->{'server'}->{'www_enable'} 	= 'false';
		$CONFIG->{'server'}->{'gid'} 			= 'undef';
		$CONFIG->{'server'}->{'uid'} 			= 'undef';
		#
		$CONFIG->write($cfname);
		print STDERR "WARN: Configuration file not found, default configuration created: configs/wsp.cfg\n";
		return (0);
	}
	return 1;
}

# -------------------------------------------------------------------------------------
# MAIN
# -------------------------------------------------------------------------------------
sub main_usage {
	print STDERR "usage: wsp.pl -h wsp_home -a [start|stop]\n";
}

sub main_start {
	return unless ( hlp_ldconfig() );
	$WSP = WSP::WspCore->new($GHOME, $CONFIG);
	eval {
		$WSP->start();
		$WSP->loop();
	} || do {
		my $exc = $@;
		print STDERR $exc . "\n";
  	}
}

sub main_stop {
	return unless ( hlp_ldconfig() );
	$WSP = WSP::WspCore->new($GHOME, $CONFIG);
	$WSP->stop();
}
