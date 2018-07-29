rm -rf build && npm run build && packr clean && GOOS=linux GOARCH=amd64 packr build
