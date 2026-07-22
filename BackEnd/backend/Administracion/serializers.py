from datetime import date

from django.db import transaction
from rest_framework import serializers

from Catalogo.models import Atributo, AtributoAve, Ave, FotoAve
from Noticias.models import Comunicado, Publicacion, Reporte

from .servicios_archivos import programar_eliminacion_archivo


MAXIMO_IMAGEN_BYTES = 8 * 1024 * 1024
MAXIMO_FOTOS_AVE = 8
MAXIMO_ATRIBUTOS_AVE = 12


class CredencialesAdministrativasSerializer(serializers.Serializer):
    usuario = serializers.CharField(max_length=254, trim_whitespace=True)
    password = serializers.CharField(
        max_length=128,
        trim_whitespace=False,
        write_only=True,
    )


class ImagenAdministrativaField(serializers.ImageField):
    def to_internal_value(self, data):
        imagen = super().to_internal_value(data)
        if imagen.size > MAXIMO_IMAGEN_BYTES:
            raise serializers.ValidationError(
                "Cada imagen debe pesar como maximo 8 MB."
            )
        return imagen


def url_archivo(campo):
    return campo.url if campo else ""


class ReporteAdministrativoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_reporte", read_only=True)
    codigo = serializers.SerializerMethodField()
    solicitante = serializers.CharField(source="usuario.nombre", read_only=True)
    correoSolicitante = serializers.CharField(
        source="usuario.correo",
        read_only=True,
    )
    imagenUrl = serializers.SerializerMethodField()

    def get_codigo(self, reporte):
        return f"REP-{reporte.id_reporte:04d}"

    def get_imagenUrl(self, reporte):
        return url_archivo(reporte.imagen)

    class Meta:
        model = Reporte
        fields = (
            "id",
            "codigo",
            "solicitante",
            "correoSolicitante",
            "titulo",
            "descripcion",
            "fecha",
            "estado",
            "imagenUrl",
        )
        read_only_fields = fields


class ActualizarReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = ("estado",)


class ComunicadoAdministrativoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_comunicado", read_only=True)
    imagenUrl = serializers.SerializerMethodField()

    def get_imagenUrl(self, comunicado):
        return url_archivo(comunicado.imagen)

    class Meta:
        model = Comunicado
        fields = (
            "id",
            "titulo",
            "descripcion",
            "fecha",
            "imagenUrl",
            "activo",
        )
        read_only_fields = fields


