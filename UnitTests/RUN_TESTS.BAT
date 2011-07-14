jscoverage ..\src .\.tmp
xcopy .tmp\*.* .\ /q /c /y 
rd /s /q .tmp
