import { useState } from 'react'
import Web3Modal from 'web3modal'
import web3 from 'web3'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {
  nftmarketaddress, nftaddress, nftabi, nftmarketabi
} from '../config'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export default function Home() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const [fileType, setFileType] = useState('')
  const router = useRouter()

  async function createSale(url) {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, nftabi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = web3.utils.toWei(formInput.price, 'ether')

    const listingPrice = web3.utils.toWei('0.1', 'ether')

    contract = new ethers.Contract(nftmarketaddress, nftmarketabi, signer)
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })

    await transaction.wait()
    router.push('/')
  }
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      setFileType(file.type)
    } catch (error) {
      console.log('错误的文件: ', error);
    }
  }
  async function createMarket() {
    const realType = fileType.indexOf('image') != -1 ? 'image' : 'video'
    console.log(realType);
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    // first, upload to IPFS
    const data = JSON.stringify({
      name, description, image: fileUrl, type: realType
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col mt-8 rounded p-4">
        <div>
          <span>名称 </span>
          <input
            placeholder=""
            className="border-b"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
        </div>
        <div className="my-5">
          <span>描述 </span>
          <input
            placeholder=""
            className="border-b"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
        </div>
        <div className="">
          <span>价格 </span>
          <input
            placeholder=""
            className="border-b"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
        </div>
        <div>
          <input
            type="file"
            name="NFT"
            className="my-4"
            onChange={onChange}
          />
          {fileUrl && fileType.indexOf('image') == -1 ? (<video width={260} autoPlay loop src={fileUrl} />) : (<img style={{ width: 230, height: 260 }} className="rounded mt-4" src={fileUrl}></img>)}
          {/* {
            fileUrl && (
              <img style={{ width: 230, height: 260 }} className="rounded mt-4" src={fileUrl}></img>
              <video width={260} autoPlay loop src={fileUrl} />
            )
          } */}
        </div>
        <button onClick={createMarket} className="mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">创建NFT</button>
      </div>
    </div>
  )
}