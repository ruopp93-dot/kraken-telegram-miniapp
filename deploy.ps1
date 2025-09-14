# KRAKEN Cyber Arena - Deployment Script
Write-Host "🚀 Starting KRAKEN Cyber Arena deployment..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Set up PostgreSQL database (Vercel Postgres recommended)" -ForegroundColor White
    Write-Host "2. Configure environment variables in Vercel Dashboard" -ForegroundColor White
    Write-Host "3. Run database migrations: npx prisma db push" -ForegroundColor White
    Write-Host "4. Seed database: npx prisma db seed" -ForegroundColor White
    Write-Host "5. Configure Telegram bot webhook" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
