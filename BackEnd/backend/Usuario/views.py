from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CuentaAplicacion
from .serializers import (
    LoginSerializer,
    RefreshSerializer,
    RegistroUsuarioSerializer,
    UsuarioSerializer,
)
from .servicios_sesion import crear_sesion, renovar_sesion, revocar_sesion


class RegistroUsuarioView(generics.CreateAPIView):
    queryset = CuentaAplicacion.objects.none()
    serializer_class = RegistroUsuarioSerializer
    permission_classes = (permissions.AllowAny,)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.validated_data["usuario"]
        tokens = crear_sesion(usuario)
        return Response(
            {**tokens, "usuario": UsuarioSerializer(usuario).data},
            status=status.HTTP_200_OK,
        )


class RenovarSesionView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens = renovar_sesion(serializer.validated_data["refresh"])
        return Response(tokens, status=status.HTTP_200_OK)


class PerfilUsuarioView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class ActividadSesionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)


class CerrarSesionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        revocar_sesion(request.auth)
        return Response(status=status.HTTP_204_NO_CONTENT)
