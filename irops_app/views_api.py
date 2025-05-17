from rest_framework import viewsets, permissions, filters, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Aircraft,
    Flight,
    TeamMember,
    Acknowledgment,
    ShuttleInformation,
    TeamAction
)
from .serializers import (
    AircraftSerializer,
    FlightSerializer,
    TeamMemberSerializer,
    AcknowledgmentSerializer,
    ShuttleInformationSerializer,
    TeamActionSerializer,
    AircraftDetailSerializer,
    FlightDetailSerializer
)


class AircraftViewSet(viewsets.ModelViewSet):
    """API endpoint for Aircraft."""
    queryset = Aircraft.objects.all().order_by('tail_number')
    serializer_class = AircraftSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tail_number']
    search_fields = ['tail_number']
    ordering_fields = ['tail_number']
    
    def get_serializer_class(self):
        """Return different serializer for retrieve actions."""
        if self.action == 'retrieve':
            return AircraftDetailSerializer
        return self.serializer_class


class FlightViewSet(viewsets.ModelViewSet):
    """API endpoint for Flights."""
    queryset = Flight.objects.all().order_by('-date', 'flight_number')
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['flight_number', 'date', 'irops_type', 'is_active']
    search_fields = ['flight_number', 'passenger_mix']
    ordering_fields = ['date', 'flight_number', 'irops_type']
    
    def get_serializer_class(self):
        """Return different serializer for retrieve actions."""
        if self.action == 'retrieve':
            return FlightDetailSerializer
        return self.serializer_class
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active flights."""
        active_flights = Flight.objects.filter(is_active=True).order_by('-date', 'flight_number')
        serializer = self.get_serializer(active_flights, many=True)
        return Response(serializer.data)


class TeamMemberViewSet(viewsets.ModelViewSet):
    """API endpoint for Team Members."""
    queryset = TeamMember.objects.all().order_by('team', 'name')
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['team', 'role']
    search_fields = ['name', 'role']
    ordering_fields = ['name', 'team', 'role']
    
    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Group team members by team category."""
        teams = {}
        for team_choice, _ in TeamMember.TEAM_CHOICES:
            team_members = TeamMember.objects.filter(team=team_choice)
            serializer = self.get_serializer(team_members, many=True)
            teams[team_choice] = serializer.data
        return Response(teams)


class AcknowledgmentViewSet(viewsets.ModelViewSet):
    """API endpoint for Guest Acknowledgments."""
    queryset = Acknowledgment.objects.all().order_by('flight', 'name')
    serializer_class = AcknowledgmentSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['flight', 'last_comms', 'ack_status']
    search_fields = ['name']
    ordering_fields = ['name', 'flight', 'ack_status']
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Group acknowledgments by status."""
        statuses = {}
        for status_choice, _ in Acknowledgment.STATUS_CHOICES:
            acks = Acknowledgment.objects.filter(ack_status=status_choice)
            serializer = self.get_serializer(acks, many=True)
            statuses[status_choice] = serializer.data
        return Response(statuses)


class ShuttleInformationViewSet(viewsets.ModelViewSet):
    """API endpoint for Shuttle Information."""
    queryset = ShuttleInformation.objects.all().order_by('flight', 'shuttle_a_time')
    serializer_class = ShuttleInformationSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['flight', 'shuttle_company']
    search_fields = ['driver_name', 'shuttle_company']
    ordering_fields = ['shuttle_a_time', 'flight']


class TeamActionViewSet(viewsets.ModelViewSet):
    """API endpoint for Team Actions."""
    queryset = TeamAction.objects.all().order_by('status', 'action_name')
    serializer_class = TeamActionSerializer
    permission_classes = [AllowAny]  # Allow any access for development
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'assigned_team']
    search_fields = ['action_name', 'notes', 'assigned_team']
    ordering_fields = ['status', 'action_name', 'assigned_team']
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Group actions by status."""
        statuses = {}
        for status_choice, _ in TeamAction.STATUS_CHOICES:
            actions = TeamAction.objects.filter(status=status_choice)
            serializer = self.get_serializer(actions, many=True)
            statuses[status_choice] = serializer.data
        return Response(statuses)
