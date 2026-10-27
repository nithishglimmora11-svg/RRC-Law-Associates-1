Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = Get-ChildItem assets/docs/*.docx
foreach ($f in $files) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
        $entry = $zip.GetEntry('word/document.xml')
        if ($entry) {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $xml = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            $zip.Dispose()
            $text = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
            $clean = [System.Text.RegularExpressions.Regex]::Replace($text, '\s+', ' ')
            $preview = $clean.Substring(0, [Math]::Min(250, $clean.Length))
            Write-Host "FILE: $($f.Name)"
            Write-Host "PREVIEW: $preview"
            Write-Host "---"
        }
    } catch {
        Write-Host "ERR on $($f.Name): $_"
    }
}
