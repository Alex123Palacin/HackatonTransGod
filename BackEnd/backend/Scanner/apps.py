from django.apps import AppConfig


class ScannerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Scanner'
    label = 'scanner'

    def ready(self):
        from . import signals  # noqa: F401
