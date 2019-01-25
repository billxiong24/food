cp ../Resources/ComponentFileSkeleton.js $1.js

sed -i"any_symbol" 's/SampleComponent/'"${1}"'/g' "$1.js"

rm $1.jsany_symbol