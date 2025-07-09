# PowerShell script to replace all background implementations with CSS class
$files = @(
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
        $content = Get-Content $file -Raw
        
        # Replace complex background styling with simple CSS class
        $content = $content -replace 'className="([^"]*min-h-screen[^"]*relative[^"]*)"[^>]*style=\{[^}]*backgroundImage[^}]*\}[^>]*>', 'className="bracu-bg $1"'
        $content = $content -replace 'style=\{[^}]*backgroundImage[^}]*\}[^>]*>\s*\{/\* Dark overlay[^}]*\*/\}\s*<div className="absolute inset-0 bg-black bg-opacity-[^"]*"></div>', ''
        
        # Also handle simpler cases
        $content = $content -replace 'className="min-h-screen([^"]*)"[^>]*style=\{[^}]*\}[^>]*>\s*\{/\*[^}]*\*/\}\s*<div[^>]*absolute[^>]*></div>', 'className="bracu-bg min-h-screen$1"'
        
        Set-Content $file $content
    }
}

Write-Host "CSS class update complete!"
