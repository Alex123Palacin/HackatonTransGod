from django.contrib import admin

from .models import Atributo, AtributoAve, Ave, AveEncontrada, FotoAve


class FotoAveInline(admin.TabularInline):
    model = FotoAve
    extra = 0


class AtributoAveInline(admin.TabularInline):
    model = AtributoAve
    extra = 0


@admin.register(Ave)
class AveAdmin(admin.ModelAdmin):
    list_display = ("id_ave", "nombre", "nombre_cientifico", "activa")
    list_filter = ("activa",)
    search_fields = ("nombre", "nombre_cientifico")
    inlines = (FotoAveInline, AtributoAveInline)


@admin.register(FotoAve)
class FotoAveAdmin(admin.ModelAdmin):
    list_display = ("id_foto", "ave", "es_principal")
    list_filter = ("es_principal",)
    search_fields = ("ave__nombre", "descripcion")


@admin.register(Atributo)
class AtributoAdmin(admin.ModelAdmin):
    search_fields = ("nombre",)


@admin.register(AtributoAve)
class AtributoAveAdmin(admin.ModelAdmin):
    list_display = ("ave", "atributo", "valor", "es_destacado")
    list_filter = ("es_destacado", "atributo")
    search_fields = ("ave__nombre", "atributo__nombre", "valor")


@admin.register(AveEncontrada)
class AveEncontradaAdmin(admin.ModelAdmin):
    list_display = ("id_ave_encontrada", "usuario", "ave", "fecha_encontrada")
    list_filter = ("fecha_encontrada",)
    search_fields = ("usuario__correo", "ave__nombre")
    readonly_fields = ("fecha_encontrada",)
