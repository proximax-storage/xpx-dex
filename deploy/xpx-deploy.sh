#!/usr/bin/env sh

# abort on errors
set -e

# actualizar
npm i --force ; npm audit fix ; npm update
cp -rv deploy/tsjs-sirius-suite-wallet-library/ node_modules/
# build
npm run build
