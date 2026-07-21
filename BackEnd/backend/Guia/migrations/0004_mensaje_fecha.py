import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("guia", "0003_alter_conversacion_usuario"),
    ]

    operations = [
        migrations.AddField(
            model_name="mensaje",
            name="fecha",
            field=models.DateTimeField(
                auto_now_add=True,
                db_index=True,
                default=django.utils.timezone.now,
            ),
            preserve_default=False,
        ),
    ]
