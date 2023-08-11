#!/bin/sh

set -e

curl \
 -H 'content-type: application/json' \
 --retry 20 --retry-delay 5 \
 --retry-connrefused \
 "$1$2"
