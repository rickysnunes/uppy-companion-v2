import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import companion from '@uppy/companion'

const app = express()

// 1. Configurações de Middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.COMPANION_SECRET || '600Dadosnaminhamao',
  resave: true,
  saveUninitialized: true
}))

// 2. Opções do Companion

// Adiciona este log logo acima das companionOptions para debug
console.log('Chave Transloadit carregada:', process.env.COMPANION_TRANSLOADIT_KEY ? 'Sim' : 'Não');

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
  // ADICIONA ESTE BLOCO AQUI:
  transloadit: {
    key: process.env.COMPANION_TRANSLOADIT_KEY,
    secret: process.env.COMPANION_TRANSLOADIT_SECRET,
  },
  server: {
    host: process.env.HOST || 'uppy-companion-v2-production.up.railway.app',
    protocol: 'https'
  },
  uploadUrls: [
    'https://api2.transloadit.com',
    'https://api2-eu-west-1.transloadit.com',
    'https://api2-us-east-1.transloadit.com',
    /^https:\/\/.*\.transloadit\.com$/ 
  ],
  filePath: '/tmp',
  secret: process.env.COMPANION_SECRET || '600Dadosnaminhamao',
  debug: true
}

// 3. Inicialização Corrigida para a Versão 4.x
// Na v4, usamos diretamente companion.app(options)
const { app: companionApp } = companion.app(companionOptions)
app.use(companionApp)

// Rota de Health Check
app.get('/', (req, res) => {
  res.send('Companion Online!')
})

const port = process.env.PORT || 3020
app.listen(port, '0.0.0.0', () => {
  console.log(`Uppy Companion a correr na porta ${port}`)
})
