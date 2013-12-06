/**
 * Artist
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	RAname: {
      type: 'string',
      required: true,
      unique: true
    },
    RAurl: {
      type: 'string',
      required: true,
      url: true
    },
    name: {
      type: 'string',
      required: true
    },
    imageUrl: {
      type: 'string',
      required: true,
      url: true
    },
    events: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      obj.events = {};
      obj.events.href = sails.config.host+sails.config.controllers.blueprints.prefix+'/events/'+obj.RAname
      obj.href = sails.config.host+sails.config.controllers.blueprints.prefix+'/artist/'+obj.RAname;
      return obj;
    }
    
  }

};
