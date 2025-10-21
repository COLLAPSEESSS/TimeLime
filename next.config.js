/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/server',
        destination: 'https://calypsoproject.gamestores.app/api/v1/widgets.monitoring'
      }
    ]
  }
}

module.exports = nextConfig
