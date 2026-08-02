Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = "C:\Users\rupam\Desktop\RevauleIQ"
$temp = "C:\Users\rupam\Desktop\RevauleIQ_Temp"
if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item -ItemType Directory -Path $temp | Out-Null

$excludeDirs = @("node_modules", ".git", ".next", "dist", "build", ".idea", ".vscode", "venv", ".venv")
$excludeFiles = @("RevauleIQ_Project.zip", "create_zip.ps1", "combine.ps1", "all_code.txt")

Write-Host "Copying files to temporary folder..."
robocopy $source $temp /MIR /XD $excludeDirs /XF $excludeFiles | Out-Null

$zipPath = "C:\Users\rupam\Desktop\RevauleIQ\RevauleIQ_Project.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Write-Host "Waiting for file locks to release..."
Start-Sleep -Seconds 3

Write-Host "Creating zip file..."
[System.IO.Compression.ZipFile]::CreateFromDirectory($temp, $zipPath)

Write-Host "Cleaning up temporary folder..."
Remove-Item $temp -Recurse -Force

Write-Host "Done! Your zip file is ready at $zipPath"
