node "PrepareFile.js"
jscoverage --encoding=UTF-8 ..\src .\.tmp
xcopy .tmp\j*.* .\ /q /c /y 
rd /s /q .tmp
