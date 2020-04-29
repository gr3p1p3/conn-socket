/**
 * Open TCP-Connection with HttpProxy, that will establish a tunnel to target host.
 * @param {Object} options
 * @param {String} options.proxyHost - Host of HTTP-Proxy to use.
 * @param {Number} options.proxyPort - Port of HTTP-Proxy
 * @param {String} options.targetHost - Target host
 * @param {Number} options.targetPort - Target port
 * @param {Number} options.timeout - max. time-to-live
 * @return {Promise} - Resolves to tunneled Tcp-Socket or false.
 */
module.exports = function getTunneledSocket(options) {
    const TcpClient = require('net').Socket;
    const CLRF = '\r\n';

    const PAYLOAD = 'CONNECT ' + options.targetHost + ':' + options.targetPort + ' HTTP/1.1' + CLRF
        + 'Host: ' + options.targetHost + CLRF + CLRF;

    const tunneledSocket = new TcpClient();

    return new Promise(function (resolve, reject) {
        // TCP-Connection to HTTP-Proxy
        tunneledSocket.connect({
            port: options.proxyPort,
            host: options.proxyHost
        }, function onConnectionOpen() {
            // OnConnection established, send CONNECT-PAYLOAD
            tunneledSocket.write(PAYLOAD); //injecting CONNECT-payload
        });

        if (options.timeout) {
            tunneledSocket.setTimeout(options.timeout);
        }

        tunneledSocket.on('data', function onDataReceived(data) {
            if (data.toString().indexOf('200') > -1) {
                // 200 is returned from http-proxy... tunnel is opened.
                resolve(tunneledSocket);
            } else {
                resolve(false);
            }
        });

        tunneledSocket.on('timeout', function () {
            tunneledSocket.destroy();
            resolve(false);
        });

        tunneledSocket.on('close', function () {
            resolve(false);
        });

        tunneledSocket.on('end', function () {
            tunneledSocket.destroy(); // killing client
            resolve(false);
        });

        tunneledSocket.on('error', function (err) {
            tunneledSocket.destroy(); // killing client
            reject(err);
        });
    });
};