// frontend/src/utils/contract.js
import web3 from "./web3";
import ZCASCertificateABI from "./abi/ZCASCertificate.json";
import MultiSigWalletABI from "./abi/MultiSigWallet.json";

const ZCASCertificateAddress = process.env.REACT_APP_CONTRACT_ADDRESS_ZCASCertificate;
const MultiSigWalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS_MultiSigWallet;

const ZCASCertificateContract = new web3.eth.Contract(ZCASCertificateABI, ZCASCertificateAddress);
const MultiSigWalletContract = new web3.eth.Contract(MultiSigWalletABI, MultiSigWalletAddress);

export { ZCASCertificateContract, MultiSigWalletContract };
