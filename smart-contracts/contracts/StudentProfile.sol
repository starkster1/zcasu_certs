// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentProfile {
    // Struct to hold student profile data
    struct Profile {
        string name;
        string email;
        string studentNumber;
        string profilePicHash; // IPFS hash of the profile picture
    }

    // Mapping of Ethereum address to Profile
    mapping(address => Profile) private profiles;

    // Event to emit when a new profile is created
    event ProfileCreated(address indexed studentAddress, string name, string email, string studentNumber, string profilePicHash);

    // Event to emit when a profile is updated
    event ProfileUpdated(address indexed studentAddress, string name, string email, string studentNumber, string profilePicHash);

    // Modifier to check if the caller has a profile
    modifier onlyIfProfileExists() {
        require(bytes(profiles[msg.sender].email).length > 0, "Profile does not exist");
        _;
    }

    // Function to create a new profile
    function createProfile(string memory _name, string memory _email, string memory _studentNumber, string memory _profilePicHash) public {
        require(bytes(profiles[msg.sender].email).length == 0, "Profile already exists");
        profiles[msg.sender] = Profile(_name, _email, _studentNumber, _profilePicHash);
        emit ProfileCreated(msg.sender, _name, _email, _studentNumber, _profilePicHash);
    }

    // Function to update an existing profile
    function updateProfile(string memory _name, string memory _email, string memory _studentNumber, string memory _profilePicHash) public onlyIfProfileExists {
        profiles[msg.sender] = Profile(_name, _email, _studentNumber, _profilePicHash);
        emit ProfileUpdated(msg.sender, _name, _email, _studentNumber, _profilePicHash);
    }

    // Function to get the profile of the caller
    function getProfile() public view returns (string memory, string memory, string memory, string memory) {
        Profile memory profile = profiles[msg.sender];
        return (profile.name, profile.email, profile.studentNumber, profile.profilePicHash);
    }
}
