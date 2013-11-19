/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
  	
  	email: {
      type: 'string',
      required: true,
      unique: true,
      email: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    emailVerified: {
      type: 'boolean'
    },
    code: {
      type: 'string'
    },
    subscriptions: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.password;
      delete obj.code;
      return obj;
    }
    
  },

  beforeValidation: function(attrs, next) {
    var subscriptions = attrs.subscriptions;
    if(subscriptions && subscriptions.length > 0) {
      var orQuery = [];
      for(var s in subscriptions) {
        orQuery.push({ RAname: subscriptions[s] });
      }

      Artist.find({ or: orQuery }).done(function(err, artists) {
        if(err) {
          return next(err);
        } else {
          if(artists.length > 0) {
            var raNames = [];
            for(var a in artists) {
              raNames.push(artists[a].RAname);
            }
            var index = 0;
            var matching = false;
            var matched = [];
            do {
              matching = false;
              for(var j = 0; j<subscriptions.length && !matching; j++) {
                if(raNames[index] == subscriptions[j]) {
                  matching = true;
                  matched.push(subscriptions[j]);
                }
              }
              index++;
            } while(matching && index < raNames.length);
            if(matching) {
              attrs.subscriptions = matched;
              return next();
            } else {
              return next();
            }
          } else {
            delete attrs.subscriptions;
            return next();
          }
        }
      });
    } else {
      next();
    }
  },

  beforeCreate: function(attrs, next) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  },

  afterCreate: function(newUser, next) {
    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill(sails.config.mandrill.test.apiKey);

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var code = bcrypt.hashSync(current_date+random, 1);

    var templateName = "email-verification-template";
    var templateContent = [
      {
        name: "header",
        content: "<h1>n.otifi.co</h1>"
      },
      {
        name: "main",
        content: "<p>Please verify your e-mail address by inserting this verification code: <b>"+code+"</b>.</p>"
      },
      {
        name: "footer",
        content: "<p>n.otifi.co</p>"
      }
    ];
    var message = {
      text: "Please, verify your email address by inserting this verification code: "+code+".",
      tags: ["email-verification"],
      to: [{
        email: newUser.email,
        name: newUser.email,
        type: "to"
      }]
    };
    mandrill_client.messages.sendTemplate(
      {
        template_name: templateName,
        template_content: templateContent,
        message: message,
        async: false
      },
      function(result) {
        if(result.length > 0 && result[0].status == 'sent') {
          User.update(newUser.id, { code: code }, function(err, user) {
            if(err) {
              return next(err);
            } else {
              next(user);
            }
          });
        } else {
          //TODO: manage not sent e-mails
          next(user);
        }
      },
      function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        newUser.destroy();
        return next(e);
      }
    );
  }

};
