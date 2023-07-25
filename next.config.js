/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@juspay-tech/hyper-js', '@juspay-tech/react-hyper-js'],
  async rewrites() {
    return [
      {
        source: '/create-payment',
        destination: 'http://localhost:4242/create-payment' // Proxy to Backend
      }
    ]
  },
}

module.exports = nextConfig
