@echo off
REM Rode este arquivo uma vez dentro da pasta prototipos para criar os .zip de download dos jogos.
powershell -NoProfile -Command "Compress-Archive -Path 'fbf-fisioboxfight\*' -DestinationPath 'FBF-FisioBoxFight-prototipo.zip' -Force; Compress-Archive -Path 'canoeingsense\*' -DestinationPath 'CanoeingSense-prototipo.zip' -Force"
echo Pronto! Zips criados.
pause
