from .models import Ave, AveEncontrada


def calcular_progreso_catalogo(usuario):
    total_aves = Ave.objects.filter(activa=True).count()
    aves_encontradas = (
        AveEncontrada.objects.filter(usuario=usuario, ave__activa=True)
        .values("ave_id")
        .distinct()
        .count()
    )
    porcentaje = round((aves_encontradas / total_aves) * 100, 2) if total_aves else 0

    return {
        "aves_encontradas": aves_encontradas,
        "total_aves": total_aves,
        "porcentaje": porcentaje,
    }
