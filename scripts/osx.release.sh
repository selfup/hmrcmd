rm -rf build && npm run build && packr clean && GOOS=darwin GOARCH=amd64 packr build
