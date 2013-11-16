/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
    subscriptions: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.password;
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
    }
  },

  beforeCreate: function(attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }

};
