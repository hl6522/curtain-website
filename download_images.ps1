# Download website images script
# Using PowerShell to download all images to local directories

Write-Host "Starting to download website images..." -ForegroundColor Green

# Create download function
function Download-Image {
    param(
        [string]$Url,
        [string]$LocalPath,
        [string]$FileName
    )
    
    try {
        $fullPath = Join-Path $LocalPath $FileName
        Write-Host "Downloading: $FileName" -ForegroundColor Yellow
        
        # Use Invoke-WebRequest to download image
        Invoke-WebRequest -Uri $Url -OutFile $fullPath -UseBasicParsing
        
        if (Test-Path $fullPath) {
            Write-Host "Successfully downloaded: $FileName" -ForegroundColor Green
        } else {
            Write-Host "Failed to download: $FileName" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Error downloading: $FileName - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Home page images
Write-Host "`nDownloading Home page images..." -ForegroundColor Cyan
$homeImages = @{
    "hero-background.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop"
    "curtain-closeup.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop"
    "modern-home.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop"
}

foreach ($image in $homeImages.GetEnumerator()) {
    Download-Image -Url $image.Value -LocalPath "images\home" -FileName $image.Key
}

# Gallery images
Write-Host "`nDownloading Gallery images..." -ForegroundColor Cyan
$galleryImages = @{
    "elegant-living-room.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    "bedroom-curtains.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    "kitchen-window.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
    "bathroom-curtains.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
    "modern-living-room.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    "master-bedroom.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
}

foreach ($image in $galleryImages.GetEnumerator()) {
    Download-Image -Url $image.Value -LocalPath "images\gallery" -FileName $image.Key
}

# Product series images
Write-Host "`nDownloading Product series images..." -ForegroundColor Cyan
$productImages = @{
    "elegant-drapery.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    "modern-panels.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
    "classic-valances.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    "blackout-curtains.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
    "sheer-elegance.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    "layered-treatments.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    "cafe-curtains.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    "roman-shades.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    "roller-blinds.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
    "moisture-resistant.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    "privacy-sheers.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    "fabric-panels.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
    "professional-blinds.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    "study-curtains.jpg" = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop"
    "conference-room.jpg" = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
}

foreach ($image in $productImages.GetEnumerator()) {
    Download-Image -Url $image.Value -LocalPath "images\products" -FileName $image.Key
}

# About us images
Write-Host "`nDownloading About us images..." -ForegroundColor Cyan
$aboutImages = @{
    "showroom.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop"
}

foreach ($image in $aboutImages.GetEnumerator()) {
    Download-Image -Url $image.Value -LocalPath "images\about" -FileName $image.Key
}

Write-Host "`nAll images downloaded successfully!" -ForegroundColor Green
Write-Host "Please check the files in the images directory." -ForegroundColor Cyan
