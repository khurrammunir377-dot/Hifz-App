# PowerShell script to upload the fixed Hifz-App project to GitHub and verify locally
# Modified: Uses already extracted project (no ZIP required)

# --- Configuration ---
$githubRepoUrl = "https://github.com/khurrammunir377-dot/Hifz-App.git"
$localRepoDir = "C:\Hifz-App-GitHub"
$fixedProjectExtractDir = "$PSScriptRoot"

# --- Prerequisites Check ---
Write-Host "Checking prerequisites..."

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed. Please install from: https://git-scm.com/downloads"
    exit 1
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm is not installed. Please install from: https://pnpm.io/installation"
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install LTS from: https://nodejs.org"
    exit 1
}

# --- Use Already Extracted Project ---
Write-Host "Using already extracted project from current directory..."
$extractedProjectSource = $PSScriptRoot

# --- GitHub Operations ---
Write-Host "Preparing GitHub repository..."

if (Test-Path $localRepoDir) {
    Write-Host "Removing existing local repository directory..."
    Remove-Item $localRepoDir -Recurse -Force
}

Write-Host "Cloning $githubRepoUrl ..."
git clone $githubRepoUrl $localRepoDir
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to clone repository."
    exit 1
}

Write-Host "Copying fixed project files to the cloned repository..."
Set-Location $localRepoDir

# Clear existing files (except .git)
Get-ChildItem -Path $localRepoDir -Exclude ".git" -Recurse | Remove-Item -Recurse -Force

# Copy new files
Copy-Item -Path "$extractedProjectSource\*" -Destination $localRepoDir -Recurse -Force -Exclude "*.ps1"

# Git operations
Write-Host "Committing and pushing to GitHub..."
git add .
git commit -m "Fix: Address compatibility and configuration issues (Manus AI)"
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes detected or commit skipped."
}
git push
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push failed. Check your GitHub credentials."
    exit 1
}
Write-Host "✅ Project successfully uploaded to GitHub!"

# --- Local Verification ---
Write-Host "Starting local verification..."
Set-Location $localRepoDir

Write-Host "Installing dependencies..."
pnpm install
if ($LASTEXITCODE -ne 0) { Write-Error "pnpm install failed."; exit 1 }

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host "Created .env from example."
}

Write-Host "Running Expo config check..."
npx expo config --type introspect
if ($LASTEXITCODE -ne 0) { Write-Error "Expo check failed."; exit 1 }

Write-Host "Running TypeScript check..."
./node_modules/.bin/tsc --noEmit
if ($LASTEXITCODE -ne 0) { Write-Error "TypeScript check failed."; exit 1 }

Write-Host "`n================================================================================"
Write-Host "✅ SUCCESS! Project uploaded to GitHub and verified locally."
Write-Host "To run locally:   pnpm dev"
Write-Host "================================================================================"