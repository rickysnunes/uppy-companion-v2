import express from 'express'
import { app as companionApp } from '@uppy/companion'

const app = express()

app.use(
  companionApp({
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

    uploadUrls: ['*'], // ok para agora

    filePath: '/tmp',
    secret: process.env.COMPANION_SECRET
  })
)

const port = process.env.PORT || 3020
app.listen(port, () => {
  console.log(`Uppy Companion running on port ${port}`)
})
