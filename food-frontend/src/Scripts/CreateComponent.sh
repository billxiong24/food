cwd=$(pwd)

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"

cp ../Resources/ComponentFileSkeleton.js $cwd/$1.js

sed -i"any_symbol" 's/SampleComponent/'"${1}"'/g' "$cwd/$1.js"

rm $cwd/$1.jsany_symbol

