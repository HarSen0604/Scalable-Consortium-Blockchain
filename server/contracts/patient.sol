// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title PatientContract
/// @dev A smart contract for managing patient information
contract PatientContract {
    // Struct representing a Patient
    struct Patient {
        string name;             // Name of the patient
        uint age;                // Age of the patient
        string medicalHistory;   // Medical history of the patient
    }

    // Mapping to store patients by their unique ID
    mapping(uint => Patient) private patients;

    // Address of the contract admin
    address public admin;

    /// @dev Constructor that sets the admin to the account that deploys the contract
    constructor() {
        admin = msg.sender; // Set the deploying address as admin
    }

    /// @dev Modifier to restrict access to admin-only functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can add or update patients");
        _; // Placeholder for the modified function code
    }

    /// @notice Add a new patient
    /// @dev This function can only be called by the admin
    /// @param _id Unique ID for the patient
    /// @param _name Name of the patient
    /// @param _age Age of the patient
    /// @param _medicalHistory Medical history of the patient
    function addPatient(uint _id, string memory _name, uint _age, string memory _medicalHistory) public onlyAdmin {
        // Create and store the patient in the mapping
        patients[_id] = Patient(_name, _age, _medicalHistory);
    }

    /// @notice Get details of a specific patient
    /// @dev Public function to retrieve patient information
    /// @param _id Unique ID of the patient
    /// @return name Name of the patient
    /// @return age Age of the patient
    /// @return medicalHistory Medical history of the patient
    function getPatient(uint _id) public view returns (string memory, uint, string memory) {
        // Retrieve the patient from the mapping
        Patient memory patient = patients[_id];
        return (patient.name, patient.age, patient.medicalHistory);
    }

    /// @notice Update information for an existing patient
    /// @dev This function can only be called by the admin
    /// @param _id Unique ID of the patient
    /// @param _name New name of the patient
    /// @param _age New age of the patient
    /// @param _medicalHistory New medical history of the patient
    function updatePatient(uint _id, string memory _name, uint _age, string memory _medicalHistory) public onlyAdmin {
        // Update the patient's information in the mapping
        patients[_id] = Patient(_name, _age, _medicalHistory);
    }
}