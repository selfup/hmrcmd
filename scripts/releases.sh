if [[ -d build ]]
then
  rm -rf build
fi

if [[ -d releases ]]
then
  rm -rf releases
fi

npm run build \
  && mkdir releases \
  && GOOS=darwin GOARCH=amd64 packr build && mv ./hmrcmd ./releases/darwin-hmrcmd \
  && GOOS=linux GOARCH=amd64 packr build && mv ./hmrcmd ./releases/linux-hmrcmd \
  && GOOS=linux GOARCH=arm GOARM=5 packr build && mv ./hmrcmd ./releases/rpi-hmrcmd \
  && GOOS=windows GOARCH=386 packr build && mv ./hmrcmd.exe ./releases/hmrcmd.exe \
  && packr clean
