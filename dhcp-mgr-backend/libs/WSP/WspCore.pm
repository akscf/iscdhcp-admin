# *****************************************************************************************
# WSP core
#
# @author AlexandrinK <aks@cforge.org>
# *****************************************************************************************
package WSP::WspCore;

use strict;

use WSP::WspException;
use WSP::WspDefs;
use Log::Log4perl;
use Shared::Hash;
use Config::INI::Simple;

use constant RPC_PATH => '/rpc/';

# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# constructior
# --------------------------------------------------------------------------------------------------------------------------------------------------------------
sub new ($$;$) {
	my ( $class, $home, $config ) = @_;
	my $self = {
		class_name  => $class,
		version     => 1.8,
		home        => $home,
		config      => $config,
		config_path => $home . '/configs',
		tmp_path    => $home . '/tmp',
		var_path    => $home . '/var',
		log_path    => $home . '/log',
		www_path    => $home . '/www',                	  # default
		www_enable  => undef,
		pid_file    => $home . '/var/wsp.pid',
		modules     => [],                                # list of instances
		servlets    => {},                                # path => instance
		services    => {},
		cfgmgr      => {},
		dhash       => undef,
		flags       => { running => 0, shutdown => 0 },
	};
	bless( $self, $class );
	#
	Log::Log4perl::init( $home . '/configs/log4perl.conf' );
	$self->{logger} = Log::Log4perl::get_logger("WSP::WspCore");
	#
	return $self;
}

sub get_class_name {
	my ($self) = @_;
	return $self->{class_name};
}

# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# CTL METHODS
# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# start instance
sub start {
	my ($self) = @_;

	# setup sinal hanlers
	foreach my $key ( keys %SIG ) {
		$SIG{$key} = 'IGNORE';
	}
	$SIG{HUP} = sub { _signal_hndler_instance_reload_cfg($self); };
	$SIG{TERM} = $SIG{INT} = sub { stop($self); };

	# required dirs
	my $var_path = $self->{'var_path'};
	my $tmp_path = $self->{'tmp_path'};
	my $log_path = $self->{'log_path'};
	mkdir($var_path) unless ( -d $var_path );
	mkdir($tmp_path) unless ( -d $tmp_path );
	mkdir($log_path) unless ( -d $log_path );

	# www root
	my $www_path = _get_configuration( $self, 'server', 'www_root' );
	$self->{'www_enable'} = ( _get_configuration( $self, 'server', 'www_enable' ) eq 'true' ? 1 : 0 );
	if ( $self->{'www_enable'} ) {
		$www_path = ( $www_path eq 'default' ? $self->{'www_path'} : $www_path );
		$self->{'www_path'} = $www_path;
		mkdir($www_path) unless ( -d $www_path );
		$self->{logger}->debug( "*** www is enabled and use path: " . $www_path . ' ***' );
	}
	else {
		$self->{logger}->debug("*** www is disabled ***");
	}

	# check on other instance is running
	my $pid = _pid_read($self);
	if ( $pid > 0 ) {
		if ( _pid_is_alive( $self, $pid ) ) {
			die WSP::WspException->new("Instance already running, pid=$pid");
		}
		_pid_delete($self);
	}
	_pid_write($self);

	# init hash
	$self->{dhash} =
	  Shared::Hash->new(
		persist => 0,
		path    => $var_path . "/ipc_default.data"
	  ),

	  # init snd start http server
	  $self->{httpd} = WSP::WspCore::HttpServerSimple->new($self);
	$self->servlet_register( RPC_PATH, WSP::WspCore::RpcServlet->new($self) );

	# load modules
	my $mdirs = [];
	_list_dirs(
		$self,
		$self->{home} . '/modules',
		sub { push( @{$mdirs}, shift ); }
	);

	for my $dir (@$mdirs) {
		_list_files(
			$self, $dir,
			sub {
				my $mfile = shift;
				next if ( $mfile !~ /\.pm$/ );

				# load
				$@ = "";
				my $minst = eval("require(\"$mfile\")");
				unless ($minst) {
					die WSP::WspException->new("Can't load module: $@");
				}
				if ( !exists( $minst->{class_name} ) ) {
					die WSP::WspException->new("Can't identify class: $mfile");
				}

				# init
				$@ = "";
				eval { $minst->init($self); } || do {
					my $exc = $@;
					die WSP::WspException->new( "Can't init module: "
						  . $minst->get_class_name()
						  . ", error: "
						  . $exc );
				};
				my $class_name = $minst->get_class_name();
				push( @{ $self->{modules} }, $minst );

				#
				$self->{'logger'}->debug("Module loaded: $class_name");
			}
		);
	}

	# start modules
	my $modules = $self->{modules};
	foreach my $minst (@$modules) {
		$@ = "";
		eval { $minst->start(); } || do {
			my $exc = $@;
			die WSP::WspException->new( "Failed to start module: "
				  . $minst->get_class_name()
				  . ", error: "
				  . $exc );
		  }
	}

	# set flags
	$self->{flag}->{running} = 1;
}

