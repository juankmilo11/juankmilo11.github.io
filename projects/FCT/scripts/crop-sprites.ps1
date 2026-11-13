Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Drawing.Common

function Add-BackgroundPixel($Image, $Queue, $Seen, [int]$X, [int]$Y) {
  if ($X -lt 0 -or $X -ge 32 -or $Y -lt 0 -or $Y -ge 40) { return }
  $index = $Y * 32 + $X
  if ($Seen.Contains($index)) { return }
  $pixel = $Image.GetPixel($X, $Y)
  $white = $pixel.R -ge 245 -and $pixel.G -ge 245 -and $pixel.B -ge 245
  $black = $pixel.R -le 8 -and $pixel.G -le 8 -and $pixel.B -le 8
  if (-not $white -and -not $black) { return }
  [void]$Seen.Add($index)
  $Queue.Enqueue($index)
}

function Crop-Sprite($SourcePath, $OutputPath, [int]$Frame, [int]$PaletteOffset) {
  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  $crop = [System.Drawing.Bitmap]::new(32, 40, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($crop)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, 32, 40), [System.Drawing.Rectangle]::new(64 + $PaletteOffset, $Frame * 40, 32, 40), [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $source.Dispose()

  $queue = [System.Collections.Generic.Queue[int]]::new()
  $seen = [System.Collections.Generic.HashSet[int]]::new()
  for ($x = 0; $x -lt 32; $x++) {
    Add-BackgroundPixel $crop $queue $seen $x 0
    Add-BackgroundPixel $crop $queue $seen $x 39
  }
  for ($y = 0; $y -lt 40; $y++) {
    Add-BackgroundPixel $crop $queue $seen 0 $y
    Add-BackgroundPixel $crop $queue $seen 31 $y
  }
  while ($queue.Count -gt 0) {
    $index = $queue.Dequeue()
    $x = $index % 32
    $y = [Math]::Floor($index / 32)
    $crop.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
    Add-BackgroundPixel $crop $queue $seen ($x - 1) $y
    Add-BackgroundPixel $crop $queue $seen ($x + 1) $y
    Add-BackgroundPixel $crop $queue $seen $x ($y - 1)
    Add-BackgroundPixel $crop $queue $seen $x ($y + 1)
  }

  $crop.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
}

$spriteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\sprites')).Path
$outputRoot = Join-Path $spriteRoot 'cropped'
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

$sets = @(
  @{ Piece='p'; Side='w'; File='PlayStation - Final Fantasy Tactics - Unit Classes - Squire (Female).png'; PaletteOffset=0 },
  @{ Piece='p'; Side='b'; File='PlayStation - Final Fantasy Tactics - Unit Classes - Squire (Male).png'; PaletteOffset=280 },
  @{ Piece='r'; Side='w'; File='Knight (Female).png'; PaletteOffset=0 },
  @{ Piece='r'; Side='b'; File='Knight (Male).png'; PaletteOffset=280 },
  @{ Piece='n'; Side='w'; File='Dragoon (Female).png'; PaletteOffset=0 },
  @{ Piece='n'; Side='b'; File='Dragoon (Male).png'; PaletteOffset=0 },
  @{ Piece='b'; Side='w'; File='White Mage (Female).png'; PaletteOffset=0 },
  @{ Piece='b'; Side='b'; File='Black Mage (Male).png'; PaletteOffset=0 },
  @{ Piece='q'; Side='w'; File='PlayStation - Final Fantasy Tactics - Playable Characters - Agrias Oaks.png'; PaletteOffset=0 },
  @{ Piece='q'; Side='b'; File='PlayStation - Final Fantasy Tactics - Non-Playable Characters - Teta Hyral.png'; PaletteOffset=0 },
  @{ Piece='k'; Side='w'; File='PlayStation - Final Fantasy Tactics - Playable Characters - Ramza Beoulve.png'; PaletteOffset=0 },
  @{ Piece='k'; Side='b'; File='PlayStation - Final Fantasy Tactics - Non-Playable Characters - Delita Hyral.png'; PaletteOffset=0 }
)

foreach ($set in $sets) {
  $sourcePath = Join-Path $spriteRoot $set.File
  for ($frame = 0; $frame -lt 2; $frame++) {
    $outputPath = Join-Path $outputRoot ("$($set.Piece)-$($set.Side)-$frame.png")
    Crop-Sprite $sourcePath $outputPath $frame $set.PaletteOffset
  }
}

Get-ChildItem $outputRoot -Filter '*-2.png' | Remove-Item
Get-ChildItem $outputRoot -Filter '*-3.png' | Remove-Item
Write-Output "Generated $((Get-ChildItem $outputRoot -Filter '*.png').Count) transparent walk frames with original sprite colors in $outputRoot"
