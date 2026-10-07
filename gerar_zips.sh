#!/bin/sh
# Rode dentro da pasta prototipos para criar os .zip de download dos jogos.
(cd fbf-fisioboxfight && zip -qr ../FBF-FisioBoxFight-prototipo.zip .)
(cd canoeingsense && zip -qr ../CanoeingSense-prototipo.zip .)
echo "Pronto!"
