from django.db import models
from django.contrib.auth.models import User

class Flight(models.Model):
    """Model representing a flight in the IROPS Control Hub system."""
    IROPS_TYPE_CHOICES = (
        ('diversion', 'Diversion'),
        ('redispatch', 'Re-Dispatch'),
        ('delay', 'Delay'),
        ('cancellation', 'Cancellation'),
        ('other', 'Other')
    )
    
    flight_number = models.CharField(max_length=20, verbose_name="Flight Number")
    date = models.DateField(verbose_name="Flight Date")
    etd = models.DateTimeField(verbose_name="Estimated Time of Departure")
    eta = models.DateTimeField(verbose_name="Estimated Time of Arrival")
    new_etd_eta = models.DateTimeField(null=True, blank=True, verbose_name="New ETD/ETA")
    pax_count = models.PositiveIntegerField(default=0, verbose_name="Passenger Count")
    passenger_mix = models.TextField(blank=True, verbose_name="Passenger Mix")
    irops_type = models.CharField(
        max_length=20, 
        choices=IROPS_TYPE_CHOICES, 
        default='delay',
        verbose_name="IROPS Type"
    )
    is_active = models.BooleanField(default=True, verbose_name="Active Status")
    
    def __str__(self):
        return f"{self.flight_number} ({self.date})"
    
    class Meta:
        verbose_name = "Flight"
        verbose_name_plural = "Flights"
        ordering = ['-date', 'flight_number']


class Aircraft(models.Model):
    """Model representing an aircraft in the IROPS Control Hub system."""
    tail_number = models.CharField(max_length=10, unique=True, verbose_name="Tail Number")
    assigned_flights = models.ManyToManyField(
        Flight, 
        related_name='assigned_aircraft',
        blank=True,
        verbose_name="Assigned Flights"
    )
    
    def __str__(self):
        return self.tail_number
    
    class Meta:
        verbose_name = "Aircraft"
        verbose_name_plural = "Aircraft"
        ordering = ['tail_number']


class TeamMember(models.Model):
    """Model representing a team member in the IROPS event team."""
    TEAM_CHOICES = (
        ('exec', 'Executive'),
        ('digital', 'Digital'),
        ('concierge', 'Concierge'),
        ('operations', 'Operations'),
        ('customer_service', 'Customer Service'),
        ('other', 'Other')
    )
    
    name = models.CharField(max_length=100, verbose_name="Name")
    role = models.CharField(max_length=100, verbose_name="Role")
    team = models.CharField(
        max_length=20, 
        choices=TEAM_CHOICES,
        verbose_name="Team"
    )
    
    def __str__(self):
        return f"{self.name} - {self.get_team_display()} ({self.role})"
    
    class Meta:
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
        ordering = ['team', 'name']


class Acknowledgment(models.Model):
    """Model for tracking guest acknowledgment status."""
    COMMUNICATION_CHOICES = (
        ('phone', 'Phone'),
        ('sms', 'SMS'),
        ('email', 'Email'),
        ('lounge', 'Lounge')
    )
    
    STATUS_CHOICES = (
        ('success', '✅'),
        ('warning', '⚠️'),
        ('failed', '❌')
    )
    
    name = models.CharField(max_length=100, verbose_name="Guest Name")
    flight = models.ForeignKey(
        Flight, 
        on_delete=models.CASCADE, 
        related_name='acknowledgments',
        verbose_name="Flight"
    )
    last_comms = models.CharField(
        max_length=10, 
        choices=COMMUNICATION_CHOICES,
        verbose_name="Last Communication Method"
    )
    ack_status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES,
        verbose_name="Acknowledgment Status"
    )
    
    def __str__(self):
        return f"{self.name} - {self.flight.flight_number} ({self.get_ack_status_display()})"
    
    class Meta:
        verbose_name = "Guest Acknowledgment"
        verbose_name_plural = "Guest Acknowledgments"
        ordering = ['flight', 'name']


class ShuttleInformation(models.Model):
    """Model for shuttle timing and driver information."""
    flight = models.ForeignKey(
        Flight, 
        on_delete=models.CASCADE, 
        related_name='shuttles',
        verbose_name="Flight"
    )
    shuttle_a_time = models.DateTimeField(verbose_name="Shuttle A Time")
    pickup_a = models.CharField(max_length=100, verbose_name="Pickup Location A")
    shuttle_b_time = models.DateTimeField(null=True, blank=True, verbose_name="Shuttle B Time")
    pickup_b = models.CharField(max_length=100, blank=True, verbose_name="Pickup Location B")
    shuttle_company = models.CharField(max_length=100, verbose_name="Shuttle Company")
    driver_name = models.CharField(max_length=100, verbose_name="Driver Name")
    driver_phone = models.CharField(max_length=20, verbose_name="Driver Phone")
    
    def __str__(self):
        return f"Shuttle for {self.flight.flight_number}"
    
    class Meta:
        verbose_name = "Shuttle Information"
        verbose_name_plural = "Shuttle Information"
        ordering = ['flight', 'shuttle_a_time']


class TeamAction(models.Model):
    """Model for logged IROPS follow-up tasks."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete')
    )
    
    action_name = models.CharField(max_length=200, verbose_name="Action Name")
    assigned_team = models.CharField(max_length=100, verbose_name="Assigned Team")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name="Status"
    )
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    def __str__(self):
        return f"{self.action_name} - {self.get_status_display()}"
    
    class Meta:
        verbose_name = "Team Action"
        verbose_name_plural = "Team Actions"
        ordering = ['status', 'action_name']


class AdminControl(models.Model):
    """
    Model for manual admin approval system.
    This is only visible to superusers and allows adding admin access.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="User")
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='approved_admins',
        verbose_name="Approved By"
    )
    approval_date = models.DateTimeField(auto_now_add=True, verbose_name="Approval Date")
    
    def __str__(self):
        return f"{self.user.username} - Approved by {self.approved_by.username}"
    
    class Meta:
        verbose_name = "Admin Control"
        verbose_name_plural = "Admin Controls"
        ordering = ['-approval_date']
