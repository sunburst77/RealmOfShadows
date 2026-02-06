# Git 한글 커밋 메시지 인코딩 가이드

## 🔧 설정 완료 사항

다음 설정이 이미 적용되었습니다:

```bash
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.quotepath false
```

---

## 📝 한글 커밋 메시지 작성 방법

### 방법 1: 스크립트 사용 (권장)

```powershell
# 1. 파일 스테이징
git add .

# 2. UTF-8 보장 스크립트로 커밋
.\git-commit-utf8.ps1 "feat: EmpirePage 사용자 데이터 로딩 개선"
```

### 방법 2: 직접 커밋 (PowerShell 인코딩 설정 후)

```powershell
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 커밋
git commit -m "feat: EmpirePage 사용자 데이터 로딩 개선"
```

### 방법 3: 임시 파일 사용 (가장 안전)

```powershell
# 1. 커밋 메시지를 UTF-8 파일로 저장
$message = "feat: EmpirePage 사용자 데이터 로딩 개선"
$message | Out-File -FilePath commit-msg.txt -Encoding UTF8

# 2. 파일로 커밋
git commit -F commit-msg.txt

# 3. 임시 파일 삭제
Remove-Item commit-msg.txt
```

### 방법 4: Git 에디터 사용

```powershell
# Git 에디터로 커밋 (VS Code 사용 시)
git config --global core.editor "code --wait"

# 커밋 (에디터가 열림)
git commit
```

---

## 🔍 커밋 메시지 확인

### 한글이 정상적으로 표시되는지 확인:

```powershell
# 최근 커밋 확인
git log -1 --pretty=format:"%s" --encoding=UTF-8

# 또는
git log -1 --oneline --encoding=UTF-8
```

---

## ⚠️ 주의사항

1. **이미 커밋된 메시지는 수정 불가**
   - 과거 커밋 메시지의 한글 깨짐은 수정할 수 없습니다
   - 새로운 커밋부터는 정상적으로 표시됩니다

2. **PowerShell 세션별 설정**
   - PowerShell을 재시작하면 인코딩 설정이 초기화될 수 있습니다
   - `setup-git-encoding.ps1`을 실행하여 프로필에 영구 설정을 추가하세요

3. **원격 저장소 표시**
   - GitHub/GitLab 등에서는 UTF-8 커밋 메시지가 정상적으로 표시됩니다
   - 로컬에서만 깨져 보일 수 있습니다

---

## 🛠️ 문제 해결

### 한글이 여전히 깨지는 경우:

1. **PowerShell 인코딩 재설정**
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   $OutputEncoding = [System.Text.Encoding]::UTF8
   ```

2. **Git 설정 확인**
   ```powershell
   git config --global --list | Select-String -Pattern "i18n"
   ```

3. **스크립트 사용**
   - `git-commit-utf8.ps1` 스크립트를 사용하여 커밋하세요

---

## 📚 참고

- Git 인코딩 설정: `git config --help`
- PowerShell 인코딩: `[Console]::OutputEncoding`
- UTF-8 인코딩: https://en.wikipedia.org/wiki/UTF-8
