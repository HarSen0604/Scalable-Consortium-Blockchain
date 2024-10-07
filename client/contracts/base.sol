// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Consortium
/// @dev Main consortium contract for linking all modules including doctors, patients, and appointments
contract Consortium {
    address public doctorContract;      // Address of the Doctor contract
    address public patientContract;     // Address of the Patient contract
    address public appointmentContract; // Address of the Appointment contract
    address public admin;               // Address of the contract admin

    /// @dev Constructor that sets the contract addresses and admin
    constructor(address _doctorContract, address _patientContract, address _appointmentContract) {
        doctorContract = _doctorContract;          // Set the doctor contract address
        patientContract = _patientContract;        // Set the patient contract address
        appointmentContract = _appointmentContract; // Set the appointment contract address
        admin = msg.sender;                        // Set the deploying address as admin
    }

    /// @dev Modifier to restrict access to admin-only functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can access this function");
        _; // Placeholder for the modified function code
    }

    /// @notice Set the address of the Doctor contract
    /// @dev This function can only be called by the admin
    /// @param _doctorContract New address for the Doctor contract
    function setDoctorContract(address _doctorContract) public onlyAdmin {
        doctorContract = _doctorContract; // Update the doctor contract address
    }

    /// @notice Set the address of the Patient contract
    /// @dev This function can only be called by the admin
    /// @param _patientContract New address for the Patient contract
    function setPatientContract(address _patientContract) public onlyAdmin {
        patientContract = _patientContract; // Update the patient contract address
    }

    /// @notice Set the address of the Appointment contract
    /// @dev This function can only be called by the admin
    /// @param _appointmentContract New address for the Appointment contract
    function setAppointmentContract(address _appointmentContract) public onlyAdmin {
        appointmentContract = _appointmentContract; // Update the appointment contract address
    }
    
    // Add additional linking mechanisms if needed
}