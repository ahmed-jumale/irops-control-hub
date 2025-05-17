from django.middleware.csrf import CsrfViewMiddleware

class CsrfExemptMiddleware(CsrfViewMiddleware):
    """
    Middleware that exempts admin login from CSRF validation during development.
    IMPORTANT: This should only be used in development environments!
    """
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Exempt admin login during development
        if request.path.startswith('/admin/login/'):
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)
