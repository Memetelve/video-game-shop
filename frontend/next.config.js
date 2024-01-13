/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['discordapp.com', 'cdn.discordapp.com', 'cdn.discord.com', "dicebear.com", "api.dicebear.com"],
    },
    env: {
        API_URL: process.env.API_URL,
    },
}

module.exports = nextConfig
