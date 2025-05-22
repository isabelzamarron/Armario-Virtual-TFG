"use strict";

const mysql = require("mysql");
var fs = require('fs');

var configPath = './config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

const pool = mysql.createPool({
    host : parsed.host,
    user : parsed.user,
    password : parsed.password,
    database : parsed.database,
    port: parsed.port
  });
  

 
function getConnection(done) {
    // Obtiene una conexión de la piscina
    pool.getConnection(function (err, connection) {
      if (err) {
        // Maneja errores de conexión a la base de datos
        console.log("Error de conexión a la base de datos.");
      } else {
        // Si no hay errores, pasa la conexión al callback proporcionado
        done(connection);
      }
    });
    
  }
  
  module.exports = getConnection;