// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZCASUCertificate {
    struct Certificate {
        string ipfsHash;
        address student;
        address institute;
        uint256 timestamp;
        bool isValid;
    }

    mapping(address => Certificate[]) public studentCertificates; // Maps each student to their certificates
    mapping(string => bool) public usedHashes; // Tracks used certificate IPFS hashes
    mapping(string => Certificate) private certificatesByHash; // Maps IPFS hash to certificate details
    mapping(address => bool) public isRegisteredStudent; // Tracks registered students

    address public institute; // Institute address is set as the deployer

    event CertificateIssued(
        address indexed student,
        address indexed institute,
        string ipfsHash,
        uint256 timestamp
    );

    event CertificateVerified(
        address indexed student,
        string ipfsHash,
        bool isValid
    );

    event CertificateRevoked(
        address indexed student,
        string ipfsHash
    );

    constructor() {
        institute = msg.sender; // Set the contract deployer as the institute
    }

    modifier onlyInstitute() {
        require(msg.sender == institute, "Only the institute can call this function");
        _;
    }

    modifier onlyUnregisteredStudent() {
        require(!isRegisteredStudent[msg.sender], "You are already registered as a student");
        _;
    }

    function registerAsStudent() external onlyUnregisteredStudent {
        isRegisteredStudent[msg.sender] = true;
    }

    function issueCertificate(string memory _ipfsHash) external onlyInstitute {
        require(!usedHashes[_ipfsHash], "Certificate hash already exists");

        Certificate memory newCertificate = Certificate({
            ipfsHash: _ipfsHash,
            student: msg.sender,
            institute: institute,
            timestamp: block.timestamp,
            isValid: true
        });

        studentCertificates[msg.sender].push(newCertificate);
        certificatesByHash[_ipfsHash] = newCertificate;
        usedHashes[_ipfsHash] = true;

        emit CertificateIssued(msg.sender, institute, _ipfsHash, block.timestamp);
    }

    // Verifies the certificate by IPFS hash and sets its validity status
    function verifyCertificate(string memory _ipfsHash, bool _isValid) external onlyInstitute {
        Certificate storage certificate = certificatesByHash[_ipfsHash];
        require(certificate.student != address(0), "Certificate not found");

        certificate.isValid = _isValid; // Update the validity status
        emit CertificateVerified(certificate.student, _ipfsHash, _isValid); // Emit event
    }


    function revokeCertificate(string memory _ipfsHash) external onlyInstitute {
        Certificate storage certificate = certificatesByHash[_ipfsHash];
        require(certificate.student != address(0), "Certificate not found");

        certificate.isValid = false;
        emit CertificateRevoked(certificate.student, _ipfsHash);
    }


    function getCertificates(address _student) external view returns (Certificate[] memory) {
        return studentCertificates[_student];
    }

    function getCertificateDetails(string memory _ipfsHash) external view returns (Certificate memory) {
        Certificate storage certificate = certificatesByHash[_ipfsHash];
        require(certificate.student != address(0), "Certificate not found");
        return certificate;
    }
}
