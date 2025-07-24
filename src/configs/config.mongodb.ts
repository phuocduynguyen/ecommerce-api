const dev = {
  app: {
    port: process.env.PORT || 3000
  }
}

const prod = {
  app: {
    port: process.env.PORT || 3000
  }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'
export default config[env as keyof typeof config]
