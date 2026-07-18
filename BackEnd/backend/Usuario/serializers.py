from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .models import CuentaAplicacion


PASSWORD_FICTICIO = make_password("Contrasena-ficticia-para-comparacion")


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaAplicacion
        fields = ("id_usuario", "nombre", "correo")
        read_only_fields = fields


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    correo = serializers.EmailField(max_length=254, validators=[])
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        min_length=8,
    )

    class Meta:
        model = CuentaAplicacion
        fields = ("id_usuario", "nombre", "correo", "password")
        read_only_fields = ("id_usuario",)

    def validate_correo(self, correo):
        correo_normalizado = correo.strip().lower()
        if CuentaAplicacion.objects.filter(
            correo__iexact=correo_normalizado
        ).exists():
            raise serializers.ValidationError("Ya existe una cuenta con este correo.")
        return correo_normalizado

    def validate_nombre(self, nombre):
        nombre_limpio = nombre.strip()
        if not nombre_limpio:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return nombre_limpio

    def validate(self, attrs):
        usuario = CuentaAplicacion(
            nombre=attrs["nombre"],
            correo=attrs["correo"],
        )
        try:
            validate_password(attrs["password"], user=usuario)
        except DjangoValidationError as error:
            raise serializers.ValidationError(
                {"password": list(error.messages)}
            ) from error
        return attrs

    def create(self, validated_data):
        return CuentaAplicacion.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        correo = attrs["correo"].strip().lower()
        cuenta = CuentaAplicacion.objects.filter(correo__iexact=correo).first()
        password_hash = cuenta.password if cuenta else PASSWORD_FICTICIO
        password_correcto = check_password(attrs["password"], password_hash)

        if not cuenta or not cuenta.is_active or not password_correcto:
            raise AuthenticationFailed("Correo o contrasena incorrectos.")

        attrs["usuario"] = cuenta
        return attrs


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField(trim_whitespace=False)

