# KRAKEN Cyber Arena - Database Setup Script
Write-Host "🗄️ Setting up KRAKEN database..." -ForegroundColor Green

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL environment variable not set!" -ForegroundColor Red
    Write-Host "Please set your PostgreSQL connection string:" -ForegroundColor Yellow
    Write-Host 'Example: $env:DATABASE_URL="postgresql://user:pass@host:5432/db"' -ForegroundColor White
    exit 1
}

Write-Host "✅ DATABASE_URL found" -ForegroundColor Green

# Navigate to API directory
Set-Location "apps/api"

# Generate Prisma client
Write-Host "📦 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host "🔄 Pushing database schema..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database push failed!" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npx prisma db seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Database contains:" -ForegroundColor Cyan
    Write-Host "- 4 zones (Standard, VIP, Premium, PS5)" -ForegroundColor White
    Write-Host "- 32 PCs/consoles total" -ForegroundColor White
    Write-Host "- Pricing rules for all zones" -ForegroundColor White
    Write-Host "- Holiday calendar exceptions" -ForegroundColor White
} else {
    Write-Host "❌ Database seeding failed!" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location "../.."
