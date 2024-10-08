// Event listener that waits for the page to load before executing the script
window.addEventListener('load', async () => {
    // Check if MetaMask (or any Web3 provider) is injected in the browser
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Request user's Ethereum account access via MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create a new instance of Web3 using MetaMask as the provider
        const web3 = new Web3(window.ethereum);

        // Define the deployed contract addresses (Replace with actual deployed addresses)
        const doctorAddress = '0xd0Da20c0c99651324F5d5F22A8E17369a3e085f9';  // Doctor contract address
        const patientAddress = '0xEE51D042DE8eB78456B81EF45eb3B5f0e6683829';  // Patient contract address
        const appointmentAddress = '0x8bf378ef2c213D24C77E9eD27cc09b9ed73c6D70';  // Appointment contract address

        // Retrieve the user's Ethereum accounts and set the first one as default
        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];

        // Fetch contract ABIs (Application Binary Interface) from the build folder
        const doctorContractJson = await fetch('../build/contracts/DoctorContract.json').then(response => response.json());
        const patientContractJson = await fetch('../build/contracts/PatientContract.json').then(response => response.json());
        const appointmentContractJson = await fetch('../build/contracts/AppointmentContract.json').then(response => response.json());

        // Create instances of the contracts using their ABI and deployed addresses
        const doctorContract = new web3.eth.Contract(doctorContractJson.abi, doctorAddress);
        const patientContract = new web3.eth.Contract(patientContractJson.abi, patientAddress);
        const appointmentContract = new web3.eth.Contract(appointmentContractJson.abi, appointmentAddress);

        // Dropdown selection functionality: Shows or hides form sections based on user's action selection
        document.getElementById('actionSelector').addEventListener('change', function () {
            const selectedAction = this.value;
            document.getElementById('addDoctorSection').style.display = 'none';
            document.getElementById('addPatientSection').style.display = 'none';
            document.getElementById('bookAppointmentSection').style.display = 'none';

            if (selectedAction === 'addDoctor') {
                document.getElementById('addDoctorSection').style.display = 'block';
            } else if (selectedAction === 'addPatient') {
                document.getElementById('addPatientSection').style.display = 'block';
            } else if (selectedAction === 'bookAppointment') {
                document.getElementById('bookAppointmentSection').style.display = 'block';
            }
        });

        // Set the default view to show 'Add Doctor' section when the page loads
        document.getElementById('addDoctorSection').style.display = 'block';

        // ---------------- Access Control Functionality ----------------

        async function isUserAuthorized() {
            const isAuthorized = await appointmentContract.methods.authorizedAddresses(defaultAccount).call();
            return isAuthorized;
        }

        async function handleUnauthorizedAccess() {
            const isAuthorized = await isUserAuthorized();

            if (!isAuthorized) {
                document.getElementById('accessDialog').style.display = 'block';
                document.getElementById('requestAccessButton').onclick = async () => {
                    await appointmentContract.methods.requestAccess().send({ from: defaultAccount });
                    alert("Access request sent to admin.");
                    document.getElementById('accessDialog').style.display = 'none';
                };
                throw new Error("User is not authorized.");
            }
        }

        // ---------------- Doctor Contract Functionality ----------------

        document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('doctorId').value;
            const name = document.getElementById('doctorName').value;
            const age = document.getElementById('doctorAge').value;
            const department = document.getElementById('doctorDepartment').value;

            try {
                // Calls the smart contract function to add a new doctor
                await doctorContract.methods.addDoctor(id, name, age, department)
                    .send({ from: defaultAccount });
                alert('Doctor added successfully!');
            } catch (error) {
                console.error(error);
                alert('Error adding doctor: ' + error.message);
            }
        });

        document.getElementById('getDoctorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const doctorId = Number(document.getElementById('doctorIdFetch').value);
            if (isNaN(doctorId)) {
                alert('Please enter a valid Doctor ID.');
                return;
            }

            try {
                const doctor = await doctorContract.methods.getDoctor(doctorId).call();
                document.getElementById('doctorInfo').innerHTML = `
                    <p>Name: ${doctor[0]}</p>
                    <p>Age: ${doctor[2]}</p>
                    <p>Department: ${doctor[1]}</p>
                `;
            } catch (error) {
                console.error(error);
                alert('Error fetching doctor information: ' + error.message);
            }
        });

        // ---------------- Patient Contract Functionality ----------------

        document.getElementById('addPatientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('patientId').value;
            const name = document.getElementById('patientName').value;
            const age = document.getElementById('patientAge').value;
            const medicalHistory = document.getElementById('patientMedicalHistory').value;

            try {
                await patientContract.methods.addPatient(id, name, age, medicalHistory)
                    .send({ from: defaultAccount });
                alert('Patient added successfully!');
            } catch (error) {
                console.error(error);
                alert('Error adding patient: ' + error.message);
            }
        });

        document.getElementById('getPatientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = Number(document.getElementById('patientIdFetch').value);
            if (isNaN(patientId)) {
                alert('Please enter a valid Patient ID.');
                return;
            }

            try {
                const patient = await patientContract.methods.getPatient(patientId).call();
                document.getElementById('patientInfo').innerHTML = `
                    <p>Name: ${patient[0]}</p>
                    <p>Age: ${patient[1]}</p>
                    <p>Medical History: ${patient[2]}</p>
                `;
            } catch (error) {
                console.error(error);
                alert('Error fetching patient information: ' + error.message);
            }
        });

        // ---------------- Appointment Contract Functionality ----------------

        document.getElementById('bookAppointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const appointmentId = document.getElementById('appointmentId').value;
            const patientId = document.getElementById('appointmentPatientId').value;
            const doctorId = document.getElementById('appointmentDoctorId').value;
            const roomId = document.getElementById('appointmentRoomId').value;
            const appointmentDate = document.getElementById('appointmentDate').value;

            try {
                await handleUnauthorizedAccess(); // Check if the user is authorized

                const patientExists = await patientContract.methods.getPatient(patientId).call();
                if (!patientExists || patientExists[0] === "") {
                    alert('Patient ID does not exist. Please add the patient before booking an appointment.');
                    return;
                }

                const doctorExists = await doctorContract.methods.getDoctor(doctorId).call();
                if (!doctorExists || doctorExists[0] === "") {
                    alert('Doctor ID does not exist. Please add the doctor before booking an appointment.');
                    return;
                }

                await appointmentContract.methods.createAppointment(appointmentId, patientId, doctorId, roomId, appointmentDate)
                    .send({ from: defaultAccount });
                alert('Appointment booked successfully!');
            } catch (error) {
                console.error(error);
                alert('Error booking appointment: ' + error.message);
            }
        });

        document.getElementById('getAppointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const appointmentId = Number(document.getElementById('appointmentIdFetch').value);
            if (isNaN(appointmentId)) {
                alert('Please enter a valid Appointment ID.');
                return;
            }

            try {
                const appointment = await appointmentContract.methods.getAppointment(appointmentId).call();
                document.getElementById('appointmentInfo').innerHTML = `
                    <p>Patient ID: ${appointment[0]}</p>
                    <p>Doctor ID: ${appointment[1]}</p>
                    <p>Room ID: ${appointment[2]}</p>
                    <p>Appointment Date: ${appointment[3]}</p>
                `;
            } catch (error) {
                console.error(error);
                alert('Error fetching appointment information: ' + error.message);
            }
        });
        document.getElementById('sendAppointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const appointmentId = Number(document.getElementById('appointmentIdSend').value);
            if (isNaN(appointmentId)) {
                alert('Please enter a valid Appointment ID.');
                return;
            }
        
            try {
                const appointment = await appointmentContract.methods.getAppointment(appointmentId).call();
        
                // Get the patientId from the appointment details
                const patientId = appointment[0]; // Assuming patientId is at index 0
        
                // Fetch patient details using the patientId
                const patient = await patientContract.methods.getPatient(patientId).call();
        
                // Format the appointment and patient details as JSON
                const appointmentDetails = {
                    patient: {
                        appointmentDate: appointment[3], // Assuming patient ID is at index 0
                        name: patient[0], // Assuming patient name is at index 1
                        age: patient[1], // Assuming patient age is at index 2
                        medicalHistory: patient[2], // Assuming patient medical history is at index 3
                    },
                };
        
                // Send the appointment and patient details to the server
                await sendAppointmentDetails(appointmentDetails);
        
            } catch (error) {
                console.error(error);
                alert('Error fetching appointment or patient information: ' + error.message);
            }
        });        

        // Function to send appointment details to the server
        async function sendAppointmentDetails(appointmentDetails) {
            console.log('Preparing to send appointment details:', appointmentDetails);

            try {
                // Convert appointmentDetails to a JSON string
                const appointmentDetailsString = JSON.stringify(appointmentDetails);

                // Fetch the server's public key in PEM format
                const serverPublicKeyPem = await fetch('./ws-server/server_public_key.pem').then(res => res.text());

                // Convert PEM to CryptoKey (Browser compatible)
                const serverPublicKey = await importPublicKey(serverPublicKeyPem);

                // Encrypt the appointment details using the Web Crypto API
                const encryptedDetails = await window.crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP",
                        hash: "SHA-256"
                    },
                    serverPublicKey,
                    new TextEncoder().encode(appointmentDetailsString)
                );

                // Send the encrypted message to the server as a base64 string
                const response = await fetch('http://localhost:5500/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        encryptedMessage: btoa(String.fromCharCode(...new Uint8Array(encryptedDetails))),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log('Encrypted appointment details sent successfully!');
            } catch (error) {
                console.error('Error sending appointment details:', error);
            }
        }

        // Helper function to import PEM-encoded RSA public key as CryptoKey
        async function importPublicKey(pem) {
            // Remove the PEM header and footer
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            const pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\n/g, "");
            const binaryDerString = window.atob(pemContents);
            const binaryDer = str2ab(binaryDerString);

            return window.crypto.subtle.importKey(
                "spki",
                binaryDer,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["encrypt"]
            );
        }

        // Helper function to convert a string to an ArrayBuffer
        function str2ab(str) {
            const buf = new ArrayBuffer(str.length);
            const bufView = new Uint8Array(buf);
            for (let i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }

    } else {
        alert('MetaMask not detected. Please install MetaMask to interact with this application.');
    }
    // This is the client-side code
    console.log('Client-side detected, starting client2.js...');

    const { exec } = require('child_process');

    exec('node ./ws-server/client2.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing client2.js: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Client2 stderr: ${stderr}`);
            return;
        }
        console.log(`Client2 stdout: ${stdout}`);
    });
});