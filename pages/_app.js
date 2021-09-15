import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col">
      <nav className="border-b px-12 py-6 flex flex-col items-center">
        <p className="text-4xl">NFT</p>
        <div className="flex mt-4 justify-center text-2xl">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              NFTs
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-4 text-blue-500">
              创建NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-4 text-blue-500">
              我的NFTSs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
