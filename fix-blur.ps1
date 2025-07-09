# Enhanced PowerShell script to add blur effect to all background images
$files = @(
    "src\app\page.tsx",
    "src\app\dashboard\page.tsx", 
    "src\app\profile\page.tsx",
    "src\app\events\page.tsx",
    "src\app\auth\signin\page.tsx",
    "src\app\auth\signup\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file"
        $content = Get-Content $file -Raw
        
        # Replace inline background styles with separate blur container
        $content = $content -replace 'style=\{\{[\s\S]*?backgroundImage: `url\(''/images/[^'']*''\)`,[^}]*\}\}', 'className="min-h-screen flex items-center justify-center relative"'
        
        # Add blur background container after the opening div
        $content = $content -replace '(className="min-h-screen[^"]*relative"[^>]*>)', '$1`r`n        {/* Background with blur */}`r`n        <div `r`n          className="absolute inset-0"`r`n          style={{`r`n            backgroundImage: `url(''/images/bracu-campus.jpg'')`r`n            backgroundSize: ''cover'',`r`n            backgroundPosition: ''center'',`r`n            backgroundAttachment: ''fixed'',`r`n            filter: ''blur(2px)'',`r`n            transform: ''scale(1.1)''`r`n          }}`r`n        ></div>'
        
        Set-Content $file $content
    }
}

Write-Host "All files updated with blur effect!"
