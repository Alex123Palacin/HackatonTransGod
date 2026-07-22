from django.db import transaction


def programar_eliminacion_archivo(campo_archivo):
    if not campo_archivo or not getattr(campo_archivo, "name", ""):
        return

    almacenamiento = campo_archivo.storage
    nombre = campo_archivo.name

    def eliminar():
        try:
            if almacenamiento.exists(nombre):
                almacenamiento.delete(nombre)
        except OSError:
            # Una limpieza fallida no debe deshacer una operacion ya confirmada.
            pass

    transaction.on_commit(eliminar)

