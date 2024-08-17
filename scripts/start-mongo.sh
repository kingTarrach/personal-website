
#!/bin/bash

# Define the paths
DB_PATH="/var/lib/mongodb"
LOG_PATH="/var/log/mongodb/mongod.log"

# Create the log directory if it doesn't exist
sudo mkdir -p /var/log/mongodb

# Set appropriate permissions (if necessary)
sudo chown -R $(whoami) /var/lib/mongodb
sudo chown -R $(whoami) /var/log/mongodb

# Start MongoDB
sudo mongod --dbpath $DB_PATH --logpath $LOG_PATH --fork

# Check if MongoDB started successfully
if pgrep mongod > /dev/null
then
    echo "MongoDB started successfully"
else
    echo "Failed to start MongoDB"
fi
