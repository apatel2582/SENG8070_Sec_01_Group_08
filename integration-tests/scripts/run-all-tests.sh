#!/bin/sh

set -e

URL=$1
PORT=$2

SERVICE_URL="$URL$PORT"

filename="junit.xml"
file="/results/$filename"
rm -f $file
touch $file
chmod 666 $file

./scripts/wait-for-it.sh $SERVICE_URL

npm run test 

cat results/integration-test-result.xml > $file

