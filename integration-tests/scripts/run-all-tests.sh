#!/bin/sh

set -e

# Introduce a delay of 10 seconds
echo "Waiting for 10 seconds to ensure backend is fully operational..."
sleep 15

URL=$1
PORT=$2

SERVICE_URL="$URL$PORT"
export SERVICE_URL="$URL$PORT"
echo "Service URL: $SERVICE_URL"


filename="junit.xml"
file="/results/$filename"
rm -f $file
touch $file
chmod 666 $file

./scripts/wait-for-it.sh $SERVICE_URL

npm run test 

cat results/integration-test-result.xml > $file

