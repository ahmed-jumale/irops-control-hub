from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html

from .models import (
    Aircraft,
    Flight,
    TeamMember,
    Acknowledgment,
    ShuttleInformation,
    TeamAction,
    AdminControl
)


# Inlines
class AcknowledgmentInline(admin.TabularInline):
    model = Acknowledgment
    extra = 0
    fields = ('name', 'last_comms', 'ack_status')


class ShuttleInformationInline(admin.StackedInline):
    model = ShuttleInformation
    extra = 0
    fieldsets = (
        ('Shuttle A', {
            'fields': ('shuttle_a_time', 'pickup_a')
        }),
        ('Shuttle B', {
            'fields': ('shuttle_b_time', 'pickup_b'),
            'classes': ('collapse',),
        }),
        ('Driver Information', {
            'fields': ('shuttle_company', 'driver_name', 'driver_phone')
        }),
    )


# Main Admin Classes
@admin.register(Aircraft)
class AircraftAdmin(admin.ModelAdmin):
    list_display = ('tail_number', 'display_assigned_flights')
    search_fields = ('tail_number',)
    filter_horizontal = ('assigned_flights',)
    
    def display_assigned_flights(self, obj):
        return ", ".join([flight.flight_number for flight in obj.assigned_flights.all()[:3]])
    display_assigned_flights.short_description = "Assigned Flights"


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'date', 'etd', 'eta', 'new_etd_eta', 
                    'pax_count', 'irops_type', 'is_active')
    list_filter = ('date', 'irops_type', 'is_active')
    search_fields = ('flight_number',)
    date_hierarchy = 'date'
    inlines = [AcknowledgmentInline, ShuttleInformationInline]
    fieldsets = (
        ('Flight Information', {
            'fields': ('flight_number', 'date')
        }),
        ('Schedule', {
            'fields': ('etd', 'eta', 'new_etd_eta')
        }),
        ('Passengers', {
            'fields': ('pax_count', 'passenger_mix')
        }),
        ('IROPS Details', {
            'fields': ('irops_type', 'is_active')
        }),
    )


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'team')
    list_filter = ('team',)
    search_fields = ('name', 'role')
    list_editable = ('role',)
    fieldsets = (
        (None, {
            'fields': ('name', 'role', 'team')
        }),
    )


@admin.register(Acknowledgment)
class AcknowledgmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'flight_number', 'last_comms', 'display_ack_status')
    list_filter = ('last_comms', 'ack_status')
    search_fields = ('name', 'flight__flight_number')
    
    def flight_number(self, obj):
        return obj.flight.flight_number
    flight_number.short_description = "Flight"
    
    def display_ack_status(self, obj):
        status_colors = {
            'success': 'green',
            'warning': 'orange',
            'failed': 'red'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            status_colors.get(obj.ack_status, 'black'),
            obj.get_ack_status_display()
        )
    display_ack_status.short_description = "Status"


@admin.register(ShuttleInformation)
class ShuttleInformationAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'shuttle_a_time', 'pickup_a', 
                    'shuttle_company', 'driver_name')
    list_filter = ('shuttle_company',)
    search_fields = ('flight__flight_number', 'driver_name')
    
    def flight_number(self, obj):
        return obj.flight.flight_number
    flight_number.short_description = "Flight"


@admin.register(TeamAction)
class TeamActionAdmin(admin.ModelAdmin):
    list_display = ('action_name', 'assigned_team', 'display_status')
    list_filter = ('status', 'assigned_team')
    search_fields = ('action_name', 'assigned_team', 'notes')
    list_editable = ('assigned_team',)
    
    def display_status(self, obj):
        status_colors = {
            'pending': 'orange',
            'in_progress': 'blue',
            'complete': 'green'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            status_colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    display_status.short_description = "Status"


# Custom Admin Control (Only visible to superusers)
class AdminControlAdmin(admin.ModelAdmin):
    list_display = ('user', 'approved_by', 'approval_date')
    readonly_fields = ('approval_date',)
    search_fields = ('user__username', 'user__email')
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only for new objects
            obj.approved_by = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.none()  # Non-superusers see nothing
    
    def has_module_permission(self, request):
        return request.user.is_superuser
    
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser
    
    def has_add_permission(self, request):
        return request.user.is_superuser
    
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


admin.site.register(AdminControl, AdminControlAdmin)


# Customize User Admin for superuser
class CustomUserAdmin(UserAdmin):
    """
    Custom User Admin that allows superusers to create staff and superuser accounts.
    """
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if not obj and request.user.is_superuser:
            # For creation form, add is_staff and is_superuser fields to first fieldset
            fieldsets[0][1]['fields'] = fieldsets[0][1]['fields'] + ('is_staff', 'is_superuser')
        return fieldsets
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            if 'is_staff' in form.base_fields:
                form.base_fields['is_staff'].disabled = True
            if 'is_superuser' in form.base_fields:
                form.base_fields['is_superuser'].disabled = True
        return form


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
