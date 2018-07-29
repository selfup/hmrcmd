if [[ -d build ]]
then
  rm -rf build
fi

npm run build && go run main.go
