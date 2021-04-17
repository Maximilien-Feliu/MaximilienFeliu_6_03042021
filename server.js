const http = require('http');                                                       // import http package
const app = require('./app');                                                       // import app.js

/*****  Return a valid port, whether it's a number or a chain  *****/
const normalizePort = val => {
    const port = parseInt(val, 10);
    
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || 3000);                               // Use the port by the environment variable or the port 3000
app.set('port', port);                                                              // set the port 

/*****  Search differents errors and handle it correctly, then save in the server  *****/
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);                                                  // create a server using app.js 

/*****  launch the server, handle errors, listen to the port to connect and execute the console  *****/
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);                                                                    // listen the port set in the variable 'port'