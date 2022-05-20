# Project details

Using a PostgreSQL database, I have set up a restful API to perform GET, POST, PATCH and DELETE requests. This can be used to create a front-end user platform to view articles by topic, including their comments. I have included a link to view the hosted version on Heroku.

# Hosted version

https://samr232-backend-project.herokuapp.com/api

# If you would like to try this API locally

- Fork this repo to your GitHub
- Clone it using the link on to your local machine (git clone _link_)
- Create two .env files for your project: .env.test and .env.development. Once these files have been created; add PGDATABASE=nc_news_test and PGDATABASE=nc_news respectively.

# Scripts to run

- npm install

- npm run setup-dbs

- npm run seed

# Testing

- npm test
  (test data can be viewed in the tables.txt file)

# Versions

For the API to work you will need to install Node (version 14+), npm (version 8+) and PostgresQL (version 13+). Earlier versions have not been tested but may still work.
