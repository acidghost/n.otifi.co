/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	eventID: {
      type: 'integer',
      required: true,
      unique: true
    },
    eventName: {
      type: 'string',
      required: true
    },
    eventLocation: {
      type: 'string',
      required: true
    },
    eventAddress: {
      type: 'string'
    },
    eventStartDate: {
      type: 'date',
      required: true
    },
    eventEndDate: {
      type: 'date'
    },
    eventUrl: {
      type: 'string',
      required: true,
      url: true
    }
    
  }

};
