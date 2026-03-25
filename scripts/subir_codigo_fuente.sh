#!/usr/bin/env bash
rsync -avz --delete \
  --exclude 'node_modules/' \
  --exclude '.env' \
  --exclude '.env.test' \
  --exclude '*.log' \
  --exclude 'coverage/' \
  --exclude 'tests/' \
  --exclude '.git/' \
  --exclude '.vscode/' \
  --exclude 'package-lock.json' \
  /home/mcl/Proyects/DAW-Proyecto/backend/ \
  ekonsumo@ekonsumo.duckdns.org:/var/www/daw-proyecto/backend/

