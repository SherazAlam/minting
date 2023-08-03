import { useEffect, useState } from "react";
import "./App.css"
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// import { ethers, BigNumber } from "ethers";
// import abi from "./abi.json"
import ViewNFT from "./ViewNFT";
import { getEthereumContract } from "./getContract";
import CurrentNft from "./CurrentNft";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYzE2ODVjMy02OGYyLTQxMTQtOWM0ZC00YmQ3NDY1NWE5MWYiLCJlbWFpbCI6InNoZXJhenJhanBvb3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3Nzc0ZGNhZjkzZjQ5N2YxMmQ1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZGJjMTI4MzI5YmVhMTYzY2ZiODI1NjQzYzM1ZDg1YjQyMjI2ZGJmMDdmNThiY2JlNzEyMzQ2NWIzYjVhN2VlZCIsImlhdCI6MTY5MDgwMjk3N30.U_X1Sfif3j38qCv7P6yFXc9n4v220_GpY_hKTzyT9hE`
// const contractAddress = "0x43e909c7fa904e68bb7ad0670000470d32cbaeea";
// const contractAddress = "0xc43a10e6613b2e4c09364cd775245625d892ee13";
function App() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { ethereum } = window;
    if (!ethereum) {
      return alert("Please insall metamask");
    }
    else {

      const formData = new FormData();

      formData.append('file', image)

      const metadata = JSON.stringify({
        name: image.name,
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', options);

      try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT
          }
        });
        console.log(res.data);
        const myJson = {
          name,
          description,
          image_url: "https://ipfs.io/ipfs/" + res.data.IpfsHash
        }
        // const data = JSON.stringify(myJson);

        // JSON
        var data = JSON.stringify({
          "pinataOptions": {
            "cidVersion": 1
          },
          "pinataMetadata": {
            "name": "testing",
            "keyvalues": {
              "customKey": "customValue",
              "customKey2": "customValue2"
            }
          },
          "pinataContent": {
            ...myJson
          }
        });

        var config = {
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': JWT
          },
          data: data
        };

        const resj = await axios(config);
        console.log(resj.data);
        const jsonUrl = "https://gateway.pinata.cloud/ipfs/" + resj.data.IpfsHash;
        // const jsonUrl = "";
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        setCurrentAccount(accounts[0]);
        const transactionContract = await getEthereumContract(jsonUrl);
        try {
          const ress = await transactionContract.mint(jsonUrl, { value: "10000000000000000" })
          // const ress = await transactionContract.mintedWallet("0x262F79C44a6E6bccceF2Fe8db65f9890d211690B")
          // const ress = await transactionContract.toggleIsMintEnable();
          console.log(Number(ress));
        }
        catch (err) {
          console.log(err);
        }

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }




  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <div className="uploadedImg">
              <img src={image ? URL.createObjectURL(image) : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"} alt="nft-img" />
            </div>
            <form onSubmit={handleSubmit}>
              <h1>OctaMint</h1>
              <label className="imageLabel" htmlFor="image">{image?.name ? image.name : "Add Image"}</label>
              <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} />
              <label>Name</label>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <label>Description</label>
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="submit">{loading ? "Mint..." : "Mint"}</button>
            </form>
          </div>
        } />
        <Route path="/view" element={<ViewNFT />} />
        <Route path="/currentusernft" element={<CurrentNft />} />
      </Routes>
    </Router>

  );
}

export default App;
