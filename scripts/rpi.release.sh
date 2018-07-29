rm -rf build && npm run build && packr clean && GOOS=linux GOARCH=arm GOARM=5 packr build
