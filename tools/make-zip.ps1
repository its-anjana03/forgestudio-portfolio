# Builds forgestudio-site.zip in the repo root: exactly what goes to GitHub.
# Leaves out editor folders, the old nested copy, original audio, source exports inside foundry/, and other zips.
# Run from anywhere:  powershell -File tools\make-zip.ps1
$root = Split-Path -Parent $PSScriptRoot
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$zip = Join-Path $root "forgestudio-site.zip"
if (Test-Path $zip) { [IO.File]::Delete($zip) }
$skipTop = @('.claude', '.vscode', '.git', 'forgestudio.web.lk', 'audio-originals', '_video')
$files = Get-ChildItem $root -Recurse -File -Force | Where-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  $parts = $rel.Split('\')
  if ($skipTop -contains $parts[0]) { return $false }
  if ($rel.StartsWith('tools\node_modules\')) { return $false }
  if ($rel.EndsWith('.zip') -or $_.Name.StartsWith('__')) { return $false }
  if ($parts[0] -eq 'foundry' -and $parts.Length -gt 2 -and $parts[1] -ne 'img') { return $false }
  return $true
}
$z = [IO.Compression.ZipFile]::Open($zip, 'Create')
foreach ($f in $files) {
  $name = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, $f.FullName, $name, 'Optimal')
}
$z.Dispose()
"{0} files, {1:N1} MB" -f $files.Count, ((Get-Item $zip).Length / 1MB)
