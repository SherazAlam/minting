import React, {useEffect, useState} from 'react'
import "./viewnft.css";
import CardNFT from './CardNFT';
import { data } from './tempData';
import Pagination from './Pagination';
import { getEthereumContract } from './getContract';
import axios from 'axios';

const ViewNFT = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(2);
    const [address, setAddress] = useState("");
    const [nftData, setNftData] = useState([]);
    const [nftDataAll, setNftDataAll] = useState([]);
    const [nftOwner, setNftOwner] = useState({});
    const [loading, setLoading] = useState(false);
    let nftDatafetched = [];
    let owners = [];

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage
    // const currentData = data.slice(firstPostIndex, lastPostIndex);

    

let currentData;
const handlePagination = ()=> {
    
    currentData = nftDataAll.slice(firstPostIndex, lastPostIndex);
    console.log(firstPostIndex);
    console.log(lastPostIndex);
    console.log(currentData);
    console.log(nftDataAll)
    setNftData(currentData);
}
    const handleSubmit = async () => {
        const searchedData = nftOwner.find((data)=>data.address == address);
        console.log(searchedData);
        setNftData([nftDataAll[(searchedData.tokenUri)-1]]);
        
    }

    const getNfts = async () => {
        setLoading(true);
        const smartContract = await getEthereumContract();
        console.log("tst", smartContract)
        const totalMints = await smartContract.totalSupply();
        console.log(Number(totalMints));
        for(let i = 1; i <=Number(totalMints); i++){
            const Mints = await smartContract.tokenURI(i);
            console.log(Mints);
            const json = await axios.get(Mints)
            console.log(json.data);
            nftDatafetched.push(json.data);
            const ownerFetched = await smartContract.ownerOf(i);
            owners.push({address: ownerFetched,
                            tokenUri: i});
        }
        console.log("ok");
        console.log(nftDatafetched);
        currentData = nftDatafetched.slice(firstPostIndex, lastPostIndex);
        setNftData(currentData)
        setNftDataAll(nftDatafetched)
        console.log(owners);
        setNftOwner(owners);
        setLoading(false);
        
    }
    useEffect(()=>{

       
            getNfts();
    
    }, [])

    useEffect(()=>{
        handlePagination();
    },[currentPage])

    return (
        <div className='viewNFT'>
            <h1>View All NFTs</h1>
            {loading? <h3 style={{textAlign: 'center', marginTop: "200px"}}>Loading NFTs...</h3> : <div className="cardSection">
                {nftData && nftData.map((singeleData, index)=>(
                    <CardNFT key={index} name={singeleData.name} description={singeleData.description} image={singeleData.image_url} />
                ))
                }
            </div> }
            
            <div className="pagination">
            <Pagination totalCards={nftDataAll.length} cardsPerPage={postsPerPage} setCurrentPage={setCurrentPage} handlePagination={handlePagination} ></Pagination>
            </div>
            
        </div>
    )
}

export default ViewNFT