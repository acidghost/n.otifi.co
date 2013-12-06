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

      for(var i in artists) {

        var currentMiningUrl = baseApiUrl+'/events/'+artists[i].RAname+'/mine';
        console.log('Mining artist: '+artists[i].RAname);
        var requestArgs = {
          uri: currentMiningUrl,
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
              // Update events base
              for(var evtIndex in events) {
                var event = events[evtIndex];
                console.log('Searching for event: '+event.eventID);
                Event.findOne({ eventID: event.eventID }).done(function(err, foundEvent) {

                  if(err) {
                    console.log('Error: '+err);
                  } else {
                    if(foundEvent) {
                      // Update event data
                      // NOTE: do nothing for now...
                      /*
                       var url = baseApiUrl+'/events/'+foundEvent.eventID;
                       request.put({
                       uri: url,
                       json: JSON.stringify(event)
                       }, function(err, resp, body) {
                       if(!err) {
                       if(!body.success) {
                       console.log(body.message);
                       }
                       }
                       });
                       */
                      console.log('Event exists: ' + foundEvent);
                    } else {
                      // Create new event
                      var url = baseApiUrl+'/events';
                      request.post({
                        url: url,
                        json: event
                      }, function(err, resp, body) {
                        if(!err) {
                          if(!body.success) {
                            console.log('Error creating event: '+body.message);
                          } else {
                            console.log('New eventCreated: '+body.data.eventName);
                          }
                        } else {
                          console.log('Err creating the event: '+err);
                        }
                      });
                    }
                  }

                });
              }
            }
          } else {
            console.log('Error on mining events url: '+currentMiningUrl+'\nSuccess false, message: '+body.message);
          }

        });

      }

    });

    res.json({});

  }

  
};
