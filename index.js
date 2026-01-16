import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import Companion from '@uppy/companion'

const app = express()

// 1. Middlewares Obrigatórios
app.use(cors({
  origin: true, // No teste aceita tudo, depois deves pôr o domínio do teu site
  credentials: true
}))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.COMPANION_SECRET || 'chave-muito-segura',
  resave: true,
  saveUninitialized: true
}))

const companionOptions = {
  providerOptions: {
    drive: {
      key: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    },
    // Se quiseres o OneDrive que estávamos a configurar:
    onedrive: {
      key: process.env.ONEDRIVE_CLIENT_ID,
      secret: process.env.ONEDRIVE_CLIENT_SECRET
    }
  },
  server: {
    host: process.env.RAILWAY_STATIC_URL || process.env.HOST, // Railway dá-te este URL
    protocol: 'https'
  },
  filePath: '/tmp',
  secret: process.env.COMPANION_SECRET || 'chave-muito-segura',
  debug: true,
  metrics: false // Desativa métricas para poupar RAM no Railway
}

const { app: companionApp } = Companion.app(companionOptions)
app.use(companionApp)

// Rota de teste para ver se o servidor está vivo
app.get('/', (req, res) => {
  res.send('Companion está a funcionar!')
})

const port = process.env.PORT || 3020
app.listen(port, '0.0.0.0', () => { // Importante ouvir em 0.0.0.0 no Railway
  console.log(`Uppy Companion running on port ${port}`)
})
