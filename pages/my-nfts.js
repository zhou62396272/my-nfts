<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import web3 from 'web3'
import axios from 'axios'

import { nftmarketaddress, nftaddress, nftabi, nftmarketabi } from '../config'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  const [Address, setAddress] = useState()
=======
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress, nftabi, nftmarketabi
} from '../config'
export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
>>>>>>> 7b41deefae43e30b5c95e35d56b35e1fc2d6482a

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, nftmarketabi, signer)
    const tokenContract = new ethers.Contract(nftaddress, nftabi, provider)
    const data = await marketContract.fetchMyNFTs()

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
<<<<<<< HEAD
        type: meta.data.type
      }
      return item
    }))
    console.log('items:', items);
    setNfts(items)
    setLoaded('loaded')
    setAddress(connection.selectedAddress)
  }


  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">暂无NFTs!</h1>)
  return (
    <div className="flex justify-center items-center flex-col">
      <button onClick={loadNFTs} className="bg-blue-500 text-white rounded p-4 shadow-lg" disabled={Address && Address}>{Address && Address ? Address : '连接钱包'}</button>
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
            </div>
          ))
        }
=======
      }
      return item
    }))
    console.log('items: ', items)
    setNfts(items)
    setLoaded('loaded')
  }
  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">No NFTs!</h1>)
  return (
    <div className="flex justify-center">
      <div style={{ width: 900 }}>
        <div className="grid grid-cols-2 gap-4 pt-8">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border p-4 shadow">
                <img src={nft.image} className="rounded" />
                <p className="text-2xl my-4 font-bold">Price paid: {nft.price} Ether</p>
                <p className="text-2xl my-4 font-bold">Name: {nft.name}</p>
                <p className="text-2xl my-4 font-bold">Description: {nft.description}</p>
              </div>
            ))
          }
        </div>
>>>>>>> 7b41deefae43e30b5c95e35d56b35e1fc2d6482a
      </div>
    </div>
  )
}
