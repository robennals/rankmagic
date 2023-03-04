rm -rf ../public_out
mkdir ../public_out
cp -r web-build/* ../public_out
# cp -r web/* ../public_out
cp -r ../public/* ../public_out
# cp -r ../public/.well-known/ ../public_out/.well-known/
# cp web-build/index.html ../public_out/jsindex.html
cp web-build/index.html ../public_out/index.html

# rm ../public_out/expo-service-worker.js.gz
# cp ../public/index.html ../public_out/index.html
# cp web-build/index.html ../functions/jsindex.html
echo "DONE"

