from rest_framework import serializers

from Scanner.models import Escaneo

from .models import Ave


def url_imagen(campo_imagen):
    if not campo_imagen:
        return None
    return campo_imagen.url


class AveCatalogoSerializer(serializers.ModelSerializer):
    imagen_principal = serializers.SerializerMethodField()
    encontrada = serializers.BooleanField(read_only=True)

    def get_imagen_principal(self, ave):
        fotos = getattr(ave, "fotos_ordenadas", [])
        return url_imagen(fotos[0].imagen) if fotos else None

    class Meta:
        model = Ave
        fields = (
            "id_ave",
            "nombre",
            "nombre_cientifico",
            "imagen_principal",
            "encontrada",
        )
        read_only_fields = fields


class AveDetalleSerializer(serializers.ModelSerializer):
    fotos = serializers.SerializerMethodField()
    atributos_destacados = serializers.SerializerMethodField()
    detalles = serializers.SerializerMethodField()
    encontrada = serializers.BooleanField(default=True, read_only=True)

    def get_fotos(self, ave):
        return [
            {
                "id_foto": foto.id_foto,
                "imagen": url_imagen(foto.imagen),
                "descripcion": foto.descripcion,
                "es_principal": foto.es_principal,
            }
            for foto in getattr(ave, "fotos_ordenadas", [])
        ]

    def get_atributos_destacados(self, ave):
        return [
            {
                "id": atributo.id_atributo_ave,
                "texto": atributo.valor or atributo.atributo.nombre,
            }
            for atributo in getattr(ave, "atributos_ordenados", [])
            if atributo.es_destacado
        ]

    def get_detalles(self, ave):
        detalles = []
        if ave.etiqueta_caracteristica and ave.caracteristicas:
            detalles.append(
                {
                    "id": f"ave-{ave.id_ave}",
                    "etiqueta": ave.etiqueta_caracteristica,
                    "descripcion": ave.caracteristicas,
                }
            )
        detalles.extend(
            {
                "id": atributo.id_atributo_ave,
                "etiqueta": atributo.atributo.nombre,
                "descripcion": atributo.valor,
            }
            for atributo in getattr(ave, "atributos_ordenados", [])
            if not atributo.es_destacado
        )
        return detalles

    class Meta:
        model = Ave
        fields = (
            "id_ave",
            "nombre",
            "nombre_cientifico",
            "descripcion",
            "encontrada",
            "fotos",
            "atributos_destacados",
            "detalles",
        )
        read_only_fields = fields


class AveDesconocidaSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    def get_imagen(self, escaneo):
        return url_imagen(escaneo.imagen)

    class Meta:
        model = Escaneo
        fields = ("id_escaneo", "imagen", "fecha")
        read_only_fields = fields
