const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to write appointment details to a text file
const writeToFile = (appointmentDetails) => {
    const data = `Patient ID: ${appointmentDetails.patientId}, Doctor ID: ${appointmentDetails.doctorId}, Room ID: ${appointmentDetails.roomId}, Appointment Date: ${appointmentDetails.appointmentDate}\n`;
    fs.writeFileSync('appointments.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Appointment details written to file.');
        }
    });
};

app.post('/', async (req, res) => {
    const appointmentDetails = req.body;
    console.log('Received appointment details:', appointmentDetails);
    
    // Write appointment details to a file
    writeToFile(appointmentDetails);

    try {
        const { patientId, doctorId, roomId, appointmentDate } = appointmentDetails;
        const responseMessage = `Appointment booked for Patient ID: ${patientId}, Doctor ID: ${doctorId}, Room ID: ${roomId}, Date: ${appointmentDate}`;
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
        res.json({ content: data });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
