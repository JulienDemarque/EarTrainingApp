# EarTrainingApp

## Presentation

This repository is open for contributions.
You can see the demo of the app here: https://chord-progression-ear-training.herokuapp.com/

The app has actually two modes, a chord-progression game and a chord-and-note game.
The chord-and-note game let you see your progress day-by-day if you login.

## How to run it locally

clone the repo.
setup a mongodb database locally.
setup the environment variables.
start the database `mongod --dbpath ~/[path to your database]`
`npm install`
`npm start`
visit http://localhost:8080

### Environment Variables Setup

The app uses environment variable to point to the database.
You can create a mongo db anywhere you want on your computer, just change the path accordingly when you start the database,
and create the environment variable DATABASEURL pointing at where the new db is serving. I use the .bash_profile file in the root folder on a mac to save this env variable.

Exemple:
To start the database on my computer, I run the following command in the user's home directory (juliendemarque):
`mongod --dbpath ~/data`

My env variable DATABASEURL is `mongodb://localhost/test` but you can give it a better name like mongodb://localhost/eartrainingapp`

## How to contribute

fork the repo.
clone it locally and make your changes.
make sure to run `npm run lint` before any PR.

[![Known Vulnerabilities](https://snyk.io/test/github/JulienDemarque/EarTrainingApp/badge.svg?targetFile=package.json)](https://snyk.io/test/github/JulienDemarque/EarTrainingApp?targetFile=package.json)
