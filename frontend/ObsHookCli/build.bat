@echo off

REM Activate virtual environment
call .venv\Scripts\activate

REM Run PyInstaller command
pyinstaller -n ObsHook --noconsole main.py --noconfirm

REM Set current date and time as a variable
set timestamp=%date:/=-%_%time::=-%

REM Generate text file with timestamp
echo Built on %timestamp% > dist\ObsHook\build_timestamp.txt

REM Copy output directory to another drive
xcopy /s /i /y dist\ObsHook\ D:\ObsHook\
