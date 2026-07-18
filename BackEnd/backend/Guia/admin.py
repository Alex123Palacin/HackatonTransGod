from django.contrib import admin

from .models import Conversacion, Mensaje


class MensajeInline(admin.TabularInline):
    model = Mensaje
    extra = 0


@admin.register(Conversacion)
class ConversacionAdmin(admin.ModelAdmin):
    list_display = ("id_conversacion", "titulo", "usuario", "fecha")
    list_filter = ("fecha",)
    search_fields = ("titulo", "usuario__correo")
    readonly_fields = ("fecha",)
    inlines = (MensajeInline,)


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ("id_mensaje", "conversacion", "emisor")
    list_filter = ("emisor",)
    search_fields = ("mensaje", "conversacion__titulo")
