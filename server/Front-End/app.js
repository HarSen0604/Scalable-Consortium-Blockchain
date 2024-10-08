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
        const doctorAddress = '0x112CD5BECAbD069A29350D47F4550781142e18DD';  // Doctor contract address
        const patientAddress = '0xc7Aa2566169dF55e3ABcb701B6ccf18B4f2dB6aF';  // Patient contract address
        const appointmentAddress = '0xdEE71D4EFa1Be50FA642445f4bA6221fea463B2F';  // Appointment contract address

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

        document.getElementById('getExecutionResultButton').addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:5500/appointments');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                document.getElementById('executionResult').innerHTML = `
                    <pre>${data.content}</pre>
                `;
            } catch (error) {
                console.error(error);
                alert('Error fetching appointment data: ' + error.message);
            }
        });
        

    } else {
        alert('MetaMask not detected. Please install MetaMask to interact with this application.');
    }
});