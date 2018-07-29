if [[ -d build ]]
then
  rm -rf build
fi

npm run build && packr build && go build main.go
