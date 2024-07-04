const { EventEmitter } = require('events');

const reloadEmitter = new EventEmitter();

module.exports = reloadEmitter;
