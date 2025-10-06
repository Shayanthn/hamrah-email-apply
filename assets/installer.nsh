# همراه ایمیل اپلای

!define MUI_WELCOMEPAGE_TITLE "خوش آمدید به همراه ایمیل اپلای"
!define MUI_WELCOMEPAGE_TEXT "این برنامه برای کمک به مدیریت درخواست‌های تحصیلات تکمیلی شما طراحی شده است.$\r$\n$\r$\nبا استفاده از این نرم‌افزار می‌توانید اطلاعات اساتید، ایمیل‌ها، درخواست‌ها و تقویم یادآوری‌های خود را مدیریت کنید.$\r$\n$\r$\nبرای ادامه روی 'بعدی' کلیک کنید."

!define MUI_FINISHPAGE_TITLE "نصب با موفقیت انجام شد"
!define MUI_FINISHPAGE_TEXT "همراه ایمیل اپلای با موفقیت نصب شد.$\r$\n$\r$\nبرای شروع کار با برنامه روی 'پایان' کلیک کنید."

# Custom pages and configurations for Persian support
!define MUI_WELCOMEPAGE_TITLE_3LINES
!define MUI_FINISHPAGE_TITLE_3LINES

# Add to finish page options
!define MUI_FINISHPAGE_RUN "$INSTDIR\${PRODUCT_NAME}.exe"
!define MUI_FINISHPAGE_RUN_TEXT "اجرای همراه ایمیل اپلای"

# Installation directory
!define MUI_DIRECTORYPAGE_TEXT_TOP "همراه ایمیل اپلای در پوشه زیر نصب خواهد شد. برای تغییر مسیر روی 'Browse' کلیک کنید."
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION "مسیر نصب:"

# Components page
!define MUI_COMPONENTSPAGE_TEXT_TOP "کامپوننت‌هایی که می‌خواهید نصب شوند را انتخاب کنید:"
!define MUI_COMPONENTSPAGE_TEXT_COMPLIST "کامپوننت‌ها:"

# Install files page
!define MUI_INSTFILESPAGE_FINISHHEADER_TEXT "نصب کامل شد"
!define MUI_INSTFILESPAGE_FINISHHEADER_SUBTEXT "نصب با موفقیت انجام شد."
!define MUI_INSTFILESPAGE_ABORTHEADER_TEXT "نصب متوقف شد"
!define MUI_INSTFILESPAGE_ABORTHEADER_SUBTEXT "نصب با موفقیت انجام نشد."

# Uninstaller
UninstPage uninstConfirm
UninstPage instfiles

# Custom functions
Function .onInit
  # Check for previous installation
  ReadRegStr $R0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName"
  StrCmp $R0 "" done
  
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "نظم‌دهنده ایمیل اپلای قبلاً نصب شده است. آیا می‌خواهید ادامه دهید؟" \
  IDOK done
  Abort
  done:
FunctionEnd

# Custom install section
Section "Main Application" SecMain
  SectionIn RO
  
  # Set output path
  SetOutPath "$INSTDIR"
  
  # Install files (will be handled by electron-builder)
  
  # Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  # Create start menu shortcuts
  CreateDirectory "$SMPROGRAMS\نظم‌دهنده ایمیل اپلای"
  CreateShortCut "$SMPROGRAMS\نظم‌دهنده ایمیل اپلای\نظم‌دهنده ایمیل اپلای.lnk" "$INSTDIR\${PRODUCT_NAME}.exe"
  CreateShortCut "$SMPROGRAMS\نظم‌دهنده ایمیل اپلای\حذف برنامه.lnk" "$INSTDIR\Uninstall.exe"
  
  # Registry entries
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "نظم‌دهنده ایمیل اپلای"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "Shayan Taherkhani"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${PRODUCT_NAME}.exe"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoRepair" 1
SectionEnd

# Uninstaller section
Section "Uninstall"
  # Remove files
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
  
  # Remove start menu entries
  RMDir /r "$SMPROGRAMS\نظم‌دهنده ایمیل اپلای"
  
  # Remove desktop shortcut
  Delete "$DESKTOP\نظم‌دهنده ایمیل اپلای.lnk"
  
  # Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd

# Section descriptions
LangString DESC_SecMain ${LANG_ENGLISH} "نظم‌دهنده ایمیل اپلای - برنامه اصلی"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
!insertmacro MUI_FUNCTION_DESCRIPTION_END