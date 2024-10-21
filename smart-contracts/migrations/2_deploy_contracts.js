// migrations/2_deploy_contracts.js

const ZCASUCertificate = artifacts.require("ZCASUCertificate");
const MultiSigWallet = artifacts.require("MultiSigWallet");
const StudentProfile = artifacts.require("StudentProfile");  // Add the new contract

module.exports = function(deployer, network, accounts) {
  // Deploy the ZCASUCertificate contract
  deployer.deploy(ZCASUCertificate);
  
  // Deploy the MultiSigWallet contract with example owners: student and institute
  deployer.deploy(MultiSigWallet, accounts[0], accounts[1]);

  // Deploy the StudentProfile contract
  deployer.deploy(StudentProfile);
};
