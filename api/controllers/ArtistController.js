/**
 * ArtistController
 *
 * @module      :: Controller
 * @description  :: A set of functions called `actions`.
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
var $ = require('cheerio');

var raSearchUrl = 'http://www.residentadvisor.net/search.aspx?section=djs&searchstr=';
var raDjUrl = 'http://www.residentadvisor.net/dj/';
var raImageUrl = 'http://www.residentadvisor.net/images/profiles/{{name}}.jpg';           // {{name}} is a placeholder for artist's name

var controller;

module.exports = controller = {




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ArtistController)
   */
  _config: {},

  //  GET REST blueprint
  find: function (req, res) {
    var q = req.param('id');

    Artist.find({ RAname: q }).done(function(err, artists) {
      if(!err && artists.length>0) {
        controller._success(200, artists, res);
      }
    });

    var url = raSearchUrl + encodeURIComponent(q);
    var redirected = false;

    var requestArgs = {
      url: url,
      followRedirect: true
    }
    request(requestArgs, function (err, resp, html) {
      if (err) {
        controller._error(500, err, res);
      }
      if (resp.request._redirectsFollowed) {
//      console.log("Redirected!");
        redirected = true;
      }
//      console.log(resp.request.redirects);

      var foundedArtists = [];

      if(redirected) {
        var target = $.load(html)('h1.title2 span[itemprop="name"]');
//        console.log(target);
        target.map(function(i, elm) {
          var name = $(elm).text();
          var raName = resp.request.redirects[0].redirectUri.split('/dj/')[1];
          foundedArtists.push({
            RAname: raName,
            RAurl: raDjUrl + raName,
            name: name,
            imageUrl: raImageUrl.replace('{{name}}', raName)
          });
        });
      } else {
        var links = $.load(html)('a');
        links.map(function (i, link) {
          var href = $(link).attr('href');
          if (href && href.match('/dj/')) {
            // console.log("Found: "+href);
            var raName = href.split('/dj/')[1];
            foundedArtists.push({
              RAname: raName,
              RAurl: raDjUrl + raName,
              name: $(link).text(),
              imageUrl: raImageUrl.replace('{{name}}', raName)
            });
            // console.log(foundedUrls);
          }
        });
      }


      if (foundedArtists.length > 0) {
        controller._success(200, foundedArtists, res);
      } else {
        controller._error(404, "Nessun artista trovato", res);
      }
    });
  },

  //  POST findAll blueprint
  findAll: function(req, res) {
    Artist.find(req.body, function(err, artists) {
      if(err) {
        // TODO: fix error handling for api client (doesn't enter here)
        console.error("findAll error: ",err);
        controller._error(err.status, err, res);
      } else {
        if(artists.length > 0) {
          controller._success(200, artists, res);
        } else {
          controller._error(404, "Nessun artista trovato", res);
        }
      }
    });
  },

  //  POST REST blueprint
  create: function(req, res) {
    var datas = req.body;

    Artist.create(datas, function(err, artist) {
      if(err) {
        controller._error(400, err, res);
      } else {
        controller._success(200, artist, res);
      }
    });
  },

  //  PUT REST blueprint
  update: function(req, res) {
    var raName = req.param('id');
    var datas = req.body;

    var query = { RAname: raName };
    Artist.update(query, datas, function(err, artist) {
      if(err) {
        controller._error(err.status, err, res);
      } else {
        if(artist.length > 0) {
          controller._success(200, artist, res);
        } else {
          controller._error(404, "Nessun artista trovato", res);
        }
      }
    });
  },

  //  DELETE REST blueprint
  destroy: function(req, res) {
    var raName = req.param('id');

    var query = { RAname: raName };
    Artist.findOne(query).done(function(err, artist) {
      if(artist) {
        Artist.destroy(query, function(err) {
          if(err) {
            console.error(err);
            controller._error(err.status, err, res);
          } else {
            delete artist.id;
            controller._success(200, artist, res);
          }
        });
      } else {
        controller._error(404, "Nessun artista trovato", res);
      }
    });
  },



  //  Private util methods
  _success: function(code, data, res) {
    var data = { success: true, data: data };
    res.json(data, code);
  },
  _error: function (code, err, res) {
    var data = { success: false, message: err };
    res.json(data, code);
  },


};
