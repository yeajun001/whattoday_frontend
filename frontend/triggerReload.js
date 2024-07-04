const reloadEmitter = require('./src/reloadEmitter');

reloadEmitter.emit('reload');
console.log('Reload event triggered');
