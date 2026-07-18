from django.db import migrations


def eliminar_cuentas_app_de_administradores(apps, schema_editor):
    Administrador = apps.get_model("usuario", "Usuario")
    ids = list(
        Administrador.objects.filter(
            is_staff=False,
            is_superuser=False,
        ).values_list("id_usuario", flat=True)
    )
    if not ids:
        return

    tablas = set(schema_editor.connection.introspection.table_names())
    marcadores = ", ".join(["%s"] * len(ids))

    if "token_blacklist_outstandingtoken" in tablas:
        if "token_blacklist_blacklistedtoken" in tablas:
            schema_editor.execute(
                f"""
                DELETE FROM token_blacklist_blacklistedtoken
                WHERE token_id IN (
                    SELECT id FROM token_blacklist_outstandingtoken
                    WHERE user_id IN ({marcadores})
                )
                """,
                ids,
            )
        schema_editor.execute(
            f"""
            DELETE FROM token_blacklist_outstandingtoken
            WHERE user_id IN ({marcadores})
            """,
            ids,
        )

    if "django_admin_log" in tablas:
        schema_editor.execute(
            f"DELETE FROM django_admin_log WHERE user_id IN ({marcadores})",
            ids,
        )

    Administrador.objects.filter(id_usuario__in=ids).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("usuario", "0004_delete_cuentaaplicacion_alter_usuario_options_and_more"),
        ("catalogo", "0004_alter_aveencontrada_usuario"),
        ("guia", "0003_alter_conversacion_usuario"),
        ("scanner", "0003_alter_escaneo_usuario"),
        ("noticias", "0003_alter_publicacion_usuario_alter_reporte_usuario"),
    ]

    operations = [
        migrations.RunPython(
            eliminar_cuentas_app_de_administradores,
            migrations.RunPython.noop,
        ),
    ]
