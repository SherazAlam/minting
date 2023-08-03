import React, { useEffect, useState } from 'react'
import "./viewnft.css";
import CardNFT from './CardNFT';
import { getEthereumContract } from './getContract';
import axios from 'axios';

const CurrentNft = () => {

    const [address, setAddress] = useState("");
    const [nftData, setNftData] = useState([]);
    const [nftDataAll, setNftDataAll] = useState([]);
    const [nftOwner, setNftOwner] = useState({});
    const [currentAccount, setCurrentAccount] = useState();
    let nftDatafetched = [];
    let owners = [];


    let currentData;

    const getNfts = async () => {
        const smartContract = await getEthereumContract();
        const totalMints = await smartContract.totalSupply();
        console.log(Number(totalMints));
        for (let i = 1; i <= Number(totalMints); i++) {
            const Mints = await smartContract.tokenURI(i);
            console.log(Mints);
            const json = await axios.get(Mints)
            console.log(json.data);
            nftDatafetched.push(json.data);
            const ownerFetched = await smartContract.ownerOf(i);
            owners.push({
                address: ownerFetched,
                tokenUri: i
            });
        }
        console.log("ok");
        console.log(nftDatafetched);
        setNftDataAll(nftDatafetched)
        console.log(owners);
        setNftOwner(owners);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setCurrentAccount(accounts[0]);
        console.log(accounts);
        console.log("nft owners")
        console.log(owners);
        const searchedData = owners.find((data) => (data.address.toLowerCase() == accounts[0].toLowerCase()));
        console.log(accounts[0])
        console.log(searchedData);
        if (searchedData != undefined){
            setNftData([nftDatafetched[(searchedData.tokenUri) - 1]]);
        }
        

    }
    useEffect(() => {

        return (() => {
            getNfts();
        })
    }, [])

    return (
        <div className='viewNFT'>
            <h1>View NFTs</h1>
            <div className="cardSection">
                {nftData && nftData.map((singeleData, index) => (
                    <CardNFT key={index} name={singeleData.name} description={singeleData.description} image={singeleData.image_url} />
                ))
                }
            </div>
            

        </div>
    )
}

export default CurrentNft;