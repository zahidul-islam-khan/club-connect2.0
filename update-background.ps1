# PowerShell script to replace background image references
$files = @(
    "src\app\page.tsx",
    "src\app\dashboard\page.tsx", 
    "src\app\profile\page.tsx",
    "src\app\events\page.tsx",
    "src\app\auth\signin\page.tsx",
    "src\app\auth\signup\page.tsx",
    "src\app\admin\clubs\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file"
        
        # Replace background image path and add blur
        (Get-Content $file) -replace "backgroundImage: ``url\('/images/background\.jpg'\)``,", "backgroundImage: ``url('/images/bracu-campus.jpg')``,`r`n          filter: 'blur(1px)'," | Set-Content $file
        
        # Update overlay opacity
        (Get-Content $file) -replace "bg-black bg-opacity-40", "bg-black bg-opacity-50" | Set-Content $file
    }
}

Write-Host "Background image update complete!"
