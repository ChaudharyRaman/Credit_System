#!/bin/bash

echo "Starting Applying migration prisma"
npm run prisma:migrate
echo "Finished Applying migration prisma"

echo "Seeding the Database: prisma"
npm run prisma:seed

echo "Starting the server"
npm run start:dev
