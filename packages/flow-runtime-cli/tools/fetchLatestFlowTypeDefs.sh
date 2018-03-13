#!/usr/bin/env sh

git init flow-builtins-tmp
cd flow-builtins-tmp
git remote add origin https://github.com/facebook/flow.git
git config core.sparsecheckout true
echo "lib/*" >> .git/info/sparse-checkout
git pull --depth=1 origin master
mv ./lib/* ../../flow-builtins
cd ..
rm -rf ./flow-builtins-tmp
