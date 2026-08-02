$outputFile = "all_code.txt"
if (Test-Path $outputFile) { Remove-Item $outputFile }

$excludePatterns = @(
    '\\node_modules\\',
    '\\\.git\\',
    '\\\.next\\',
    '\\dist\\',
    '\\build\\',
    'package-lock\.json',
    '\.png$', '\.jpg$', '\.jpeg$', '\.gif$', '\.svg$', '\.ico$', '\.pdf$', '\.zip$'
)

$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $path = $_.FullName
    $exclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($path -match $pattern) {
            $exclude = $true
            break
        }
    }
    if ($_.Name -eq 'all_code.txt' -or $_.Name -eq 'combine.ps1') {
        $exclude = $true
    }
    -not $exclude
}

foreach ($f in $files) {
    "================================================================================`r`n" | Out-File -Append -Encoding UTF8 -FilePath $outputFile
    "File: $($f.FullName.Replace((Get-Location).Path + '\', ''))`r`n" | Out-File -Append -Encoding UTF8 -FilePath $outputFile
    "================================================================================`r`n" | Out-File -Append -Encoding UTF8 -FilePath $outputFile
    
    try {
        $content = Get-Content -Path $f.FullName -Raw -ErrorAction Stop
        if ($content) {
            $content | Out-File -Append -Encoding UTF8 -FilePath $outputFile
        }
    } catch {
        "Error reading file.`r`n" | Out-File -Append -Encoding UTF8 -FilePath $outputFile
    }
    "`r`n`r`n" | Out-File -Append -Encoding UTF8 -FilePath $outputFile
}
Write-Host "Created $outputFile successfully."
