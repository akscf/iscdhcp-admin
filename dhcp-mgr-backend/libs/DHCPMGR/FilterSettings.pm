# ******************************************************************************************
# Search settings
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::FilterSettings;

use strict;
use constant MODEL_NAME  	=> 'DHCPMGR.FilterSettings';
use constant CLASS_NAME  	=> __PACKAGE__;

sub new ($$) {
        my ($class, %args) = @_;
        my %t = (        
                class  			=> MODEL_NAME,
                offset			=> undef,
                count           => undef,
                orderType       => undef,
                orderFields     => undef
        );
        my $self= {%t, %args};        
        bless( $self, $class );
}

sub get_class_name {
        my ($self) = @_;
        return $self->{class};
}

sub offset {
	my ($self, $val) = @_;
	return $self->{offset} + 0 unless(defined($val));
	$self->{offset} = $val + 0;
}

sub count {
	my ($self, $val) = @_;
	return $self->{count} + 0 unless(defined($val));
	$self->{count} = $val + 0;
}

# ASC / DESC
sub orderType {
	my ($self, $val) = @_;
	return $self->{orderType} unless(defined($val));
	$self->{orderType} = $val;
}

# field name
sub orderFields {
	my ($self, $val) = @_;
	return $self->{orderFields} unless(defined($val));
	$self->{orderFields} = $val;
}

# -------------------------------------------------------------------------------------------
1;
