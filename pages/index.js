import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Fortmatic from "fortmatic";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal"
import web3 from 'web3'
import axios from 'axios'

import { nftmarketaddress, nftaddress, nftabi, nftmarketabi } from '../config'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  const [Address, setAddress] = useState()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const providerOptions = {
      fortmatic: {
        package: Fortmatic,
        options: {
          // Mikko's TESTNET api key
          key: "pk_test_391E26A3B43A3350"
        }
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "2457d7b074194e61a49947a293acf117" // required
        }
      }
    };
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      disableInjectedProvider: false,
      providerOptions: providerOptions, // required
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const tokenContract = new ethers.Contract(nftaddress, nftabi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, nftmarketabi, provider)
    console.log(tokenContract);
    console.log(marketContract);
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = web3.utils.fromWei(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        type: meta.data.type
      }
      return item
    }))
    console.log('items:', items);
    setNfts(items)
    setLoaded('loaded')
    setAddress(connection.selectedAddress)
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, nftmarketabi, signer)
    
    const price = web3.utils.toWei(nft.price.toString(), 'ether')
    console.log('price: ', price);
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId,{value: price})
    await transaction.wait()
    loadNFTs()
  }


  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">??????NFTs!</h1>)
  return (
    <div className="flex justify-center items-center flex-col">
      <button onClick={loadNFTs} className="bg-blue-500 text-white rounded p-4 shadow-lg" disabled={Address && Address}>{Address && Address ? Address : '????????????'}</button>
      <div style={{ width: 1000 }} className="flex justify-between flex-wrap">
        {
          nfts.map((nft, i) => (
            <div key={i} className="border rounded-2xl flex justify-center items-center flex-col" style={{ width: 260, height: 340, marginTop: 20 }}>
              {
                nft.type === 'image' ? (<img src={nft.image} className="rounded-xl" style={{ width: '220px', height: '220px' }} />) : nft.type === 'video' ? (<video autoPlay loop className="rounded-xl" width={220} src={nft.image} />) : !nft.type ? (<img src={nft.image} className="rounded-xl" style={{ width: '220px', height: '220px' }} />) : (<img src={nft.image} className="rounded-xl" style={{ width: '220px', height: '220px' }} />)
              }
              <p>{nft.name}</p>
              <p>{nft.description}</p>
              <p className="flex items-center"><img width="10" src="/eth.svg" alt="eth" />&nbsp;{nft.price}</p>
              <button onClick={() => buyNft(nft)} className="bg-blue-500 text-white rounded p-1 shadow-lg w-28">??????</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
