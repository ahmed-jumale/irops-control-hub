from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse
import os
import mimetypes
from django.conf import settings

def test_view(request):
    """Simple test view to verify template rendering"""
    return render(request, 'test.html')

def direct_serve_file(request, filename=None):
    """
    View to directly serve HTML files from the project root.
    If no filename is provided, serves index.html by default.
    """
    if filename is None:
        filename = 'index.html'
    
    # Ensure the filename has .html extension if it's meant to be an HTML file
    if not filename.endswith('.html') and not '.' in filename:
        filename += '.html'
    
    file_path = os.path.join(settings.BASE_DIR, filename)
    
    # Check if file exists
    if not os.path.exists(file_path):
        return HttpResponse(f"File {filename} not found", status=404)
    
    # Determine content type
    content_type, encoding = mimetypes.guess_type(file_path)
    if not content_type:
        content_type = 'text/html' if filename.endswith('.html') else 'application/octet-stream'
    
    # Return the file with proper content type
    return FileResponse(open(file_path, 'rb'), content_type=content_type)

def serve_static_file(request, path):
    """
    View to serve static files from the assets directory
    """
    file_path = os.path.join(settings.BASE_DIR, 'assets', path)
    if os.path.exists(file_path):
        # Guess the content type of the file
        content_type, encoding = mimetypes.guess_type(file_path)
        # Serve the file with the correct content type
        return FileResponse(open(file_path, 'rb'), content_type=content_type)
    return HttpResponse('File not found', status=404)
