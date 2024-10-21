// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZCASUCertificate {
    address public institute;  // Only one institute: ZCASU University
    mapping(address => bool) public students;
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public pendingApprovals;

    struct Certificate {
        address student;
        string ipfsHash;
        bool verified;
    }

    event CertificateIssued(address indexed student, bytes32 indexed certId);
    event CertificateVerified(bytes32 indexed certId, bool verified);

    constructor() {
        institute = msg.sender;  // ZCASU University is the owner
    }

    modifier onlyInstitute() {
        require(msg.sender == institute, "Only the institute can perform this action");
        _;
    }

    modifier onlyStudent(address _student) {
        require(students[_student], "Only registered students can perform this action");
        _;
    }

    function addStudent(address student) external onlyInstitute {
        require(!students[student], "Student already registered");
        students[student] = true;
    }

    function issueCertificate(address student, string memory ipfsHash) external onlyInstitute {
        require(students[student], "Student is not registered");
        bytes32 certId = keccak256(abi.encodePacked(student, ipfsHash, block.timestamp));
        certificates[certId] = Certificate(student, ipfsHash, false);
        emit CertificateIssued(student, certId);
    }

    function verifyCertificate(bytes32 certId) external onlyInstitute {
        Certificate storage cert = certificates[certId];
        require(cert.student != address(0), "Certificate does not exist");
        cert.verified = true;
        emit CertificateVerified(certId, true);
    }

    function requestApproval(address student) external onlyStudent(student) {
        pendingApprovals[student] = true;
    }

    function approveStudent(address student) external onlyInstitute {
        require(pendingApprovals[student], "No pending approval for this student");
        pendingApprovals[student] = false;
    }
}
