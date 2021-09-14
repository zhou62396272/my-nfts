import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import Fortmatic from "fortmatic";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal"
import web3 from 'web3'
import axios from 'axios'

import { nftmarketaddress, nftaddress, nftabi, nftmarketabi } from '../config'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
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
    const tokenContract = new ethers.Contract(provider, nftaddress, nftabi)
    const marketContract = new ethers.Contract(provider, nftmarketaddress, nftmarketabi)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = web3.utils.fromWei(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))
    console.log('items', items);
    setNfts(items)
    setLoaded('loaded')
  }


  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">暂无NFTs!</h1>)
  return (
    <div className="flex justify-center">
      <div style={{ width: 1000 }}>
        {
          nfts.map((nft, i) => {
            <div key={i} className="border rounded-2xl flex justify-center items-center flex-col" style={{ width: 260, height: 340, marginTop: 20 }}>
              <Image
                className="rounded-xl"
                src={nft.image}
                alt="Picture of the author"
                width={230}
                height={260}
              />
              <p>{nft.name}</p>
              <p>{nft.description}</p>
              <p>{nft.price}</p>
            </div>
          })
        }
      </div>
    </div>
  )
}
