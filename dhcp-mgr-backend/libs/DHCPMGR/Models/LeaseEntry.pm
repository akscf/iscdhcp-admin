# ******************************************************************************************
#
# @author AlexandrinK <aks@cforge.org>
# ******************************************************************************************
package DHCPMGR::Models::LeaseEntry;

use strict;
use constant MODEL_NAME         => 'DHCPMGR.Models.LeaseEntry';
use constant CLASS_NAME         => __PACKAGE__;

sub new ($$) {
        my ($class, %args) = @_;
        my %t = (
                class           => MODEL_NAME,
                name            => undef,
                ip              => undef,
                mac             => undef,
                state           => undef,
                startTime       => undef,
                endTime         => undef
        );
        my $self= {%t, %args};
        bless( $self, $class );
}

sub get_class_name {
        my ($self) = @_;
        return $self->{class};
}

sub name {
        my ($self, $val) = @_;
        return $self->{name} unless(defined($val));
        $self->{name} = $val;
}

sub ip {
        my ($self, $val) = @_;
        return $self->{ip} unless(defined($val));
        $self->{ip} = $val;
}

sub mac {
        my ($self, $val) = @_;
        return $self->{mac} unless(defined($val));
        $self->{mac} = $val;
}

sub state {
        my ($self, $val) = @_;
        return $self->{state} unless(defined($val));
        $self->{state} = $val;
}

sub startTime {
        my ($self, $val) = @_;
        return $self->{startTime} unless(defined($val));
        $self->{startTime} = $val;
}

sub endTime {
        my ($self, $val) = @_;
        return $self->{endTime} unless(defined($val));
        $self->{endTime} = $val;
}

# -------------------------------------------------------------------------------------------
1;