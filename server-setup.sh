#!/bin/bash

# Create the required directories if they don't exist
mkdir -p storage/app/private/task_documents

# Set proper permissions
chmod -R 755 storage/app
chmod -R 700 storage/app/private

# Add a .gitignore to not track these private files
echo "*" > storage/app/private/.gitignore
echo "!.gitignore" >> storage/app/private/.gitignore

# Create storage link if not already done
php artisan storage:link

echo "Directory structure and permissions setup complete."
