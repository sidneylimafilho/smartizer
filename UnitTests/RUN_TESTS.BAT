"D:\ProReserve\Sistemas\nodejs\node.exe" "PrepareFile.js"
jscoverage ..\src .\.tmp
xcopy .tmp\j*.* .\ /q /c /y 
rd /s /q .tmp
