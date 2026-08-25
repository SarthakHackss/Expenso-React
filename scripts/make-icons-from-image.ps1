param(
  [string]$SourceImage = "C:\Users\sarth\OneDrive\Desktop\logo gold.png",
  [string]$ResPath = 'android\app\src\main\res'
)

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.InteropServices

$src = [System.Drawing.Bitmap]::new($SourceImage)
$w = $src.Width; $h = $src.Height
Write-Host "Source: ${w}x${h}"

# --- Auto-detect icon bounding box (background = corner color) ---
$bgc = $src.GetPixel(3, 3)
$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$sd = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $sd.Stride
$bytes = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($sd.Scan0, $bytes, 0, $bytes.Length)
$src.UnlockBits($sd)

$minX = $w; $minY = $h; $maxX = 0; $maxY = 0
$step = 3
for ($y = 0; $y -lt $h; $y += $step) {
  $row = $y * $stride
  for ($x = 0; $x -lt $w; $x += $step) {
    $i = $row + $x * 4
    $b = $bytes[$i]; $gg = $bytes[$i + 1]; $r = $bytes[$i + 2]
    $dr = $r - $bgc.R; $dg = $gg - $bgc.G; $db = $b - $bgc.B
    if (($dr * $dr + $dg * $dg + $db * $db) -gt 2500) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
$bw = $maxX - $minX; $bh = $maxY - $minY

# Refine: probe center row/column for the artwork's metallic frame (skips soft shadow)
$thr = 14400  # dist^2 ~ 120 from cream background
$midY = [int](($minY + $maxY) / 2); $midX = [int](($minX + $maxX) / 2)
$artL = $w; $artR = 0; $artT = $h; $artB = 0
for ($x = $minX; $x -le $maxX; $x += 1) {
  $i = $midY * $stride + $x * 4
  $dr = $bytes[$i + 2] - $bgc.R; $dg = $bytes[$i + 1] - $bgc.G; $db = $bytes[$i] - $bgc.B
  if (($dr * $dr + $dg * $dg + $db * $db) -gt $thr) { if ($x -lt $artL) { $artL = $x }; if ($x -gt $artR) { $artR = $x } }
}
for ($y = $minY; $y -le $maxY; $y += 1) {
  $i = $y * $stride + $midX * 4
  $dr = $bytes[$i + 2] - $bgc.R; $dg = $bytes[$i + 1] - $bgc.G; $db = $bytes[$i] - $bgc.B
  if (($dr * $dr + $dg * $dg + $db * $db) -gt $thr) { if ($y -lt $artT) { $artT = $y }; if ($y -gt $artB) { $artB = $y } }
}
$minX = $artL; $maxX = $artR; $minY = $artT; $maxY = $artB
Write-Host "Artwork frame: L=$minX R=$maxX T=$minY B=$maxY"
$bw = $maxX - $minX; $bh = $maxY - $minY
Write-Host "Icon bounds: ($minX,$minY) ${bw}x${bh}"

# --- Make square crop, centered on bbox ---
$side = [Math]::Max($bw, $bh)
$cx = ($minX + $maxX) / 2; $cy = ($minY + $maxY) / 2
$cropX = [Math]::Max(0, [int]($cx - $side / 2))
$cropY = [Math]::Max(0, [int]($cy - $side / 2))
$cropSide = [Math]::Min($side, [Math]::Min($w - $cropX, $h - $cropY))

$crop = [System.Drawing.Bitmap]::new($cropSide, $cropSide)
$gc = [System.Drawing.Graphics]::FromImage($crop)
$gc.DrawImage($src, [System.Drawing.Rectangle]::new(0, 0, $cropSide, $cropSide), [System.Drawing.Rectangle]::new($cropX, $cropY, $cropSide, $cropSide), [System.Drawing.GraphicsUnit]::Pixel)
$gc.Dispose()
$src.Dispose()

# Master at 1024
$master = [System.Drawing.Bitmap]::new(1024, 1024)
$gm = [System.Drawing.Graphics]::FromImage($master)
$gm.InterpolationMode = 'HighQualityBicubic'
$gm.DrawImage($crop, 0, 0, 1024, 1024)
$gm.Dispose()
$crop.Dispose()

# Sample frame color for adaptive background (left edge, mid height)
$frameColor = $master.GetPixel([int](1024 * 0.015), 512)
$hex = '#{0:X2}{1:X2}{2:X2}' -f $frameColor.R, $frameColor.G, $frameColor.B
Write-Host "Frame color: $hex"

function RoundRectPath([float]$x, [float]$y, [float]$ww, [float]$hh, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = 2 * $r
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $ww - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $ww - $d, $y + $hh - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $hh - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function Save-Clipped([System.Drawing.Bitmap]$img, [System.Drawing.Drawing2D.GraphicsPath]$clip, [int]$size, [string]$path) {
  $out = [System.Drawing.Bitmap]::new($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.SetClip($clip)
  $g.DrawImage($img, [System.Drawing.Rectangle]::new(0, 0, $size, $size))
  $g.Dispose()
  $out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

# Legacy: rounded-square (r=18%) + round versions, full bleed
$legacy = @{ 'mipmap-mdpi' = 48; 'mipmap-hdpi' = 72; 'mipmap-xhdpi' = 96; 'mipmap-xxhdpi' = 144; 'mipmap-xxxhdpi' = 192 }
foreach ($k in $legacy.Keys) {
  $s = $legacy[$k]
  # Square: full-bleed 8% zoom inside a 26% roundrect clip - no background can show
  $sq = [System.Drawing.Bitmap]::new($s, $s)
  $gs = [System.Drawing.Graphics]::FromImage($sq)
  $gs.InterpolationMode = 'HighQualityBicubic'
  $zq = [int]($s * 1.08); $oq = [int](($s - $zq) / 2)
  $gs.DrawImage($master, [System.Drawing.Rectangle]::new($oq, $oq, $zq, $zq))
  $gs.Dispose()
  Save-Clipped $sq (RoundRectPath 0 0 $s $s ($s * 0.26)) $s "$ResPath\$k\ic_launcher.png"
  $sq.Dispose()
  # Round: zoom artwork 9% so its rounded corners overflow the circle clip
  $zoom = [System.Drawing.Bitmap]::new($s, $s)
  $gz = [System.Drawing.Graphics]::FromImage($zoom)
  $gz.InterpolationMode = 'HighQualityBicubic'
  $z = [int]($s * 1.22); $zo = [int](($s - $z) / 2)
  $gz.DrawImage($master, [System.Drawing.Rectangle]::new($zo, $zo, $z, $z))
  $gz.Dispose()
  $ell = New-Object System.Drawing.Drawing2D.GraphicsPath
  $ell.AddEllipse(0, 0, $s, $s)
  Save-Clipped $zoom $ell $s "$ResPath\$k\ic_launcher_round.png"
  $zoom.Dispose()
}

# Adaptive foreground: artwork at 68% of canvas (safe zone), rounded corners
$fg = @{ 'mipmap-mdpi' = 108; 'mipmap-hdpi' = 162; 'mipmap-xhdpi' = 216; 'mipmap-xxhdpi' = 324; 'mipmap-xxxhdpi' = 432 }
foreach ($k in $fg.Keys) {
  $s = $fg[$k]
  $art = [int]($s * 0.68)
  $off = [int](($s - $art) / 2)
  $out = [System.Drawing.Bitmap]::new($s, $s)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $clip = RoundRectPath $off $off $art $art ($art * 0.24)
  $g.SetClip($clip)
  $g.DrawImage($master, [System.Drawing.Rectangle]::new($off, $off, $art, $art))
  $g.Dispose()
  $out.Save("$ResPath\$k\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

$master.Dispose()
Write-Host "Setting adaptive background color to $hex"
$bgXml = "android\app\src\main\res\values\ic_launcher_background.xml"
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">$hex</color>
</resources>
"@ | Set-Content $bgXml
Write-Host done

