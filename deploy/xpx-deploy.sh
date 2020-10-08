#!/usr/bin/env sh

# abort on errors
set -e

# actualizar
npm i --force ; npm audit fix ; npm update
git clone git@github.com:devyin7/tsjs-sirius-suite-wallet-library.git
cp -rv tsjs-sirius-suite-wallet-library/ node_modules/
# build
npm run build
