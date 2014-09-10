/**
 * CrawlerController
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

var request = require('request');

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CrawlerController)
   */
  _config: {
    blueprints: {
      rest: false,
      actions: false,
      shortcuts: false
    }
  },


  updateEventsBase: function(req, res) {

    var apiPrefix = sails.config.controllers.blueprints.prefix;
    var baseApiUrl = sails.config.host+apiPrefix;

    Artist.find().done(function(err, artists) {

      for(var i=0; i<artists.length; i++) {

        var artist = artists[i];
        var currentMiningUrl = baseApiUrl+'/events/'+artist.RAname+'/mine';
        console.log('Mining artist: '+artist.RAname);
        var requestArgs = {
          url: currentMiningUrl,
          followRedirect: false
        }
        request(requestArgs, function(err, resp, body) {

          if(err) {
            res.json({ success: false, message: err }, 500);
          }

          body = JSON.parse(body);
          if(body.success) {
            var events = body.data;
            if(events.length > 0) {
              // Get artist entity from response data
              var artistData = body.artist;
              Artist.findOne({ RAname: artistData.RAname }).done(function(err, artist) {
                // There is no need to check here for not-nulliness of artist
                // because we started mining for events based on artists that
                // already are in the DB

                // Update events base
                var artistEvents = artist.events || [];
                var initialEventsLen = (artist.events) ? (artist.events.length) : (0);
                for(var evtIndex=0; evtIndex<events.length; evtIndex++) {
                  var event = events[evtIndex];
                  //console.log('Searching for event: '+event.eventID);
                  Event.findOne({ eventID: event.eventID }).done(function(err, foundEvent) {

                    if(err) {
                      console.log('Error: '+err);
                    } else {
                      if(foundEvent) {
                        // Update event data
                        // NOTE: do nothing for now...
                        //console.log('Event exists: ' + foundEvent.eventName);
                        var eventID = parseInt(event.eventID);
                        if(artistEvents.indexOf(eventID) == -1) {
                          artistEvents.push(eventID);
                        }
                      } else {
                        // Create new event
                        var newEvent = {
                          eventID: event.eventID,
                          eventName: event.eventName,
                          eventLocation: event.location.name,
                          eventAddress: event.location.address,
                          eventStartDate: event.startDate,
                          eventEndDate: event.endDate,
                          eventUrl: event.eventUrl.split('http://')[1]
                        };
                        Event.create(newEvent).done(function(err, eventCreated) {
                          if(!err && eventCreated) {
                            console.log('New eventCreated: '+eventCreated.eventName);
                            var eventID = parseInt(eventCreated.eventID);
                            if(artistEvents.indexOf(eventID) == -1) {
                              artistEvents.push(eventID);
                            }
                          } else {
                            console.log('Err creating the event: ', err);
                          }
                        });
                      }
                    }

                  });
                }

                artist.events = artistEvents;
                artist.save(function(err) {
                  if(err) {
                    console.log('Error updating artist: '+err);
                  } else {
                    if(initialEventsLen != artistEvents.length) {
                      console.log('Artist events updated: '+artist.RAname);
                    }
                  }
                });

              });
            }
          } else {
            console.log('Error on mining events url: '+currentMiningUrl+'\nSuccess false, message: '+body.message);
          }

        });

      }

    });

    res.end();

  }

  
};
