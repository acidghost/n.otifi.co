# n.otifi.co
##### *a subscription sevice for ResidentAdvisor's DJ's events*


### Description
This webapp allows anyone to subscribe to favourite artists (that are on Resident Advisor's [website](http://www.residentadvisor.net/)) and than receive e-mail updates about new events posted on those artists' feed.

This project is being developed with JavaScript end-to-end (both backend and frontend are developed in JS and they comminucate through a RESTful API). The backend side relies on [sails.js](http://sailsjs.org/), a really powerful yet flexible realtime MVC frameworks for node.js. The frontend part is developed with [AngularJS](http://angularjs.org/) for the <abbr title="Single Page Application">SPA</abbr> and we just <3 the combination [Twitter Bootstrap](http://getbootstrap.com/) + [LESS](http://lesscss.org/). Sails.js uses as default task runner [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) as package manger for the client side.

1. ## Installation
After cloning the repository on your local machine, you'll have to issue the following commands:

		$ npm install
		$ cd assets
		$ bower install
		$ cd ..
		$ grunt build


2. ## Running the app
In order to run the app, issue the following command:  
`$ sails lift`