#
# stop instance
#
sub stop {
	my ($self) = @_;
	#
	if ( $self->{flag}->{running} ) {
		$self->{flag}->{shutdown} = 1;
	}
	else {
		my $pid = _pid_read($self);
		if ( $pid < 0 ) {
			$self->{logger}->warn("Instance is not running!");
		}
		else {
			_pid_terminate( $self, $pid );
		}
	}
}

#
# main loop
#
sub loop {
	my ($self) = @_;
	my $group = _get_configuration( $self, 'server', 'group' );
	my $user  = _get_configuration( $self, 'server', 'user' );
	$self->{httpd}
	  ->run(    # see details: https://metacpan.org/pod/Net::Server::Fork
		server_revision => "Apache/2.1.0",
		server_type => 'Fork', #'PreFork' DON'T USE PREFORK (not correct worked)
		port => _get_configuration( $self, 'server', 'port' ),
		host => _get_configuration( $self, 'server', 'address' ),
		group => ( $group eq 'undef' ? undef : $group ),
		user  => ( $user eq 'undef'  ? undef : $user ),
		max_servers    => _get_configuration( $self, 'server', 'workers' ),
		min_servers    => 1,
		check_for_dead => 30                         # sec
	  );
}

# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# PUBLIC API
# --------------------------------------------------------------------------------------------------------------------------------------------------------------
sub rpc_service_register {
	my ( $self, $service_name, $instance ) = @_;
	#
	unless ($service_name) {
		die WSP::WspException->new("Argument 'srvc_name' not defined");
	}
	unless ($instance) {
		die WSP::WspException->new("Argument 'instance' not defined");
	}
	#
	my $services = $self->{'services'};
	#
	if ( exists( $services->{$service_name} ) ) {
		$self->{logger}->warn("Service has overwritten: $service_name");
	}
	$services->{$service_name} = $instance;
	#
	$self->{logger}->debug(
		"Service added: $service_name (" . $instance->get_class_name() . ")" );
}

sub rpc_service_unregister {
	my ( $self, $service_name ) = @_;
	#
	unless ($service_name) {
		die WSP::WspException->new("Argument 'service_name' not defined");
	}
	my $services = $self->{'services'};
	delete( $services->{$service_name} );
	#
	$self->{logger}->debug("Service deleted: $service_name");
}

sub rpc_service_lookup {
	my ( $self, $service_name ) = @_;
	#
	unless ($service_name) {
		return undef;
	}
	my $services = $self->{'services'};
	unless ( exists( $services->{$service_name} ) ) {
		return undef;
	}
	return $services->{$service_name};
}

