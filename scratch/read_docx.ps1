param([string]$Path, [string]$OutPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$text = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
$clean = [System.Text.RegularExpressions.Regex]::Replace($text, '\s+', ' ')
[System.IO.File]::WriteAllText($OutPath, $clean, [System.Text.Encoding]::UTF8)
Write-Output "Written to $OutPath"
