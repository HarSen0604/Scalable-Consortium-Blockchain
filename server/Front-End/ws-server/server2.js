const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const PORT = 5500;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Read the server's private key from the PEM file
const serverPrivateKey = fs.readFileSync('./Front-End/ws-server/server_private_key.pem', 'utf8');

/**
 * Decrypts the given encrypted appointment message.
 * 
 * @param {string} encryptedMessage - The encrypted appointment details in base64 format.
 * @returns {Object|null} - The decrypted appointment details as an object or null if decryption fails.
 */
const decryptAppointmentDetails = (encryptedMessage) => {
    try {
        // Decode base64 to get the buffer
        const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');

        // Decrypt the message using the server's private key
        const decryptedBuffer = crypto.privateDecrypt({
            key: serverPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256" // Use the same hash function as in encryption
        }, encryptedBuffer);

        // Convert decrypted buffer to string (JSON format)
        const decryptedMessage = decryptedBuffer.toString('utf8');

        // Parse the JSON string to get the appointment details object
        const appointmentDetails = JSON.parse(decryptedMessage);
        console.log('Decrypted appointment details:', appointmentDetails);

        return appointmentDetails;
    } catch (error) {
        console.error('Error decrypting appointment details:', error);
        return null; // Return null on failure
    }
};

/**
 * Writes the appointment details to a text file after decrypting the message.
 * 
 * @param {Object} appointmentDetail - The appointment details object containing the encrypted message.
 */
const writeToFile = (appointmentDetail) => {
    // Extract the encrypted message
    const tempData = appointmentDetail.encryptedMessage;
    
    // Decrypt the appointment details
    const appointmentDetails = decryptAppointmentDetails(tempData);

    // Extract the patient details from the decrypted object
    const patient = appointmentDetails.patient;
    
    // Format the data for writing
    const data = `Patient Name: ${patient.name}\nAge: ${patient.age}\nMedical History: ${patient.medicalHistory}\nAppointment Date: ${patient.appointmentDate}\n`;
    
    // Write to the appointments text file
    fs.writeFileSync('./appointments.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Appointment details written to file.');
        }
    });
    return patient;
};

// Endpoint to receive appointment details via POST
app.post('/', async (req, res) => {
    const appointmentDetails = req.body;
    console.log('Received appointment details:', appointmentDetails);
    
    // Write appointment details to a file
    const patient = writeToFile(appointmentDetails);

    try {
        // Prepare response message
        const responseMessage = `Appointment booked for Patient Name: ${patient.name}, Age: ${patient.age}, Medical History: ${patient.medicalHistory}, Date: ${patient.appointmentDate}`;
        
        // Send JSON response
        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Error processing appointment:', error);
        res.status(500).send('Error processing appointment');
    }
});

// New endpoint to execute some functionality and return data
app.get('/execute', (req, res) => {
    const executionResult = 'Server-side execution completed successfully.';
    console.log(executionResult);
    res.json({ result: executionResult });
});

// New endpoint to read appointment details from the text file
app.get('/appointments', (req, res) => {
    fs.readFile('appointments.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        // Send the file content as JSON response
        res.json({ content: data });
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
