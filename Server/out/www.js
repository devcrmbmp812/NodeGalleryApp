"use strict";
/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http = require("http");
const application = app_1.Application.bootstrap();
// Configuration du port d'écoute
const appPort = normalizePort(process.env.PORT || '3002');
application.app.set('port', appPort);
// Création du serveur HTTP.
let server = http.createServer(application.app);
/**
 *  Écoute du traffic sur le port configuré.
 */
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d'écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
}
/**
 * Se produit lorsque le serveur détecte une erreur.
 *
 * @param error Erreur interceptée par le serveur.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = (typeof appPort === 'string') ? 'Pipe ' + appPort : 'Port ' + appPort;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Se produit lorsque le serveur se met à écouter sur le port.
 */
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
//# sourceMappingURL=www.js.map