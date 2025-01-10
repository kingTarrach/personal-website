#!/bin/bash

# Load NVM (Adjust the path to where nvm.sh is located on your system)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Print the current Node.js version
node -v

# Use the installed version of Node.js
nvm use node
