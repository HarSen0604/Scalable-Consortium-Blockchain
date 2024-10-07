// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title DoctorContract
/// @dev A smart contract for managing doctor information
contract DoctorContract {
    // Struct representing a Doctor
    struct Doctor {
        string name;          // Name of the doctor
        string department;    // Department of the doctor
        uint age;            // Age of the doctor
    }

    // Mapping to store doctors by their unique ID
    mapping(uint => Doctor) private doctors;

    // Address of the contract admin
    address public admin;

    /// @dev Constructor that sets the admin to the account that deploys the contract
    constructor() {
        admin = msg.sender; // Set the deploying address as admin
    }

    /// @dev Modifier to restrict access to admin-only functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can add or update doctors");
        _; // Placeholder for the modified function code
    }

    /// @notice Add a new doctor
    /// @dev This function can only be called by the admin
    /// @param _id Unique ID for the doctor
    /// @param _name Name of the doctor
    /// @param _age Age of the doctor
    /// @param _department Department of the doctor
    function addDoctor(uint _id, string memory _name, uint _age, string memory _department) public onlyAdmin {
        // Create and store the doctor in the mapping
        doctors[_id] = Doctor(_name, _department, _age);
    }

    /// @notice Get details of a specific doctor
    /// @dev Public function to retrieve doctor information
    /// @param _id Unique ID of the doctor
    /// @return name Name of the doctor
    /// @return department Department of the doctor
    /// @return age Age of the doctor
    function getDoctor(uint _id) public view returns (string memory, string memory, uint) {
        // Retrieve the doctor from the mapping
        Doctor memory doctor = doctors[_id];
        return (doctor.name, doctor.department, doctor.age);
    }

    /// @notice Update information for an existing doctor
    /// @dev This function can only be called by the admin
    /// @param _id Unique ID of the doctor
    /// @param _name New name of the doctor
    /// @param _age New age of the doctor
    /// @param _department New department of the doctor
    function updateDoctor(uint _id, string memory _name, uint _age, string memory _department) public onlyAdmin {
        // Update the doctor's information in the mapping
        doctors[_id] = Doctor(_name, _department, _age);
    }
}