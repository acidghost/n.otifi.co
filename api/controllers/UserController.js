/**
 * UserController
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

var bcrypt = require('bcrypt');

module.exports = controller =  {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {
    blueprints: {
      actions: false,
      rest: false
    }

  },

  signUp: function(req, res) {
    var newUser = req.body;
    newUser.emailVerified = false;
    newUser.subscriptions = [];

    User.create(newUser, function(err, user) {
      if(err) {
        res.json({ success: false, message: err }, 400);
      } else {
        res.json({ success: true, data: user }, 200);
      }
    });
  },

  login: function(req, res) {
    if(req.body == '' || !req.body.email || !req.body.password) {
      console.log('missing credentials');
      res.json({ success: false, message: 'Some credentials are missing' }, 400);
      return;
    }

    User.findOneByEmail(req.body.email).done(function (err, user) {
      if (err) res.json({ success: false, message: 'DB error' }, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.json({ success: false, message: 'Server error' }, 500);

          if (match) {
            // password match
            req.session.user = user.id;
            req.session.authenticated = true;
            res.json({ success: true, data: user }, 200);
          } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            res.json({ success: false, message: 'Invalid username/password' }, 403);
          }
        });
      } else {
        res.json({ success: false, message: 'Invalid username/password' }, 403);
      }
    });
  },

  userInfo: function(req, res) {
    User.findOne(req.session.user).done(function(err, user) {
      if(err) {
        res.json({ success: false, message: err }, 500);
      } else {
        res.json({ success: true, data: user.toJSON() }, 200);
      }
    });
  },

  update: function(req, res) {
    var datas = req.body;

    if(datas.code) {
      // Verify email address
      User.findOne(req.session.user).done(function(err, user) {
        if(err) {
          res.json({ success: false, message: err }, 400);
        } else {
          if(user.code === datas.code) {
            user.emailVerified = true;
            user.code = null;
            user.save(function(err) {
              if(err) {
                res.json({ success: false, message: err }, 500);
              } else {
                res.json({ success: true, data: user }, 200);
              }
            });
          } else {
            res.json({ success: false, data: 'Verification code not valid' }, 400);
          }
        }
      });
    } else {
      User.update(req.session.user, datas, function(err, user) {
        if(err) {
          res.json({ success: false, message: err }, 400);
        } else {
          res.json({ success: true, data: user }, 200);
        }
      });
    }
  }

  
};
