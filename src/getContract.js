import { ethers, BigNumber } from "ethers";
import abi from "./abi.json"
const contractAddress = "0xc43a10e6613b2e4c09364cd775245625d892ee13";

export const getEthereumContract = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, abi, signer);
    return transactionContract;
    // const test = await transactionContract.interface.;
    

}