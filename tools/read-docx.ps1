<#
.SYNOPSIS
    RRC Law Associates â€” Offline DOCX Text Extractor

.DESCRIPTION
    Extracts raw text content from Microsoft Word (.docx) documents without requiring
    Microsoft Word or third-party dependencies installed. Useful for extracting legal
    testimonials, partner credentials, or case citations from client briefs.

.PARAMETER Path
    Path to the source .docx file.

.PARAMETER OutPath
    Path where the extracted plain text file should be saved.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File tools/read-docx.ps1 -Path "assets/docs/brief.docx" -OutPath "assets/docs/brief.txt"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Path,

    [Parameter(Mandatory=$true)]
    [string]$OutPath
)

if (-not (Test-Path $Path)) {
    Write-Error "Source file does not exist: $Path"
    exit 1
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    $entry = $zip.GetEntry('word/document.xml')
    if ($null -eq $entry) {
        Write-Error "Could not find word/document.xml inside $Path. Is this a valid .docx document?"
        $zip.Dispose()
        exit 1
    }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()

    # Strip XML tags and normalize whitespace
    $text = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
    $clean = [System.Text.RegularExpressions.Regex]::Replace($text, '\s+', ' ').Trim()

    [System.IO.File]::WriteAllText($OutPath, $clean, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully extracted document text to: $OutPath"
} catch {
    Write-Error "Failed to extract docx: $_"
    exit 1
}
