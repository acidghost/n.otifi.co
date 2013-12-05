/**
 * EventController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EventController)
   */
  _config: {

    pluralize: true,
    blueprints: {
      rest: true
    }

  },


  findEvents: function(req, res) {

    var artist = req.param('artist');


  },

  mineEvents: function(req, res) {

    var artist = req.param('artist');
    var request = require('request');
    var cheerio = require('cheerio');
    var raEventsUrl = 'http://www.residentadvisor.net/dj/'+artist+'/dates';

    var requestArgs = {
      url: raEventsUrl,
      followRedirect: true
    }
    request(requestArgs, function(err, resp, html) {

      if(err) {
        res.json({ success: false, message: err }, 500);
      }

      var upcomingEvents = [];

      if(resp.request._redirectsFollowed) {
        res.json({ success: false, message: 'Unable to find artist' }, 404);
      } else {
        var $ = cheerio.load(html)('div');

        $.map(function(i, divElm) {

          if(cheerio(divElm).attr('itemtype') == 'http://data-vocabulary.org/Event') {
            var aLinks = cheerio(divElm).find('a[itemprop="url summary"]');
            var evntID = cheerio(aLinks).attr('href').split('?')[1];
            var evntName = cheerio(aLinks).text();
            var evntLocation = cheerio(divElm)
              .find('span[itemprop="name"] > a')
              .text() || cheerio(divElm).find('span[itemprop="name"]').text();
            var evntAddress = cheerio(divElm)
              .find('span[itemprop="location"] span[itemprop="address"] a')
              .text();
            var startDate = cheerio(divElm).find('time[itemprop="startDate"]')
              .attr('datetime');
            var endDate = cheerio(divElm).find('time[itemprop="endDate"]')
              .attr('datetime') || null;
            upcomingEvents.push({
              eventID: evntID,
              eventName: evntName,
              location: {
                name: evntLocation,
                address: evntAddress
              },
              startDate: startDate,
              endDate: endDate
            });
          }

        });

        res.json({ success: true, datas: upcomingEvents });
      }

    });

  }

  
};
