@echo OFF
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% = readRSS start

set channel=%1

rem check channel
if not exist %CD%\config\rss\%channel% (
    echo ERROR: channel config "%channel%" is missing, use one of these: 
    for /d %%D in (config/rss/*) do echo - %%~nxD
    goto :EOF
)

rem get config
call config\rss\%channel%\config.bat

rem create work directories
mkdir tmp\%channel% 2> NUL
mkdir tmp\%channel%\json 2> NUL
del tmp\%channel%\json\* /q
mkdir tmp\%channel%\xml 2> NUL
del tmp\%channel%\xml\* /q
mkdir tmp\%channel%\img 2> NUL
del tmp\%channel%\img\* /q

rem download feed
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% - download feed %feed% to file tmp\%channel%\feed.rss
curl -s %feed% > tmp\%channel%\feed.rss

rem split feed to json files
node node_modules\xslt3\xslt3.js -xsl:config\rss\%channel%\rss2json.xsl -s:tmp\%channel%\feed.rss SECTION=%methodeSection%

rem count json files
set /A dateien=0
for /F %%i in ('dir /B /A-d tmp\%channel%\json') do set /A dateien=dateien+1
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% - created %dateien% json files in tmp\%channel%\json

rem create image download script
node node_modules\xslt3\xslt3.js -xsl:config\rss\%channel%\rss2img.xsl -s:tmp\%channel%\feed.rss > tmp\%channel%\images.bat

rem execute image download
call tmp\%channel%\images.bat

rem count image files
set /A dateien=0
for /F %%i in ('dir /B /A-d tmp\%channel%\img') do set /A dateien=dateien+1
echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% - downloaded %dateien% image files in tmp\%channel%\img

echo %time:~-11,2%^:%time:~-8,2%^:%time:~-5,2% = readRSS ready

@echo ON