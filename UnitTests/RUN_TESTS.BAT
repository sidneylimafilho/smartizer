jscoverage ..\src .\.tmp
xcopy .tmp\j*.* .\ /q /c /y /u 
rd /s /q .tmp
REM "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" "http://localhost/trunk/js/smartclient/UnitTests/?test.html"