# PowerShell script to replace all inline background styles with bracu-bg class

$files = @(
    "src\app\admin\clubs\page.tsx",
    "src\app\auth\signup\page.tsx",
    "src\app\profile\page.tsx",
    "src\app\dashboard\page.tsx",
    "src\app\events\page.tsx",
    "src\app\auth\signin\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Replace the old background div pattern with bracu-bg class
        $content = $content -replace '(?s)<div className="min-h-screen relative">\s*{/\* Background with blur \*/}\s*<div\s*className="absolute inset-0"\s*style=\{\{\s*backgroundImage: `url\(''/images/bracu-campus\.jpg''\)`,\s*backgroundSize: ''cover'',\s*backgroundPosition: ''center'',\s*backgroundAttachment: ''fixed'',\s*filter: ''blur\(2px\)'',\s*transform: ''scale\(1\.1\)''\s*\}\}\s*></div>\s*{/\* Dark overlay for content readability \*/}\s*<div className="absolute inset-0 bg-black bg-opacity-50"></div>', '<div className="bracu-bg min-h-screen relative">'
        
        # Alternative simpler pattern for different structures
        $content = $content -replace '(?s)<div\s*className="absolute inset-0"\s*style=\{\{\s*backgroundImage: `url\(''/images/bracu-campus\.jpg''\)`,[^}]*\}\}\s*></div>\s*{/\* Dark overlay for content readability \*/}\s*<div className="absolute inset-0 bg-black bg-opacity-50"></div>', ''
        
        # Replace any remaining inline background image styles
        $content = $content -replace 'backgroundImage: `url\(''/images/bracu-campus\.jpg''\)`,\s*backgroundSize: ''cover'',\s*backgroundPosition: ''center'',\s*backgroundAttachment: ''fixed'',\s*filter: ''blur\(2px\)'',\s*transform: ''scale\(1\.1\)''', ''
        
        # Clean up empty style objects
        $content = $content -replace 'style=\{\{\s*\}\}', ''
        
        # Write the content back
        Set-Content $file $content -NoNewline
        
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Background update completed!"
