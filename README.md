# IROPS Control Hub

Backend for aviation operations dashboard using Django Admin with Grappelli.

## Setup Instructions

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

### 2. Initialize the Database

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser

A default superuser for Ahmed Jumale (ahmed.jumale@aero.com) is included in the fixtures.
To load it, use:

```bash
python manage.py loaddata initial_data
```

The default password is set to `password`. Please change it immediately after first login.

Alternatively, create a new superuser:

```bash
python manage.py createsuperuser
```

### 4. Run the Development Server

```bash
python manage.py runserver
```

Access the Django Admin at: http://127.0.0.1:8000/admin/

## Project Structure

- `irops_app/models.py` - Contains all data models
- `irops_app/admin.py` - Admin interface customization with Grappelli
- `irops_app/fixtures/` - Sample data for testing

## Admin Features

- **Aircraft Management**: Manage tail numbers and assigned flights
- **Flight Hub**: Track flights with IROPS status
- **Team Members**: Manage IROPS event team members
- **Acknowledgment / Communication**: Track guest communication status
- **Shuttle Information**: Manage transportation details
- **Team Actions**: Log and track follow-up tasks

## Admin Control

Only superusers can access the "Admin Control" section to manually approve new admin accounts.

## Integration Notes

The Django Admin backend is completely separate from the dashboard frontend.
Frontend already uses Google Auth restricted to @aero.com accounts.

## Security Notes

In production:
- Change the secret key
- Set DEBUG=False
- Update allowed hosts
- Consider using a stronger database like PostgreSQL
