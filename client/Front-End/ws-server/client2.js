const net = require('net');
const crypto = require('crypto');
const fs = require('fs');

// Read the client's private key from the file
const clientPrivateKey = fs.readFileSync('./ws-server/client_private_key.pem', 'utf8');

// Read the server's public key from the file
const serverPublicKey = fs.readFileSync('./ws-server/server_public_key.pem', 'utf8');

const PORT = 8080;

const client = new net.Socket();

client.connect(PORT, '127.0.0.1', () => {
    console.log('Connected to server');
});

process.stdin.on('data', (data) => {
    const message = data.toString().trim();

    // Encrypt the message using the server's public key with RSA_PKCS1_OAEP_PADDING
    const encryptedMessage = crypto.publicEncrypt({
        key: serverPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256" // Explicitly define OAEP hash
    }, Buffer.from(message));

    console.log('Sending encrypted message: ', encryptedMessage.toString('base64'));

    client.write(encryptedMessage.toString('base64'));

    if (message === 'quit') {
        client.end();
    }
});

client.on('data', (data) => {
    try {
        const encryptedMessage = Buffer.from(data.toString(), 'base64');

        // Decrypt the message using the client's private key with RSA_PKCS1_OAEP_PADDING
        const decryptedMessage = crypto.privateDecrypt({
            key: clientPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256" // Explicitly define OAEP hash
        }, encryptedMessage);

        console.log('Received from server (decrypted): ' + decryptedMessage.toString());
    } catch (err) {
        console.error('Decryption error:', err);
    }
});

client.on('close', () => {
    console.log('Connection closed');
    process.exit();
});
