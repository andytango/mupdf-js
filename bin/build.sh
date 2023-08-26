#!/usr/bin/env bash

cp /opt/mupdf-js/overrides/* /src/platform/wasm/

echo 'Running apt-get update'
apt-get update

echo 'Installing pkg-config'
apt-get install -y pkg-config

echo 'Linking emsdk directory...'
ln -s /emsdk /opt/emsdk

echo 'Building MuPDF for wasm'
cd /src/platform/wasm && make

echo 'Copying output to dist folder'
cp /src/platform/wasm/libmupdf.js /opt/mupdf-js/dist
cp /src/platform/wasm/libmupdf.wasm /opt/mupdf-js/dist

echo 'Updating fs permissions'
chown "$HOST_USER" /opt/mupdf-js/dist/libmupdf.*
