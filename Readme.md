Pond: Eat your friends!
=====================================

In this Facebook app (game) you are a fish trying to eat as many other smaller fish as possible, while avoiding larger fish.  Other fish are a combination of "bots" and your friends/other users.
This game is written in Node.js, and designed for deployment to [Heroku](http://www.heroku.com/).

Run locally
-----------

Install dependencies:

    npm bundle install

Copy the App ID and Secret from the Facebook app settings page into your `.env`:

    echo FACEBOOK_APP_ID=12345 >> .env
    echo FACEBOOK_SECRET=abcde >> .env

Launch the app with [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html):

    foreman start