from django.contrib.auth import get_user_model
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from google.oauth2 import id_token
from google.auth.transport import requests
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

# Google OAuth Client ID - use the client ID from your client_secret.json file
GOOGLE_CLIENT_ID = "39037736517-8le0a99shjhlpt0o55q4vm3rn98kbsf1.apps.googleusercontent.com"

class GoogleAuthView(views.APIView):
    """
    API endpoint that allows users to authenticate with Google OAuth
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        id_token_jwt = request.data.get("id_token")
        
        if not id_token_jwt:
            return Response(
                {"error": "ID token is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                id_token_jwt, 
                requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
            # Get user info from the token
            email = idinfo.get("email", "")
            
            # Check if the email is from aero.com domain
            if not email.endswith("@aero.com"):
                return Response(
                    {"error": "Only @aero.com email addresses are authorized"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if user exists in database, create if not
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create new user with data from Google
                user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=idinfo.get("given_name", ""),
                    last_name=idinfo.get("family_name", ""),
                )
                user.set_unusable_password()  # User will authenticate via Google
                user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Return tokens and user info
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
            
        except ValueError as e:
            # Invalid token
            logger.error(f"Google auth error: {str(e)}")
            return Response(
                {"error": "Invalid token"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            # Other errors
            logger.error(f"Authentication error: {str(e)}")
            return Response(
                {"error": "Authentication failed"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(views.APIView):
    """
    API endpoint to logout a user
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the request
            refresh_token = request.data.get('refresh')
            
            # Blacklist the refresh token
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({"success": "User logged out successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(views.APIView):
    """
    API endpoint to get user profile information
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'last_login': user.last_login,
        })
