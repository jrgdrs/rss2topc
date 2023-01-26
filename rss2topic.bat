@echo OFF

set channel=%1
set instance=%2

rem count parameter
set argC=0
for %%x in (%*) do Set /A argC+=1
if %argC% neq 2 (
    echo ERROR: script needs 2 parameters 
    goto :EOF
)

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

rem execute scripts
call readRSS %channel%
call createTopics %channel% %instance%

@echo ON