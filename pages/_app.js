import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col">
      <nav className="border-b px-12 py-6">
        <p className="text-xl">NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              主页
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
