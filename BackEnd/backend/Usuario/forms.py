from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import CuentaAdministrativa, Usuario


class UsuarioCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Contrasena", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Confirmar contrasena",
        widget=forms.PasswordInput,
    )

    class Meta:
        model = Usuario
        fields = ("correo", "nombre")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contrasenas no coinciden.")
        return password2

    def save(self, commit=True):
        usuario = super().save(commit=False)
        usuario.set_password(self.cleaned_data["password1"])
        if commit:
            usuario.save()
        return usuario


class UsuarioChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label="Contrasena")

    class Meta:
        model = Usuario
        fields = (
            "correo",
            "nombre",
            "password",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions",
        )


class CuentaAdministrativaCreationForm(UsuarioCreationForm):
    class Meta(UsuarioCreationForm.Meta):
        model = CuentaAdministrativa


class CuentaAdministrativaChangeForm(UsuarioChangeForm):
    class Meta(UsuarioChangeForm.Meta):
        model = CuentaAdministrativa
