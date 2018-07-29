rm -rf build && npm run build && packr clean && GOOS=windows GOARCH=386 packr build
