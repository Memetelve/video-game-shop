/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['discordapp.com', 'cdn.discordapp.com', 'cdn.discord.com', 'cdn.discord.com'],
    },
    env: {
        API_URL: process.env.API_URL,
    },
}

module.exports = nextConfig
