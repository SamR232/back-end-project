# Create Files

To run this project:
You will need to create two .env files for your project: .env.test and .env.development. Once these files have been created; add PGDATABASE=nc_news_test and PGDATABASE=nc_news respectively.

# Installation

# Mac

Install Postgres App https://postgresapp.com/
Open the app (little blue elephant) and select initialize/start
type psql into your terminal. You should then see something similar to:
psql (9.6.5, server 9.6.6)

username=#
if the above does not show/you get an error, run the following commands in your terminal:
brew update
brew doctor
brew install postgresql

# Linux/Ubuntu terminal:

Run these commands: 

sudo apt-get update

sudo apt-get install postgresql postgresql-contrib

Next run the following commands to create a database user for Postgres.

sudo -u postgres createuser --superuser $USER

sudo -u postgres createdb $USER

If you see the following error: role "username-here" already exists, it means that you already have a Postgres user so can move on to the next step.

If you see the following error: Cannot connect to database/server or similar, run 'sudo service postgresql start' to ensure that the postgresql server is running before trying the above again.

Then run this command to enter the terminal application for PostgreSQL:

psql

# Scripts to run

npm install

npm install express

npm run setup-dbs

npm run seed

# Testing

npm test