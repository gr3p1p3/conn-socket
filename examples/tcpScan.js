(async () => {
    const cSocket = require('../getTunneledSocket');
    const PORTS = [80, 443, 22];

    for (let port of PORTS) {
        const opt = {
            proxyHost: '127.0.0.1',
            proxyPort: 9080,
            targetHost: 'npmjs.com',
            targetPort: port,
            timeout: 5000
        };

        process.stdout.write('##Target => ' + opt.targetHost + ' PORT => ' + opt.targetPort);
        const tunneledSocket = await cSocket(opt);

        if (tunneledSocket) {
            process.stdout.write(' - OPEN!\n');
            tunneledSocket.destroy();
        } else {
            process.stdout.write(' - CLOSE!\n');
        }
    }
})();