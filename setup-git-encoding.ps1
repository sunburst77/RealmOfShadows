# ============================================
# Git 한글 인코딩 설정 스크립트
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Git 한글 인코딩 설정" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Git 전역 설정
Write-Host "1. Git 인코딩 설정 중..." -ForegroundColor White
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
Write-Host "   ✅ Git commit encoding: UTF-8" -ForegroundColor Green
Write-Host "   ✅ Git log encoding: UTF-8" -ForegroundColor Green

# 2. PowerShell 인코딩 설정 (현재 세션)
Write-Host "`n2. PowerShell 인코딩 설정 중..." -ForegroundColor White
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
Write-Host "   ✅ PowerShell output encoding: UTF-8" -ForegroundColor Green

# 3. PowerShell 프로필에 영구 설정 추가
Write-Host "`n3. PowerShell 프로필에 영구 설정 추가 중..." -ForegroundColor White
$profilePath = $PROFILE
$encodingSettings = @"

# Git 한글 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8
`$PSDefaultParameterValues['*:Encoding'] = 'utf8'

"@

if (Test-Path $profilePath) {
    $existingContent = Get-Content $profilePath -Raw
    if ($existingContent -notmatch "Git 한글 인코딩 설정") {
        Add-Content -Path $profilePath -Value $encodingSettings
        Write-Host "   ✅ PowerShell 프로필 업데이트 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ 이미 설정되어 있습니다" -ForegroundColor Yellow
    }
} else {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
    Set-Content -Path $profilePath -Value $encodingSettings
    Write-Host "   ✅ PowerShell 프로필 생성 완료" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "설정 완료!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "앞으로 커밋할 때 한글이 정상적으로 표시됩니다." -ForegroundColor White
Write-Host "`n참고: 이미 커밋된 메시지는 수정할 수 없지만," -ForegroundColor Gray
Write-Host "      새로운 커밋부터는 한글이 정상 표시됩니다.`n" -ForegroundColor Gray
