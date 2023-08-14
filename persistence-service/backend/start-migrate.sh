#!/bin/sh

echo "Starting server in 12 seconds...\n"
sleep 12

# Start the server in the background
echo "Starting Server in the background...\n"
node dist/server.js &

# Wait for the server to be ready
echo "Migration in 10 seconds\n"
sleep 10

# Run migrations
echo "Running migrations...\n"
npm run migrate
echo "Migration completed.\n"

# Keep the script running
while true; do
    # Checking if the server process is still running
    if ! ps aux | grep "[n]ode dist/server.js" > /dev/null; then
        echo "Server process has stopped. Exiting."
        exit 1
    fi
    sleep 10
done
