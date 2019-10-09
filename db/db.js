const config = require('./config')
const mysql  = require('mysql');
const conn = mysql.createPool(config)
module.exports = conn
