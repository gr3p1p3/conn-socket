# conn-socket

Create a connected TCP-Socket for tunneling your requests under HTTP-Proxy.

Absolute Beta-Version, Issues are welcome.

## Docs

The module only need one object as parameter and resolves to [tcpSocket](https://nodejs.org/api/net.html#net_class_net_socket) or **false**.

Object-Attributes are:

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
|proxyHost | <code>String</code> |  Host of HTTP-Proxy to use. |
|proxyPort | <code>Number</code> |  Port of HTTP-Proxy. |
|targetHost | <code>String</code> |  Target host. |
|targetPort | <code>Number</code> |  Target port. |
|[timeout] | <code>Number</code> |  Optional time-to-live. |



## Examples

### Tunneling for https

```javascript
(async () => {
    const cSocket = require('conn-socket');
    const tls = require('tls');

    const tunneledSocket = await cSocket({
        proxyHost: 'x.x.x.x',
        proxyPort: 3128,
        targetHost: 'https.here',
        targetPort: 443
    });

    const tlsOptions = {
        socket: tunneledSocket,
        // ... here other tls-socket options
        // @see https://nodejs.org/api/tls.html#tls_tls_connect_options_callback
    };

    tls.connect(tlsOptions, onConnectCallback); //tlsClient connected
})();
```

### Tunneling for TCP-Scanning

```javascript
(async () => {
    const cSocket = require('../getTunneledSocket');
    const PORTS = [80, 443, 22];

    for (let port of PORTS) {
        const opt = {
            proxyHost: 'x.x.x.x',
            proxyPort: 3128,
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

// ##Target => npmjs.com PORT => 80 - OPEN!
// ##Target => npmjs.com PORT => 443 - OPEN!
// ##Target => npmjs.com PORT => 22 - CLOSE!
```

### Tunneling for SFTP or SSH

You need to use the module [ssh2-sftp-client](https://www.npmjs.com/package/ssh2-sftp-client) or [ssh2](https://www.npmjs.com/package/ssh2) as SFTP/SSH Client.

```javascript
(async () => {
    const cSocket = require('conn-socket');
    const SFTPClient = require('ssh2-sftp-client');

    const tunneledSocket = await cSocket({
        proxyHost: 'x.x.x.x',
        proxyPort: 3128,
        targetHost: 'sftpServer.host.here',
        targetPort: 22
    });

    const client = new SFTPClient();
    client.connect({
        sock: tunneledSocket
        // ... here other .connect() options of `ssh2-sftp-client`
        // @see https://www.npmjs.com/package/ssh2-sftp-client#org1ff0f58
    }); //client connected
})();
```