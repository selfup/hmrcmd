#!/usr/bin/env bash

set -e

if [[ -d dist ]]
then
  rm -rf dist
fi

if [[ -d releases ]]
then
  rm -rf releases
fi

NODE_ENV=production npm run build

source .version

go get -u github.com/gobuffalo/packr/packr

mkdir releases

GOOS=darwin GOARCH=amd64 packr build 
mv ./hmrcmd ./releases/darwin-hmrcmd-$VERSION

GOOS=linux GOARCH=amd64 packr build 
mv ./hmrcmd ./releases/linux-hmrcmd-$VERSION

GOOS=linux GOARCH=arm GOARM=5 packr build 
mv ./hmrcmd ./releases/rpi-hmrcmd-$VERSION

GOOS=windows GOARCH=386 packr build 
mv ./hmrcmd.exe ./releases/hmrcmd-$VERSION.exe

chmod +x releases/darwin-*
chmod +x releases/rpi-*
chmod +x releases/linux-*

shasum -a 256 releases/darwin-hmrcmd-$VERSION > releases/darwin-hmrcmd-$VERSION.sha256
shasum -a 256 releases/linux-hmrcmd-$VERSION > releases/linux-hmrcmd-$VERSION.sha256
shasum -a 256 releases/rpi-hmrcmd-$VERSION > releases/rpi-hmrcmd-$VERSION.sha256
shasum -a 256 releases/hmrcmd-$VERSION.exe > releases/hmrcmd-$VERSION.exe.sha256

packr clean

zip -r releases.zip releases/
