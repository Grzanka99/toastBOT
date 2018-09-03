const mysql = require('sync-mysql');
const datab = require("../json/data.json");

var con = new mysql({
  host: datab.host,
  user: datab.user,
  password: datab.password,
    database: datab.database
});


module.exports = con;