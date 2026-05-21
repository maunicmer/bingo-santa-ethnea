@echo off
chcp 65001 >nul
echo 🎱 Iniciando Bingo Santa Ethnea...
echo.
echo Esperá un momento, se está abriendo el navegador...
echo.

:: Crear un servidor HTTP simple con PowerShell
powershell -Command "
$listener = New-Object System.Net.HttpListener;
$listener.Prefixes.Add('http://localhost:8080/');
$listener.Start();
$root = '%~dp0dist';
Start-Process 'http://localhost:8080';
Write-Host '✅ Bingo Santa Ethnea corriendo en http://localhost:8080';
Write-Host '⛔ No cierres esta ventana mientras jueguen.';
while ($listener.IsListening) {
    $context = $listener.GetContext();
    $request = $context.Request;
    $response = $context.Response;
    $path = Join-Path $root ($request.RawUrl -replace '^/', '');
    if ($path -eq $root) { $path = Join-Path $root 'index.html'; }
    if (Test-Path $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path);
        $mime = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.json' { 'application/json' }
            '.svg'  { 'image/svg+xml' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            default { 'application/octet-stream' }
        }
        $response.ContentType = $mime;
        $buffer = [System.IO.File]::ReadAllBytes($path);
        $response.ContentLength64 = $buffer.Length;
        $response.OutputStream.Write($buffer, 0, $buffer.Length);
    } else {
        $response.StatusCode = 404;
        $msg = [System.Text.Encoding]::UTF8.GetBytes('No encontrado');
        $response.OutputStream.Write($msg, 0, $msg.Length);
    }
    $response.Close();
}
"