sub servlet_register {
	my ( $self, $path, $instance ) = @_;
	#
	unless ($path) {
		die WSP::WspException->new("Argument 'path' not defined");
	}
	unless ($instance) {
		die WSP::WspException->new("Argument 'instance' not defined");
	}
	#
	my $servlets = $self->{'servlets'};
	$path = lc($path);
	$path =~ s/\*|\s//g;
	#
	if ( exists( $servlets->{$path} ) ) {
		$self->{logger}->warn("Servlet has overwritten: $path");
	}
	$servlets->{$path} = $instance;
	#
	$self->{logger}
	  ->debug( "Servlet added: $path (" . $instance->get_class_name() . ")" );
}

sub servlet_unregister {
	my ( $self, $path ) = @_;
	#
	unless ($path) {
		die WSP::WspException->new("Argument 'path' not defined");
	}
	#
	my $servlets = $self->{'servlets'};
	$path = lc($path);
	$path =~ s/\*|\s//g;
	delete( $servlets->{$path} );
	#
	$self->{logger}->debug("Servlet deleted: $path");
}

sub servlet_lookup {
	my ( $self, $uri ) = @_;
	#
	unless ($uri) {
		return undef;
	}
	my $path     = lc($uri);
	my $servlets = $self->{'servlets'};
	unless ( exists( $servlets->{$path} ) ) {
		return undef;
	}
	return $servlets->{$path};
}

# store methods
sub store_put {
	my ( $self, $key, $value ) = @_;
	my $h = $self->{dhash};
	$h->set( $key => $value );
}

sub store_get {
	my ( $self, $key ) = @_;
	my $h = $self->{dhash};
	return $h->get($key);
}

# configuration methods
sub cfg_exists {
	my ( $self, $cfg_name ) = @_;
	my $cfg_id = lc($cfg_name);
	my $cfg_file = _cfg_make_file_name( $self, $cfg_id );
	#
	return 1 if ( -e $cfg_file );
}

sub cfg_load {    # laod exists (force) or create empty and call callback
	my ( $self, $cfg_name, $callback_fill_default ) = @_;
	my $cfg_id   = lc($cfg_name);
	my $cfg_file = _cfg_make_file_name( $self, $cfg_id );
	my $cfgmgr   = $self->{cfgmgr};
	my $cfg      = Config::INI::Simple->new($cfg_file);
	#
	unless ( keys(%$cfg) ) {
		if ($callback_fill_default) {
			$callback_fill_default->($cfg);
			$cfg->write($cfg_file);
		}
	}
	$cfgmgr->{$cfg_id} = $cfg;
	return $cfg;
}

sub cfg_save {    # update exists config
	my ( $self, $cfg_name ) = @_;
	my $cfg_id   = lc($cfg_name);
	my $cfg_file = _cfg_make_file_name( $self, $cfg_id );
	my $cfgmgr   = $self->{cfgmgr};
	my $cfg      = $cfgmgr->{$cfg_id};
	#
	return undef unless ($cfg);
	$cfg->write($cfg_file);
	#
	return 1;
}

sub cfg_get {
	my ( $self, $cfg_name, $section, $property ) = @_;
	my $cfg_id = lc($cfg_name);
	my $cfgmgr = $self->{cfgmgr};
	my $cfg    = $cfgmgr->{$cfg_id};
	#
	return undef unless ($cfg);
	return $cfg unless ( $section || $property );    # all config
	                                                 #
	$section = 'default' unless ( defined($section) );
	return $cfg->{$section}->{$property};
}

sub cfg_set {
	my ( $self, $cfg_name, $section, $property, $value ) = @_;
	my $cfg_id = lc($cfg_name);
	my $cfgmgr = $self->{cfgmgr};
	my $cfg    = $cfgmgr->{$cfg_id};
	#
	return undef unless ($cfg);
	$section = 'default' unless ( defined($section) );
	$cfg->{$section}->{$property} = $value;
	return 1;
}

# helper methods
sub get_path {
	my ( $self, $name ) = @_;
	return $self->{'home'}        if ( $name eq 'home' );
	return $self->{'var_path'}    if ( $name eq 'var' );
	return $self->{'tmp_path'}    if ( $name eq 'tmp' );
	return $self->{'log_path'}    if ( $name eq 'log' );
	return $self->{'www_path'}    if ( $name eq 'www' );
	return $self->{'config_path'} if ( $name eq 'cfg' );
	#
	return undef;
}

# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# PRIVATE
# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# get a path with home prefix
sub _cfg_make_file_name {
	my ( $self, $cfg_id ) = @_;
	if ( $cfg_id !~ /\.conf$/ ) {
		$cfg_id .= '.conf';
	}
	return $self->{config_path} . '/' . $cfg_id;
}

sub _get_configuration {
	my ( $self, $section, $property ) = @_;

	unless ( $section || $property ) {
		return $self->{config};
	}
	my $cfg = $self->{config};

	unless ( exists( $cfg->{$section} ) ) {
		return undef;
	}
	return $cfg->{$section}->{$property};
}

sub _list_dirs {
	my ( $self, $base, $cb ) = @_;
	#
	opendir( DIR, $base )
	  || die WSP::WspException->new("Can't read directory: $!");
	while ( my $file = readdir(DIR) ) {
		my $cdir = "$base/$file";
		$cb->($cdir) if ( -d $cdir && ( $file ne "." && $file ne ".." ) );
	}
	closedir(DIR);
}

sub _list_files {
	my ( $self, $base, $cb ) = @_;
	#
	opendir( DIR, $base ) || die WSP::WspException->new("Can't read directory: $!");
	while ( my $file = readdir(DIR) ) {
		my $cfile = "$base/$file";
		$cb->($cfile) if ( -f $cfile );
	}
	closedir(DIR);
}

sub _pid_read {
	my ($self) = @_;
	#
	return -1 unless ( -e $self->{pid_file} );
	#
	open( my $x, "<" . $self->{pid_file} ) || die WSP::WspException->new("Can't read pid file: $! (" . $self->{pid_file} . ")" );
	my $lpid = <$x>;
	close($x);
	chomp($lpid);
	#
	return $lpid;
}

sub _pid_write {
	my ($self) = @_;
	#
	open( my $x, ">" . $self->{pid_file} ) || die WSP::WspException->new("Can't write pid file: $! (" . $self->{pid_file} . ")" );
	print( $x "$$\n" );
	close($x);
}

sub _pid_delete {
	my ($self) = @_;
	#
	unlink( $self->{pid_file} );
}

sub _pid_terminate {
	my ( $self, $pid ) = @_;
	#
	kill 'TERM', $pid;
}

sub _pid_is_alive {
	my ( $self, $pid ) = @_;
	#
	return 0 unless ( kill( 0, $pid ) );
	return 1;
}

sub _signal_hndler_instance_reload_cfg { }

