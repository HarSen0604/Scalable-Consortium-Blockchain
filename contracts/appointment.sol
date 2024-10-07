// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title AppointmentContract
/// @dev A smart contract for managing appointments between patients and doctors
contract AppointmentContract {
    // Struct representing an Appointment
    struct Appointment {
        uint patientId; // Unique identifier for the patient
        uint doctorId; // Unique identifier for the doctor
        uint roomId; // Room ID where the appointment takes place
        string appointmentDate; // Date of the appointment in string format
    }

    // Mapping to store appointments by their unique appointment ID
    mapping(uint => Appointment) public appointments;

    // Mapping to store authorized addresses
    mapping(address => bool) public authorizedAddresses;

    // Address of the contract admin
    address public admin;

    // Event for access requests
    event AccessRequested(address requester);

    /// @dev Constructor that sets the admin to the account that deploys the contract
    constructor() {
        admin = msg.sender; // Set the deploying address as admin
        authorizedAddresses[admin] = true; // Authorize the admin
    }

    /// @dev Modifier to restrict access to admin-only functions
    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only admin can create or update appointments"
        );
        _;
    }

    /// @notice Create a new appointment
    /// @dev This function can only be called by the admin
    /// @param _appointmentId Unique ID for the appointment
    /// @param _patientId Unique ID of the patient
    /// @param _doctorId Unique ID of the doctor
    /// @param _roomId ID of the room for the appointment
    /// @param _appointmentDate Date of the appointment in string format
    function createAppointment(
        uint _appointmentId,
        uint _patientId,
        uint _doctorId,
        uint _roomId,
        string memory _appointmentDate
    ) public onlyAdmin {
        // Create and store the appointment in the mapping
        appointments[_appointmentId] = Appointment(
            _patientId,
            _doctorId,
            _roomId,
            _appointmentDate
        );
    }

    /// @notice Request access to the contract
    /// @dev Emits an event for access requests
    function requestAccess() public {
        emit AccessRequested(msg.sender);
        // Optionally, you can add logic to handle requests (e.g., notifying the admin)
    }

    /// @notice Get details of a specific appointment
    /// @dev Public function to retrieve appointment information
    /// @param _appointmentId Unique ID of the appointment
    /// @return patientId ID of the patient
    /// @return doctorId ID of the doctor
    /// @return roomId ID of the room
    /// @return appointmentDate Date of the appointment
    function getAppointment(
        uint _appointmentId
    ) public view returns (uint, uint, uint, string memory) {
        // Retrieve the appointment from the mapping
        Appointment memory appointment = appointments[_appointmentId];
        return (
            appointment.patientId,
            appointment.doctorId,
            appointment.roomId,
            appointment.appointmentDate
        );
    }

    /// @notice Authorize an address
    /// @dev This function can only be called by the admin
    /// @param _address Address to authorize
    function authorizeAddress(address _address) public onlyAdmin {
        authorizedAddresses[_address] = true;
    }

    /// @notice Revoke authorization from an address
    /// @dev This function can only be called by the admin
    /// @param _address Address to revoke authorization
    function revokeAddress(address _address) public onlyAdmin {
        authorizedAddresses[_address] = false;
    }
}