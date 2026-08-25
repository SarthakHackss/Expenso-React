param(
  [string]$ResPath = 'android\app\src\main\res'
)

Add-Type -AssemblyName System.Drawing
$res = $ResPath

function New-CoinIcon([int]$size, [float]$coinRatio, [bool]$round, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  if ($round) {
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddEllipse(0, 0, $size, $size)
    $g.SetClip($clip)
  } else {
    $g.Clear([System.Drawing.Color]::Transparent)
  }

  $cx = $size / 2; $cy = $size / 2
  $R = $size * $coinRatio / 2
  $off = [Math]::Max(1, [int]($size * 0.005))

  # Brass radial gradient body
  $coinPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $coinPath.AddEllipse([float]($cx - $R), [float]($cy - $R), [float](2 * $R), [float](2 * $R))
  $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($coinPath)
  $pgb.CenterColor = [System.Drawing.Color]::FromArgb(255, 243, 216, 140)
  $pgb.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(255, 158, 116, 40))
  $g.FillPath($pgb, $coinPath)

  # Rim + border rings
  $rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 116, 84, 26), [Math]::Max(1.5, $R * 0.035))
  $g.DrawEllipse($rimPen, [float]($cx - $R), [float]($cy - $R), [float](2 * $R), [float](2 * $R))
  $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 122, 88, 30), [Math]::Max(1, $R * 0.014))
  $g.DrawEllipse($ringPen, [float]($cx - $R * 0.965), [float]($cy - $R * 0.965), [float](2 * $R * 0.965), [float](2 * $R * 0.965))
  $g.DrawEllipse($ringPen, [float]($cx - $R * 0.775), [float]($cy - $R * 0.775), [float](2 * $R * 0.775), [float](2 * $R * 0.775))

  # Ornamental dots + diamonds ring
  $dotR = [Math]::Max(1.2, $R * 0.035)
  for ($a = 0; $a -lt 360; $a += 15) {
    $rad = $a * [Math]::PI / 180
    $ox = $cx + [Math]::Cos($rad) * $R * 0.87
    $oy = $cy + [Math]::Sin($rad) * $R * 0.87
    if (($a / 15) % 2 -eq 0) {
      $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 122, 88, 30))
      $g.FillEllipse($dotBrush, [float]($ox - $dotR), [float]($oy - $dotR), [float](2 * $dotR), [float](2 * $dotR))
      $dotBrush.Dispose()
    } else {
      $d = $dotR * 0.9
      $dia = New-Object System.Drawing.Drawing2D.GraphicsPath
      $dia.AddPolygon([System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new([float]($ox), [float]($oy - $d)),
        [System.Drawing.PointF]::new([float]($ox + $d), [float]($oy)),
        [System.Drawing.PointF]::new([float]($ox), [float]($oy + $d)),
        [System.Drawing.PointF]::new([float]($ox - $d), [float]($oy))
      ))
      $diaBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 130, 94, 34))
      $g.FillPath($diaBrush, $dia)
      $diaBrush.Dispose()
    }
  }

  # Emboss brushes
  $faceBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 118, 86, 28))
  $hlBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 250, 228, 170))
  $shBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 74, 52, 14))
  $sf = [System.Drawing.StringFormat]::GenericTypographic

  # Big embossed "50"
  $fontBig = $null; $mBig = $null
  $fs = $R * 0.95
  while ($fs -gt 4) {
    if ($fontBig) { $fontBig.Dispose() }
    $fontBig = New-Object System.Drawing.Font('Segoe UI', $fs, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $mBig = $g.MeasureString('50', $fontBig, [System.Drawing.PointF]::Empty, $sf)
    if ($mBig.Width -le $R * 0.70) { break }
    $fs -= 2
  }
  $bx = $cx - $R * 0.12 - $mBig.Width / 2; $by = $cy - $mBig.Height / 2 - $R * 0.06
  $g.DrawString('50', $fontBig, $shBrush, [System.Drawing.PointF]::new([float]($bx + $off), [float]($by + $off)), $sf)
  $g.DrawString('50', $fontBig, $hlBrush, [System.Drawing.PointF]::new([float]($bx - $off), [float]($by - $off)), $sf)
  $g.DrawString('50', $fontBig, $faceBrush, [System.Drawing.PointF]::new([float]$bx, [float]$by), $sf)

  # Curved "PAISE" on the right, outside the numeral
  $fontCurved = New-Object System.Drawing.Font('Segoe UI', ([Math]::Max(5, $R * 0.20)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $word = 'PAISE'
  for ($i = 0; $i -lt $word.Length; $i++) {
    $deg = 52 + (96 * $i / ($word.Length - 1))
    $rad = $deg * [Math]::PI / 180
    $x = $cx + [Math]::Sin($rad) * $R * 0.66
    $y = $cy - [Math]::Cos($rad) * $R * 0.66
    $st = $g.Save()
    $g.TranslateTransform([float]$x, [float]$y)
    $g.RotateTransform([float]$deg)
    $m = $g.MeasureString($word[$i], $fontCurved, [System.Drawing.PointF]::Empty, $sf)
    $bx = -$m.Width / 2; $by = -$m.Height / 2
    $g.DrawString($word[$i], $fontCurved, $shBrush, [System.Drawing.PointF]::new([float]($bx + $off), [float]($by + $off)), $sf)
    $g.DrawString($word[$i], $fontCurved, $faceBrush, [System.Drawing.PointF]::new([float]$bx, [float]$by), $sf)
    $g.Restore($st)
  }

  # "athanni" below (shadow + face only, no ghosting)
  $fontSmall = New-Object System.Drawing.Font('Segoe UI', ([Math]::Max(5, $R * 0.175)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $mSmall = $g.MeasureString('athanni', $fontSmall, [System.Drawing.PointF]::Empty, $sf)
  $bx = $cx - $mSmall.Width / 2 - $R * 0.05; $by = $cy + $R * 0.48
  $g.DrawString('athanni', $fontSmall, $shBrush, [System.Drawing.PointF]::new([float]($bx + $off), [float]($by + $off)), $sf)
  $g.DrawString('athanni', $fontSmall, $faceBrush, [System.Drawing.PointF]::new([float]$bx, [float]$by), $sf)

  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$legacy = @{ 'mipmap-mdpi' = 48; 'mipmap-hdpi' = 72; 'mipmap-xhdpi' = 96; 'mipmap-xxhdpi' = 144; 'mipmap-xxxhdpi' = 192 }
foreach ($k in $legacy.Keys) {
  $s = $legacy[$k]
  New-CoinIcon $s 1.00 $false "$res\$k\ic_launcher.png"
  New-CoinIcon $s 1.00 $true  "$res\$k\ic_launcher_round.png"
}
$fg = @{ 'mipmap-mdpi' = 108; 'mipmap-hdpi' = 162; 'mipmap-xhdpi' = 216; 'mipmap-xxhdpi' = 324; 'mipmap-xxxhdpi' = 432 }
foreach ($k in $fg.Keys) { New-CoinIcon $fg[$k] 0.62 $false "$res\$k\ic_launcher_foreground.png" }
echo done




