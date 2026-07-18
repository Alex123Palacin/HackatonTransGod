type UsuarioSesion = {
  id_usuario: number;
  nombre: string;
  correo: string;
};

type TokensSesion = {
  access: string;
  refresh: string;
};

type Sesion = TokensSesion & {
  usuario: UsuarioSesion;
};

type CredencialesLogin = {
  correo: string;
  password: string;
};

type DatosRegistro = CredencialesLogin & {
  nombre: string;
};

type RespuestaRenovacion = {
  access: string;
  refresh?: string;
};

export type {
  CredencialesLogin,
  DatosRegistro,
  RespuestaRenovacion,
  Sesion,
  TokensSesion,
  UsuarioSesion,
};
