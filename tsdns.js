var net = require('net');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./tsdns.sqlite');
var sockets = [];
var tsdns = net.createServer(function (socket) {
        sockets.push(socket);
        var writeEnd = function(message) {
            socket.write(message, function() {
                socket.end();
            });
        };
        var freeTimeout = setTimeout(function() {
           writeEnd('404');
        }, 60000); //Timeout for freeing connection-count
        socket.on('data', function(data) {
            domain = data.toString().replace(/\r|\n/g, '');
            db.all("SELECT * FROM zones WHERE zone=?",domain, function(err, rows){
                if( err ){
                    console.log(err);
                }else{
                    if( rows.length ){
                       writeEnd(rows[0].target);
                    }else{
                       writeEnd('404');
                    }
               }
            });
           
        });
        socket.on('close', function() {
            for (i in sockets) {
                if (sockets[i] === socket) {
                    sockets.splice(i, 1);
                }
            }
        })
        socket.on('error', function(error) {}); //Blackhole all Errors
    });
    tsdns.on('close', function() {
        if(typeof databaseConnection.close=="function") databaseConnection.close();
        log('Stopped MySQL-TSDNS-SERVER for Teamspeak 3');
    })

module.exports = tsdns;
