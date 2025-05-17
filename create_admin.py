#!/usr/bin/env python
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'irops_project.settings')
django.setup()

# Import necessary models
from django.contrib.auth.models import User
from django.db.utils import IntegrityError

# Create superuser
def create_superuser():
    try:
        # Check if admin already exists
        if User.objects.filter(username='admin').exists():
            print("Superuser 'admin' already exists, skipping creation")
            return
        
        # Create superuser with simple password for development
        user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        print(f"Superuser created successfully: {user.username}")
    except IntegrityError:
        print("Error: Superuser already exists")
    except Exception as e:
        print(f"Error creating superuser: {e}")

if __name__ == '__main__':
    create_superuser()