# --------------------------------------------------------------------------------------------------------------------------------------------------------------
# Helper
# --------------------------------------------------------------------------------------------------------------------------------------------------------------
{

	package WSP::WspCore::RpcServlet;
	use MIME::Base64;
	use WSP::JSON;
	use Data::Dumper;

	sub new ($$;$) {
		my ( $class, $wsp ) = @_;
		my $self = {
			class_name => $class,
			wsp        => $wsp,
			json	   => WSP::JSON->new(auto_bless => 1)
		};
		bless( $self, $class );
		$self->{'logger'} = Log::Log4perl::get_logger("WSP::WspCore::RpcServlet");
		return $self;
	}

	sub get_class_name {
		my ($self) = @_;
		return $self->{class_name};
	}

	sub execute_request {
		my ( $self, $cgi ) = @_;
		my $rpcrq = undef;
		#
		eval {		    
			$rpcrq = $self->{json}->decode( $cgi->param('POSTDATA') );
			unless ( exists( $rpcrq->{id} )
				|| exists( $rpcrq->{service} )
				|| exists( $rpcrq->{method} )
				|| exists( $rpcrq->{params} ) )
			{
				die WSP::WspException->new( "Bad request", 400 );
			}
		} or do {
			my $exc = $@;
			if ( ref $exc eq 'WSP::WspException' ) {
				die $exc;
			}
			$self->{'logger'}->error( "Cannot decode json data: " . $exc );
			die WSP::WspException->new( "Internal Server Error", 500 );
		};

		#
		my $service = $self->{'wsp'}->rpc_service_lookup( $rpcrq->{'service'} );
		unless ($service) {
			$self->send_response(
				{
					id     => $rpcrq->{'id'},
					result => undef,
					error  => {
						origin  => WSP::WspDefs::RPC_ORIGIN_SERVER,
						code    => WSP::WspDefs::RPC_ERROR_SERVICE_NOT_FOUND,
						message => 'Service not found'
					}
				}
			);
			return 1;
		}
		if ( $rpcrq->{'method'} !~ /^[_.a-zA-Z0-9]+$/ ) {
			$self->send_response(
				{
					id     => $rpcrq->{'id'},
					result => undef,
					error  => {
						origin  => WSP::WspDefs::RPC_ORIGIN_SERVER,
						code    => WSP::WspDefs::RPC_ERROR_ILLEGAL_SERVICE,
						message => 'Illegal service'
					}
				}
			);
			return 1;
		}

		#
		my $method = 'rpc_' . $rpcrq->{'method'};
		my $mtst   = $service->get_class_name() . '::' . $method;
		unless ( defined( &{$mtst} ) ) {
			$self->send_response(
				{
					id     => $rpcrq->{'id'},
					result => undef,
					error  => {
						origin  => WSP::WspDefs::RPC_ORIGIN_SERVER,
						code    => WSP::WspDefs::RPC_ERROR_METHOD_NOT_FOUND,
						message => 'Method not found'
					}
				}
			);
			return 1;
		}

		# decode header if pesent
		my $credentials = undef;
		my $auth_hdr    = $ENV{'HTTP_AUTHORIZATION'};
		if ($auth_hdr) {
			my ( $basic, $ucred ) = split( ' ', $auth_hdr );
			if ($basic) {
				my ( $user, $pass ) = split( ':', decode_base64($ucred) );
				if ( defined($user) && defined($pass) ) {
					$credentials =
					  { method => $basic, user => $user, password => $pass };
				}
			}
		}
		#
		my $crealip = $cgi->http('X-REAL-IP');
		my $security_context = {
			time       	=> time(),
			sessionId 	=> $cgi->http("X-SESSION-ID"),    	# custom header
			userData	=> $cgi->http("X-USER-DATA"),  		# custom header
			userAgent	=> $cgi->http("HTTP_USER_AGENT"),  	# custom header
			remoteIp   	=> ($crealip ? $crealip : $ENV{'REMOTE_ADDR'}),
			credentials 	=> $credentials
		};
		#
		my $result;
		$@ = '';
		eval {
			$result = $service->$method( $security_context, @{ $rpcrq->{'params'} } );
		};
		if ($@) {
			my $exc = $@;
			if ( ref $exc eq 'WSP::WspException' ) {
				$self->send_response(
					{
						id     => $rpcrq->{'id'},
						result => undef,
						error  => {
							origin  => WSP::WspDefs::RPC_ORIGIN_METHOD,
							code    => $exc->{'code'},
							message => $exc->{'message'}
						}
					}
				);
			}
			else {
				$self->send_response(
					{
						id     => $rpcrq->{'id'},
						result => undef,
						error  => {
							origin => WSP::WspDefs::RPC_ORIGIN_METHOD,
							code   => WSP::WspDefs::RPC_ERR_CODE_INTERNAL_ERROR,
							message => 'See log for details'
						}
					}
				);
			}
			$self->{logger}->error( "Exception on method call ($mtst) :  " . $exc );
		}
		else {
			$self->send_response({ id => $rpcrq->{'id'}, result => $result, error => undef } );
		}
		return 1;
	}

	sub send_response {
		my ( $self, $response ) = @_;
		print "Content-type: application/json; charset=UTF-8\n";
		print "Date: " . localtime( time() ) . "\n\n";
		print $self->{json}->encode($response);
	}
};

