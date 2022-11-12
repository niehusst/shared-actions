#!/usr/bin/env bash

set -x 

git fetch origin

function get_latest_tags() {
  git --no-pager tag \
    --sort=-creatordate \
    --list \
    --merged ${REF:-HEAD} \
    "${MATCHING:-*}"
}

output=$(get_latest_tags | head -n1)

if ! [ -z "$output" ]
then
  echo "tag_name=$output" >> $GITHUB_OUTPUT
fi
