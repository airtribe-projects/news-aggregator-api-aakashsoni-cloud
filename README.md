# News Aggregator API
======================

## Description
---------------

This is a News Aggregator API built using Node.js, Express, and MongoDB. The API allows users to sign up, log in, and manage their news preferences.

## Features
------------

* User authentication and authorization using JSON Web Tokens (JWT)
* User preferences management (e.g., movies, comics, games)
* News aggregation from external sources (e.g., GNews API)
* News article management (e.g., mark as read, favorite)

## Requirements
---------------

* Node.js (>= 18.0.0)
* MongoDB
* GNews API key (optional)

## Installation
------------

1. Clone the repository: `git clone https://github.com/your-username/news-aggregator-api-aakashsoni-cloud.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables (see `.env.example`)
4. Start the server: `npm start`

## API Endpoints
----------------

### Users

* `POST /api/v1/users/signup`: Create a new user account
* `POST /api/v1/users/login`: Log in to an existing user account
* `GET /api/v1/users/preferences`: Get a user's preferences
* `PUT /api/v1/users/preferences`: Update a user's preferences

### News

* `GET /api/v1/news`: Get a list of news articles
* `GET /api/v1/news/:id`: Get a specific news article
* `PUT /api/v1/news/:id/read`: Mark a news article as read
* `PUT /api/v1/news/:id/favorite`: Mark a news article as favorite

## Contributing
------------

Contributions are welcome! Please submit a pull request with a clear description of the changes.


## Authors
---------

* [Your Name](https://github.com/aakashsoni-cloud)