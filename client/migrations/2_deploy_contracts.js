// Import the smart contract artifacts for deployment
const DoctorContract = artifacts.require("DoctorContract");  // Import DoctorContract artifact
const PatientContract = artifacts.require("PatientContract");  // Import PatientContract artifact
const AppointmentContract = artifacts.require("AppointmentContract");  // Import AppointmentContract artifact

/**
 * @dev Migration script to deploy the Doctor, Patient, and Appointment contracts.
 *      This script first deploys the DoctorContract, then the PatientContract, 
 *      and finally the AppointmentContract in sequence.
 * @param {Truffle.Deployer} deployer - The deployer object provided by Truffle, used to deploy contracts.
 */
module.exports = function (deployer) {
    // Deploy the DoctorContract first
    deployer.deploy(DoctorContract)
        .then(() => {
            // After DoctorContract is deployed, deploy the PatientContract
            return deployer.deploy(PatientContract);
        })
        .then(() => {
            // After PatientContract is deployed, deploy the AppointmentContract
            return deployer.deploy(AppointmentContract);
        });
};