from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from irops_app.views_auth import GoogleAuthView, LogoutView, UserProfileView

urlpatterns = [
    # JWT Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Google OAuth endpoint
    path('google/', GoogleAuthView.as_view(), name='google_auth'),
    
    # Logout endpoint
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # User profile endpoint
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]
