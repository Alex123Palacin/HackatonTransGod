from django.contrib import admin

from .models import Comunicado, ImagenPublicacion, Publicacion, Reporte


class ImagenPublicacionInline(admin.TabularInline):
    model = ImagenPublicacion
    extra = 0


@admin.register(Comunicado)
class ComunicadoAdmin(admin.ModelAdmin):
    list_display = ("id_comunicado", "titulo", "fecha", "activo")
    list_filter = ("activo", "fecha")
    search_fields = ("titulo", "descripcion")


@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ("id_publicacion", "titulo", "usuario", "fecha", "activa")
    list_filter = ("activa", "fecha")
    search_fields = ("titulo", "descripcion", "usuario__correo")
    readonly_fields = ("fecha",)
    inlines = (ImagenPublicacionInline,)


@admin.register(ImagenPublicacion)
class ImagenPublicacionAdmin(admin.ModelAdmin):
    list_display = ("id_imagen", "publicacion")
    search_fields = ("publicacion__titulo",)


@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ("id_reporte", "titulo", "usuario", "estado", "fecha")
    list_filter = ("estado", "fecha")
    search_fields = ("titulo", "descripcion", "usuario__correo")
    readonly_fields = ("fecha",)
