from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_api

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'aircraft', views_api.AircraftViewSet)
router.register(r'flights', views_api.FlightViewSet)
router.register(r'team-members', views_api.TeamMemberViewSet)
router.register(r'acknowledgments', views_api.AcknowledgmentViewSet)
router.register(r'shuttles', views_api.ShuttleInformationViewSet)
router.register(r'actions', views_api.TeamActionViewSet)

# API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    # Include auth endpoints for browsable API
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]
