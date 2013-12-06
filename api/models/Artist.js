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
      delete obj.events;
      return obj;
    }
    
  }

};
