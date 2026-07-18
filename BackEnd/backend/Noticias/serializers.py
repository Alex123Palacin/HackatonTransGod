from django.db import transaction
from rest_framework import serializers

from .models import Comunicado, ImagenPublicacion, Publicacion, Reporte


class ComunicadoSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    def get_imagen(self, comunicado):
        if not comunicado.imagen:
            return None
        return comunicado.imagen.url

    class Meta:
        model = Comunicado
        fields = (
            "id_comunicado",
            "titulo",
            "descripcion",
            "fecha",
            "imagen",
        )
        read_only_fields = fields


class PublicacionSerializer(serializers.ModelSerializer):
    imagenes = serializers.SerializerMethodField()
    autor = serializers.CharField(source="usuario.nombre", read_only=True)

    def get_imagenes(self, publicacion):
        return [imagen.imagen.url for imagen in publicacion.imagenes.all()]

    class Meta:
        model = Publicacion
        fields = (
            "id_publicacion",
            "autor",
            "titulo",
            "descripcion",
            "fecha",
            "imagenes",
        )
        read_only_fields = fields


class CrearPublicacionSerializer(serializers.ModelSerializer):
    imagenes = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        allow_empty=False,
        min_length=1,
        max_length=8,
        write_only=True,
    )

    class Meta:
        model = Publicacion
        fields = ("titulo", "descripcion", "imagenes")

    @transaction.atomic
    def create(self, validated_data):
        imagenes = validated_data.pop("imagenes")
        publicacion = Publicacion.objects.create(
            usuario=self.context["request"].user,
            **validated_data,
        )
        for imagen in imagenes:
            ImagenPublicacion.objects.create(
                publicacion=publicacion,
                imagen=imagen,
            )
        return publicacion


class ReporteSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    def get_imagen(self, reporte):
        if not reporte.imagen:
            return None
        return reporte.imagen.url

    class Meta:
        model = Reporte
        fields = (
            "id_reporte",
            "titulo",
            "descripcion",
            "imagen",
            "fecha",
            "estado",
        )
        read_only_fields = fields


class CrearReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = ("titulo", "descripcion", "imagen")
        extra_kwargs = {
            "imagen": {"required": False, "allow_null": True},
        }

    def create(self, validated_data):
        return Reporte.objects.create(
            usuario=self.context["request"].user,
            **validated_data,
        )
