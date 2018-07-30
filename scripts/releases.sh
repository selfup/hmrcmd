if [[ -d build ]]
then
  rm -rf build
fi

if [[ -d releases ]]
then
  rm -rf releases
fi

npm run build && packr clean && packr \
  && GOOS=darwin GOARCH=amd64 go build -o ./releases/darwin-hmrcmd main.go \
  && GOOS=linux GOARCH=amd64 go build -o ./releases/linux-hmrcmd main.go \
  && GOOS=linux GOARCH=arm GOARM=5 go build -o ./releases/rpi-hmrcmd main.go \
  && GOOS=windows GOARCH=386 go build -o ./releases/hmrcmd.exe main.go \
  && packr clean
