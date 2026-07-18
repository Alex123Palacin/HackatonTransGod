from django.contrib import admin

from .models import Escaneo


@admin.register(Escaneo)
class EscaneoAdmin(admin.ModelAdmin):
    list_display = (
        "id_escaneo",
        "usuario",
        "ave_detectada",
        "confianza",
        "reconocido",
        "fecha",
    )
    list_filter = ("reconocido", "fecha")
    search_fields = ("usuario__correo", "ave_detectada__nombre")
    readonly_fields = ("fecha",)
