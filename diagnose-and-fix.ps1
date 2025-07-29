# Club Connect Local Development Setup and Diagnosis Script

Write-Host "=== Club Connect Local Development Diagnosis ===" -ForegroundColor Green

# 1. Check Node.js and npm versions
Write-Host "`n1. Checking Node.js and npm versions..." -ForegroundColor Yellow
node --version
npm --version

# 2. Check if dependencies are installed
Write-Host "`n2. Checking if node_modules exists..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "✗ node_modules not found. Running npm install..." -ForegroundColor Red
    npm install
}

# 3. Check environment configuration
Write-Host "`n3. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local exists" -ForegroundColor Green
    Write-Host "Database URL configuration:"
    Get-Content ".env.local" | Select-String "DATABASE_URL"
} else {
    Write-Host "✗ .env.local not found" -ForegroundColor Red
}

# 4. Check Prisma database setup
Write-Host "`n4. Checking Prisma database setup..." -ForegroundColor Yellow
if (Test-Path "prisma\dev.db") {
    Write-Host "✓ SQLite database (dev.db) exists" -ForegroundColor Green
} else {
    Write-Host "✗ SQLite database not found. Creating and seeding..." -ForegroundColor Red
    Write-Host "Generating Prisma client..."
    npx prisma generate
    Write-Host "Pushing database schema..."
    npx prisma db push
    Write-Host "Seeding database..."
    npm run db:seed-simple
}

# 5. Check for common file issues
Write-Host "`n5. Checking for potential file issues..." -ForegroundColor Yellow
if (Test-Path "src\app\layout.tsx") {
    Write-Host "✓ Layout file exists" -ForegroundColor Green
} else {
    Write-Host "✗ Layout file missing" -ForegroundColor Red
}

if (Test-Path "src\app\globals.css") {
    Write-Host "✓ Global CSS file exists" -ForegroundColor Green
} else {
    Write-Host "✗ Global CSS file missing" -ForegroundColor Red
}

# 6. Clear Next.js cache
Write-Host "`n6. Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✓ Cleared .next cache" -ForegroundColor Green
} else {
    Write-Host "✓ No .next cache to clear" -ForegroundColor Green
}

# 7. Try to start the development server
Write-Host "`n7. Starting development server..." -ForegroundColor Yellow
Write-Host "Running: npm run dev" -ForegroundColor Cyan
Write-Host "If successful, the server will start at http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when ready" -ForegroundColor Cyan

npm run dev
