global.STATUS_CODES = require('./constants').STATUS_CODES

global.mongoose = require('mongoose');
require('./Database')

global.upload = require('./fileUpload')

global.ROLES = {
  USER : 'User',
  ADMIN : 'Admin'
}