# ------------------------------------------------------------------------------------------------------------------------------------------------------
{

	package WSP::WspCore::HttpServerSimple;
	use CGI;
	use base qw(Net::Server::HTTP);

	sub new {
		my ( $class, @args ) = @_;
		my $self = $class->SUPER::new(@args);
		#
		$self->{logger} =
		  Log::Log4perl::get_logger("WSP::WspCore::HttpServerSimple");
		$self->{'server'}->{'no_exit_on_close'} = 0;
		$self->{'server'}->{logger}             = $self->{logger};
		$self->{'server'}->{'wsp'}              = $args[0];
		#
		return $self;
	}

	sub pre_server_close_hook {
		my ($self) = @_;
		my $modules = $self->{'server'}->{'modules'};
		foreach my $minst ( reverse(@$modules) ) {
			$@ = "";
			eval { $minst->stop(); } || do {
				my $exc = $@;
				$self->{logger}->warn( "Exception on trying to stop module: "
					  . $minst->get_class_name()
					  . ", error: "
					  . $exc );
			  }
		}
		$self->{'server'}->{'wsp'}->_pid_delete();
	}

	# only for modified PreFork.pm
	sub idle_loop_hook2 {
		my ($self) = @_;
		return
		  if ( $self->{'server'}->{'flag'}->{'shutdown'} );

	}

	sub process_http_request {
		my ($self)   = @_;
		my $cgi      = CGI->new;
		my $wsp      = $self->{'server'}->{'wsp'};
		my $www_root = $wsp->get_path('www');
		my $servlet  = $wsp->servlet_lookup( $cgi->path_info() );

		#
		unless ($servlet) {
			if ( $wsp->{'www_enable'} ) {
				if ( $ENV{'REQUEST_METHOD'} eq 'GET' ) {
					my $fname = $cgi->path_info();
					$fname =~ s/\.\.|\%|\\|\||\>|\<//g;
					if ( $fname eq '/' ) {
						$fname = '/' . $wsp->_get_configuration( 'server', 'welcome_file' )
						  if ( $fname eq '/' );
					}
					my $ep = $www_root . $fname;
					my $r = open( my $fh, '<', $ep );
					if ($r) {
						print $cgi->header;
						while ( my $line = <$fh> ) { print $line; }
						close($fh);
						return;
					}
				}
			}
			print "Status: 404 Not Found\n";
			print "Content-Type: text/html; charset=UTF-8\n";
			print "Date: " . localtime( time() ) . "\n\n";
			print "<title>404 Not Found</title>\n";
			print "<h1>404 Not Found</h1>\n";
			return;
		}
		$@ = "";
		eval { $servlet->execute_request($cgi); } || do {
			my $exc = $@;
			if ($exc) {
				if ( ref $exc eq 'WSP::WspException' ) {
					if ( $exc->{'code'} < 1000 && $exc->{'code'} > 0) {
						$self->{logger}->warn( "Failed to execute servlet: "
							  . $servlet->get_class_name()
							  . ", error: "
							  . $exc );
						print "Status: "
						  . $exc->{'code'} . ' '
						  . $exc->{'message'} . "\n";
						print "Content-Type: text/html; charset=UTF-8\n";
						print "Date: " . localtime( time() ) . "\n\n";
						print "<title>"
						  . $exc->{'code'} . ' '
						  . $exc->{'message'}
						  . "</title>\n";
						print "<h1>"
						  . $exc->{'code'} . ' '
						  . $exc->{'message'}
						  . "</h1>\n";
						return;
					}
				}
				$self->{logger}->warn( "Failed to execute servlet: "
					  . $servlet->get_class_name()
					  . ", error: "
					  . $exc || $cgi->cgi_error );
				print "Status: 500 Internal Server Error\n";
				print "Content-Type: text/html; charset=UTF-8\n";
				print "Date: " . localtime( time() ) . "\n\n";
				print "\n";
				print "<title>500 Internal Server Error</title>\n";
				print "<h1>500 Internal Server Error</h1>\n";
				return;
			}
		  }
	}
}
#
1;
