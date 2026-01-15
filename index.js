import express from 'express'
import Companion from '@uppy/companion'

const app = express()

// Configura o Companion
const companionOptions = {
  providerOptions: {
    drive: {
      key: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  server: {
    host: process.env.HOST,
    protocol: 'https'
  },
  uploadUrls: ['*'], // só para testar
  filePath: '/tmp', // Railway só permite escrever em /tmp
  secret: process.env.COMPANION_SECRET
}

// O Companion retorna um app válido para usar como middleware
const companionApp = Companion.app(companionOptions)
app.use(companionApp)

const port = process.env.PORT || 3020
app.listen(port, () => {
  console.log(`Uppy Companion running on port ${port}`)
})
