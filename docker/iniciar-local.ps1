$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw "Docker Desktop no esta iniciado. Abre Docker Desktop y vuelve a ejecutar este archivo."
}

if (-not (Test-Path -LiteralPath ".env.docker")) {
    Copy-Item -LiteralPath ".env.docker.example" -Destination ".env.docker"
    Write-Host "Se creo .env.docker para la configuracion local." -ForegroundColor Yellow
}

$archivosCompose = @(
    "--env-file", ".env.docker",
    "-f", "docker-compose.yml",
    "-f", "docker-compose.local.yml"
)

docker compose @archivosCompose up --build --detach
if ($LASTEXITCODE -ne 0) {
    throw "No se pudieron iniciar los contenedores."
}

docker compose @archivosCompose ps

Write-Host ""
Write-Host "Aplicacion: http://localhost:8080" -ForegroundColor Green
Write-Host "Administrador: http://localhost:8080/admin/" -ForegroundColor Green
Write-Host "La primera descarga de deepseek-r1:8b puede tardar varios minutos."