class GuardarComunicadoSerializer(serializers.ModelSerializer):
    imagen = ImagenAdministrativaField(
        required=False,
        allow_null=True,
        allow_empty_file=False,
    )
    eliminar_imagen = serializers.BooleanField(
        required=False,
        default=False,
        write_only=True,
    )

    class Meta:
        model = Comunicado
        fields = (
            "titulo",
            "descripcion",
            "fecha",
            "imagen",
            "activo",
            "eliminar_imagen",
        )
        extra_kwargs = {
            "fecha": {"required": False, "default": date.today},
            "activo": {"required": False},
        }

    def create(self, validated_data):
        validated_data.pop("eliminar_imagen", None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        eliminar_imagen = validated_data.pop("eliminar_imagen", False)
        imagen_anterior = instance.imagen if instance.imagen else None

        if eliminar_imagen:
            validated_data["imagen"] = None

        actualizado = super().update(instance, validated_data)
        if (
            imagen_anterior
            and imagen_anterior.name
            and imagen_anterior.name != getattr(actualizado.imagen, "name", "")
        ):
            programar_eliminacion_archivo(imagen_anterior)
        return actualizado


class AveAdministrativaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_ave", read_only=True)
    nombreCientifico = serializers.CharField(
        source="nombre_cientifico",
        read_only=True,
    )
    etiqueta = serializers.CharField(
        source="etiqueta_caracteristica",
        read_only=True,
    )
    imagenUrl = serializers.SerializerMethodField()
    imagenes = serializers.SerializerMethodField()
    atributos = serializers.SerializerMethodField()

    def fotos_ordenadas(self, ave):
        return list(ave.fotos.all())

    def get_imagenUrl(self, ave):
        fotos = self.fotos_ordenadas(ave)
        return url_archivo(fotos[0].imagen) if fotos else ""

    def get_imagenes(self, ave):
        return [url_archivo(foto.imagen) for foto in self.fotos_ordenadas(ave)]

    def get_atributos(self, ave):
        atributos = getattr(ave, "atributos_ordenados", None)
        if atributos is None:
            atributos = ave.atributos.select_related("atributo").all()
        return [
            {
                "id": atributo_ave.id_atributo_ave,
                "nombre": atributo_ave.atributo.nombre,
                "valor": atributo_ave.valor,
                "destacado": atributo_ave.es_destacado,
            }
            for atributo_ave in atributos
        ]

    class Meta:
        model = Ave
        fields = (
            "id",
            "nombre",
            "nombreCientifico",
            "etiqueta",
            "caracteristicas",
            "descripcion",
            "imagenUrl",
            "imagenes",
            "atributos",
            "activa",
        )
        read_only_fields = fields


class GuardarAveSerializer(serializers.ModelSerializer):
    imagenes = serializers.ListField(
        child=ImagenAdministrativaField(allow_empty_file=False),
        required=False,
        allow_empty=False,
        max_length=MAXIMO_FOTOS_AVE,
        write_only=True,
    )
    reemplazar_imagenes = serializers.BooleanField(
        required=False,
        default=False,
        write_only=True,
    )
    atributos = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
    )

    class Meta:
        model = Ave
        fields = (
            "nombre",
            "nombre_cientifico",
            "etiqueta_caracteristica",
            "caracteristicas",
            "descripcion",
            "activa",
            "imagenes",
            "reemplazar_imagenes",
            "atributos",
        )
        extra_kwargs = {
            "nombre_cientifico": {"required": False, "allow_blank": True},
            "descripcion": {"required": False, "allow_blank": True},
            "activa": {"required": False},
        }

    @staticmethod
    def normalizar_atributos(valor):
        import json

        if valor in (None, ""):
            return []
        if isinstance(valor, str):
            try:
                valor = json.loads(valor)
            except json.JSONDecodeError as error:
                raise serializers.ValidationError(
                    "Los atributos deben enviarse como JSON valido."
                ) from error
        if not isinstance(valor, list):
            raise serializers.ValidationError(
                "Los atributos deben enviarse como una lista."
            )
        if len(valor) > MAXIMO_ATRIBUTOS_AVE:
            raise serializers.ValidationError(
                f"Cada ave puede tener hasta {MAXIMO_ATRIBUTOS_AVE} atributos."
            )

        atributos = []
        nombres_vistos = set()
        for item in valor:
            if not isinstance(item, dict):
                raise serializers.ValidationError(
                    "Cada atributo debe tener nombre y valor."
                )
            nombre = str(item.get("nombre", "")).strip()
            valor_atributo = str(item.get("valor", "")).strip()
            destacado = bool(item.get("destacado", False))
            if not nombre and not valor_atributo:
                continue
            if not nombre or not valor_atributo:
                raise serializers.ValidationError(
                    "Cada atributo necesita nombre y valor."
                )
            llave = nombre.casefold()
            if llave in nombres_vistos:
                raise serializers.ValidationError(
                    "No repitas el mismo atributo en una ave."
                )
            nombres_vistos.add(llave)
            atributos.append(
                {
                    "nombre": nombre[:100],
                    "valor": valor_atributo[:250],
                    "destacado": destacado,
                }
            )
        return atributos

    def validate(self, attrs):
        imagenes = attrs.get("imagenes", [])
        reemplazar = attrs.get("reemplazar_imagenes", False)
        if "atributos" in attrs:
            attrs["atributos"] = self.normalizar_atributos(attrs["atributos"])

        if self.instance is None and not imagenes:
            raise serializers.ValidationError(
                {"imagenes": "Selecciona al menos una imagen del ave."}
            )
        if reemplazar and not imagenes:
            raise serializers.ValidationError(
                {"imagenes": "Selecciona las imagenes que reemplazaran la galeria."}
            )
        if self.instance is not None and not reemplazar:
            total = self.instance.fotos.count() + len(imagenes)
            if total > MAXIMO_FOTOS_AVE:
                raise serializers.ValidationError(
                    {"imagenes": f"Cada ave puede tener hasta {MAXIMO_FOTOS_AVE} fotos."}
                )
        return attrs

    @staticmethod
    def crear_fotos(ave, imagenes):
        tiene_principal = ave.fotos.filter(es_principal=True).exists()
        for indice, imagen in enumerate(imagenes):
            FotoAve.objects.create(
                ave=ave,
                imagen=imagen,
                es_principal=not tiene_principal and indice == 0,
            )

    @staticmethod
    def sincronizar_atributos(ave, atributos):
        ave.atributos.all().delete()
        for item in atributos:
            atributo = Atributo.objects.filter(
                nombre__iexact=item["nombre"],
            ).first()
            if atributo is None:
                atributo = Atributo.objects.create(nombre=item["nombre"])
            AtributoAve.objects.create(
                ave=ave,
                atributo=atributo,
                valor=item["valor"],
                es_destacado=item["destacado"],
            )

    @transaction.atomic
    def create(self, validated_data):
        imagenes = validated_data.pop("imagenes")
        validated_data.pop("reemplazar_imagenes", None)
        atributos = validated_data.pop("atributos", [])
        ave = Ave.objects.create(**validated_data)
        self.crear_fotos(ave, imagenes)
        self.sincronizar_atributos(ave, atributos)
        return ave

    @transaction.atomic
    def update(self, instance, validated_data):
        imagenes = validated_data.pop("imagenes", [])
        reemplazar = validated_data.pop("reemplazar_imagenes", False)
        atributos = validated_data.pop("atributos", None)
        ave = super().update(instance, validated_data)

        if reemplazar:
            fotos_anteriores = list(ave.fotos.all())
            ave.fotos.all().delete()
            for foto in fotos_anteriores:
                programar_eliminacion_archivo(foto.imagen)

        if imagenes:
            self.crear_fotos(ave, imagenes)
        if atributos is not None:
            self.sincronizar_atributos(ave, atributos)
        return ave


class PublicacionAdministrativaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_publicacion", read_only=True)
    autor = serializers.CharField(source="usuario.nombre", read_only=True)
    correoAutor = serializers.CharField(source="usuario.correo", read_only=True)
    imagenUrl = serializers.SerializerMethodField()
    imagenes = serializers.SerializerMethodField()

    def get_imagenes(self, publicacion):
        return [url_archivo(imagen.imagen) for imagen in publicacion.imagenes.all()]

    def get_imagenUrl(self, publicacion):
        imagenes = publicacion.imagenes.all()
        return url_archivo(imagenes[0].imagen) if imagenes else ""

    class Meta:
        model = Publicacion
        fields = (
            "id",
            "autor",
            "correoAutor",
            "titulo",
            "descripcion",
            "fecha",
            "imagenUrl",
            "imagenes",
            "activa",
        )
        read_only_fields = fields


class ActualizarPublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = ("activa",)
