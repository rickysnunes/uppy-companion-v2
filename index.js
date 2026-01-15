import express from 'express'
import { app as companionApp } from '@uppy/companion'

const app = express()

// Configura o Companion
app.use(
  companionApp({
    providerOptions: {
      drive: {
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      }
    },
    server: {
      host: process.env.HOST || 'localhost:3020',
      protocol: 'https'
    },
    uploadUrls: ['*'], // ok para testar
    filePath: '/tmp', // Railway não permite escrever em ./uploads
    secret: process.env.COMPANION_SECRET || 'uma-senha-secreta'
  })
)

const port = process.env.PORT || 3020
app.listen(port, () => {
  console.log(`Uppy Companion running on port ${port}`)
})
