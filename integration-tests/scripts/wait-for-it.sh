#!/bin/sh

set -e

# Introduce a delay of  seconds
echo "WAITFORIT - Waiting for 5 seconds to ensure backend is fully operational..."
sleep 5

echo "WAIT FOR IT $1$2"
curl \
 -H 'content-type: application/json' \
 --retry 20 --retry-delay 5 \
 --retry-connrefused \
 "$1$2"

echo "\nWAIT FOR IT $1$2/trucks\n"
curl \
 -H 'content-type: application/json' \
 --retry 20 --retry-delay 5 \
 --retry-connrefused \
 "$1$2/trucks"



