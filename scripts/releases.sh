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

darwin_sha=$(shasum -a 256 releases/darwin-hmrcmd-$VERSION)
echo $darwin_sha > releases/darwin-hmrcmd-$VERSION.sha256

linux_sha=$(shasum -a 256 releases/linux-hmrcmd-$VERSION)
echo $linux_sha > releases/linux-hmrcmd-$VERSION.sha256

rpi_sha=$(shasum -a 256 releases/rpi-hmrcmd-$VERSION)
echo $rpi_sha > releases/rpi-hmrcmd-$VERSION.sha256

windows_sha=$(shasum -a 256 releases/hmrcmd-$VERSION.exe)
echo $windows_sha > releases/hmrcmd-$VERSION.exe.sha256

if [[ -f known_shas.txt ]]
then
  rm known_shas.txt
fi

echo $darwin_sha >> known_shas.txt
echo $linux_sha >> known_shas.txt
echo $rpi_sha >> known_shas.txt
echo $windows_sha >> known_shas.txt

packr clean

zip -r releases.zip releases/
