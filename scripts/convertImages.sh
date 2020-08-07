#!/bin/bash

cd images/posters/webp
shopt -s nullglob

for f in *.webp
do
    basefile="${f%.[^.]*}"
    ffmpeg -n -i $basefile.webp -vf scale=257:-1 ../$basefile.png
done
