@echo OFF
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% = createTopics start

set channel=%1
set instance=%2

rem check parameter
if not exist %CD%\config\rss\%channel% (
    echo ERROR: channel config "%channel%" is missing, use one of these: 
    for /d %%D in (config/rss/*) do echo - %%~nxD
    goto :EOF
)
if not exist %CD%\config\methode\%instance% (
    echo ERROR: instance config "%instance%" is missing, use one of these: 
    for /d %%D in (config/methode/*) do echo - %%~nxD
    goto :EOF
)

rem get new session token
node js\authLogin.js %instance%
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% - new session token created on instance %instance%

rem create topicsfor each json
for /f %%f in ('dir /b tmp\%channel%\json\*.json') do ( 
    echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% - create topic set on %instance% from %channel% with file %%f 
    node js\createTopics.js %channel% %instance% %%f 
)

echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% = createTopics ready

@echo ON
