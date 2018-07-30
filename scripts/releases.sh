if [[ -d build ]]
then
  rm -rf build
fi

npm run build \
  && packr clean && GOOS=darwin GOARCH=amd64 packr build -o ./releases/darwin-hmrcmd main.go \
  && packr clean && GOOS=linux GOARCH=amd64 packr build -o ./releases/linux-hmrcmd main.go \
  && packr clean && GOOS=linux GOARCH=arm GOARM=5 packr build -o ./releases/rpi-hmrcmd main.go \
  && packr clean && GOOS=windows GOARCH=amd64 packr build -o ./releases/hmrcmd.exe main.go
