const net = require('net'); // Import the net module for TCP networking
const crypto = require('crypto'); // Import the crypto module for encryption
const fs = require('fs'); // Import the file system module for file operations

// Read the client's private key from the PEM file
const clientPrivateKey = fs.readFileSync('./ws-server/client_private_key.pem', 'utf8');

// Read the server's public key from the PEM file
const serverPublicKey = fs.readFileSync('./ws-server/server_public_key.pem', 'utf8');

const PORT = 8080; // Port on which the client will connect to the server

// Create a new socket client
const client = new net.Socket();

// Connect to the server at the specified port and localhost address
client.connect(PORT, '127.0.0.1', () => {
    console.log('Connected to server'); // Log a message upon successful connection
});

// Listen for user input from standard input (stdin)
process.stdin.on('data', (data) => {
    const message = data.toString().trim(); // Convert input data to string and trim whitespace

    // Encrypt the message using the server's public key with RSA_PKCS1_OAEP_PADDING
    const encryptedMessage = crypto.publicEncrypt({
        key: serverPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256" // Explicitly define OAEP hash function
    }, Buffer.from(message));

    // Log the encrypted message in base64 format
    console.log('Sending encrypted message: ', encryptedMessage.toString('base64'));

    // Send the encrypted message to the server
    client.write(encryptedMessage.toString('base64'));

    // If the user types 'quit', close the connection
    if (message === 'quit') {
        client.end();
    }
});

// Listen for data received from the server
client.on('data', (data) => {
    try {
        // Convert received data from base64 and decrypt it using the client's private key
        const encryptedMessage = Buffer.from(data.toString(), 'base64');

        // Decrypt the message using the client's private key with RSA_PKCS1_OAEP_PADDING
        const decryptedMessage = crypto.privateDecrypt({
            key: clientPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256" // Explicitly define OAEP hash function
        }, encryptedMessage);

        // Log the decrypted message received from the server
        console.log('Received from server (decrypted): ' + decryptedMessage.toString());
    } catch (err) {
        console.error('Decryption error:', err); // Log any decryption errors
    }
});

// Listen for the close event to handle disconnection
client.on('close', () => {
    console.log('Connection closed'); // Log when the connection is closed
    process.exit(); // Exit the process
});
