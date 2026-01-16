import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import { companion } from '@uppy/companion' // Mudança aqui na v4

const app = express()

app.use(cors({
  origin: true, 
  credentials: true
}))

app.use(bodyParser.json())

app.use(session({
  secret: process.env.COMPANION_SECRET || 'uma-chave-qualquer-123',
  resave: true,
  saveUninitialized: true
}))

const companionOptions = {
  providerOptions: {
    drive: {
      key: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    },
    onedrive: {
      key: process.env.ONEDRIVE_CLIENT_ID,
      secret: process.env.ONEDRIVE_CLIENT_SECRET
    }
  },
  server: {
    host: process.env.RAILWAY_STATIC_URL, // O Railway preenche isto sozinho
    protocol: 'https'
  },
  filePath: '/tmp',
  secret: process.env.COMPANION_SECRET || 'uma-chave-qualquer-123',
  debug: true
}

// Inicializa o companion
const { app: companionApp } = companion.instance(companionOptions)
app.use(companionApp)

app.get('/', (req, res) => {
  res.send('Companion Online!')
})

const port = process.env.PORT || 3020
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor a correr na porta ${port}`)
})
