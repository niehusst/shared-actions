#!/usr/bin/env bash

set -x 

function get_latest_tags() {
  get --no-pager tag \
    --sort=-creatordate \
    --list \
    --merged ${REF:-HEAD} \
    "${MATCHING:-*}"
}

output=$(get_latest_tags | head -n1)

if ! [ -z "$output" ]
then
  echo "::set-output name=tag_name::$output"
fi
