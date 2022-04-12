'use strict';

var bcrypt = require('bcrypt-nodejs');
require('date-utils');

module.exports = function(){
var date = new Date();
return date.toFormat('YYYY-MM-DD HH24:MI:SS');


};