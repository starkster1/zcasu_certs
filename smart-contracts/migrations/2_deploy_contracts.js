const ZCASUCertificate = artifacts.require("ZCASUCertificate");

module.exports = async function (deployer, network, accounts) {
    // Deploy the contract
    await deployer.deploy(ZCASUCertificate);
    const certificateInstance = await ZCASUCertificate.deployed();

    // Log the deployed contract address
    console.log("ZCASUCertificate contract deployed at:", certificateInstance.address);

    // Log the institute address (the account used for deployment)
    const instituteAddress = accounts[0];
    console.log("Institute (deployer) address:", instituteAddress);
};
