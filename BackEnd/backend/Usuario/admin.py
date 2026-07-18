from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count, Q

from Catalogo.models import Ave, AveEncontrada

from .forms import (
    CuentaAdministrativaChangeForm,
    CuentaAdministrativaCreationForm,
)
from .models import CuentaAdministrativa, CuentaAplicacion


class AveEncontradaInline(admin.TabularInline):
    model = AveEncontrada
    fk_name = "usuario"
    extra = 0
    fields = ("ave", "fecha_encontrada", "escaneo")
    readonly_fields = fields
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(CuentaAplicacion)
class CuentaAplicacionAdmin(admin.ModelAdmin):
    list_display = (
        "id_usuario",
        "nombre",
        "correo",
        "total_aves_encontradas",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("correo", "nombre")
    ordering = ("nombre",)
    fields = (
        "id_usuario",
        "nombre",
        "correo",
        "is_active",
        "total_aves_encontradas",
        "aves_pendientes",
    )
    readonly_fields = ("id_usuario", "total_aves_encontradas", "aves_pendientes")
    inlines = (AveEncontradaInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            cantidad_aves_encontradas=Count(
                "aves_encontradas",
                filter=Q(aves_encontradas__ave__activa=True),
                distinct=True,
            )
        )

    @admin.display(description="Aves encontradas", ordering="cantidad_aves_encontradas")
    def total_aves_encontradas(self, obj):
        cantidad = getattr(obj, "cantidad_aves_encontradas", None)
        if cantidad is not None:
            return cantidad
        return obj.aves_encontradas.filter(ave__activa=True).count()

    @admin.display(description="Aves pendientes")
    def aves_pendientes(self, obj):
        nombres = Ave.objects.filter(activa=True).exclude(
            hallazgos__usuario=obj
        ).values_list("nombre", flat=True)
        return ", ".join(nombres) or "Ninguna"

    def has_add_permission(self, request):
        return False


@admin.register(CuentaAdministrativa)
class CuentaAdministrativaAdmin(UserAdmin):
    add_form = CuentaAdministrativaCreationForm
    form = CuentaAdministrativaChangeForm
    model = CuentaAdministrativa

    list_display = (
        "id_usuario",
        "nombre",
        "correo",
        "is_active",
    )
    list_filter = ("is_superuser", "is_active")
    search_fields = ("correo", "nombre")
    ordering = ("nombre",)
    filter_horizontal = ("groups", "user_permissions")

    fieldsets = (
        ("Datos del administrador", {"fields": ("nombre", "correo", "password")}),
        (
            "Permisos administrativos",
            {
                "classes": ("collapse",),
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Acceso", {"fields": ("last_login",)}),
    )
    readonly_fields = ("last_login",)

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "correo",
                    "nombre",
                    "password1",
                    "password2",
                    "is_active",
                    "is_superuser",
                ),
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        obj.is_staff = True
        super().save_model(request, obj, form, change)
