# ============================================
# Git 커밋 메시지 UTF-8 인코딩 보장 스크립트
# ============================================
# 사용법: .\git-commit-utf8.ps1 "커밋 메시지"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:LC_ALL = "ko_KR.UTF-8"

# 커밋 메시지를 임시 파일에 UTF-8로 저장
$tempFile = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempFile, $Message, [System.Text.Encoding]::UTF8)

# Git 커밋 실행
git commit -F $tempFile

# 임시 파일 삭제
Remove-Item $tempFile

Write-Host "`n✅ 커밋 완료 (UTF-8 인코딩 보장)" -ForegroundColor Green
