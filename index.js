import express from 'express'
import companion from '@uppy/companion'

const app = express()

app.use(
  companion.app({
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

    uploadUrls: ['*'], // ← TEMPORÁRIO, mas OK agora

    filePath: '/tmp',
    secret: process.env.COMPANION_SECRET
  })
)

const port = process.env.PORT || 3020
app.listen(port, () => {
  console.log(`Uppy Companion running on port ${port}`)
})
