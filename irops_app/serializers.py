from rest_framework import serializers
from .models import (
    Aircraft,
    Flight,
    TeamMember,
    Acknowledgment,
    ShuttleInformation,
    TeamAction
)

class FlightSerializer(serializers.ModelSerializer):
    """Serializer for Flight model."""
    class Meta:
        model = Flight
        fields = '__all__'


class AircraftSerializer(serializers.ModelSerializer):
    """Serializer for Aircraft model."""
    assigned_flights = FlightSerializer(many=True, read_only=True)
    
    class Meta:
        model = Aircraft
        fields = '__all__'
    
    # Custom method to handle nested flight objects when needed
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # To reduce payload size for list views
        if self.context.get('request') and self.context['request'].query_params.get('no_flights'):
            data.pop('assigned_flights')
        return data


class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer for TeamMember model."""
    team_display = serializers.CharField(source='get_team_display', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'team', 'team_display']


class AcknowledgmentSerializer(serializers.ModelSerializer):
    """Serializer for Acknowledgment model."""
    flight_number = serializers.CharField(source='flight.flight_number', read_only=True)
    last_comms_display = serializers.CharField(source='get_last_comms_display', read_only=True)
    ack_status_display = serializers.CharField(source='get_ack_status_display', read_only=True)
    
    class Meta:
        model = Acknowledgment
        fields = ['id', 'name', 'flight', 'flight_number', 'last_comms', 
                  'last_comms_display', 'ack_status', 'ack_status_display']


class ShuttleInformationSerializer(serializers.ModelSerializer):
    """Serializer for ShuttleInformation model."""
    flight_number = serializers.CharField(source='flight.flight_number', read_only=True)
    
    class Meta:
        model = ShuttleInformation
        fields = ['id', 'flight', 'flight_number', 'shuttle_a_time', 'pickup_a', 
                  'shuttle_b_time', 'pickup_b', 'shuttle_company', 
                  'driver_name', 'driver_phone']


class TeamActionSerializer(serializers.ModelSerializer):
    """Serializer for TeamAction model."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = TeamAction
        fields = ['id', 'action_name', 'assigned_team', 'status', 
                  'status_display', 'notes']


# More detailed serializers for individual records with related objects

class FlightDetailSerializer(FlightSerializer):
    """Detailed serializer for Flight model with related objects."""
    acknowledgments = AcknowledgmentSerializer(many=True, read_only=True)
    shuttles = ShuttleInformationSerializer(many=True, read_only=True)
    
    class Meta(FlightSerializer.Meta):
        fields = FlightSerializer.Meta.fields + ['acknowledgments', 'shuttles']


class AircraftDetailSerializer(AircraftSerializer):
    """Detailed serializer for Aircraft model."""
    class Meta(AircraftSerializer.Meta):
        pass
    
    # Custom method to handle nested flight objects with more details
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Replace flight IDs with detailed flight objects when detailed=True
        if self.context.get('request') and self.context['request'].query_params.get('detailed'):
            # Get assigned flights and serialize them with the right serializer
            flights_data = []
            for flight in instance.assigned_flights.all():
                flights_data.append(FlightSerializer(flight).data)
            data['assigned_flights'] = flights_data
        return data
