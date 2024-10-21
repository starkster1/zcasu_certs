const Web3 = require('web3');
const StudentProfileABI = require('./contracts/StudentProfileABI.json');

// Choose between Infura or Ganache based on environment
const web3 = new Web3(
  process.env.INFURA_PROJECT_ID 
    ? `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`  // Use Infura if available
    : 'http://127.0.0.1:7545'  // Otherwise, fall back to local Ganache node
);

// Contract address of the deployed StudentProfile contract
const contractAddress = process.env.STUDENT_PROFILE_CONTRACT_ADDRESS || '0xYourGanacheContractAddress';
const studentProfileContract = new web3.eth.Contract(StudentProfileABI, contractAddress);

// Function to create a new student profile on the blockchain
async function createStudentProfile(firstName, lastName, email, studentNumber, ethereumAddress) {
  try {
    const fullName = `${firstName} ${lastName}`;
    
    // Interact with the smart contract's createProfile method
    await studentProfileContract.methods
      .createProfile(fullName, email, studentNumber, '')
      .send({
        from: ethereumAddress, 
        gas: 6721975,  // Specify the gas limit
        gasPrice: 20000000000  // Specify the gas price
      });

    console.log("Profile created on the blockchain");
    return true; // Return success status
  } catch (error) {
    console.error('Blockchain error:', error);
    return false; // Return failure status
  }
}

// Export the function to be used in other files
module.exports = { createStudentProfile };
