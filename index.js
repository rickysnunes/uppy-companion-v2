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
// Log de debug unificado
console.log('Chave Transloadit carregada:', (process.env.TRANSLOADIT_KEY || process.env.COMPANION_TRANSLOADIT_KEY) ? 'Sim' : 'Não');

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
  transloadit: {
    key: process.env.TRANSLOADIT_KEY || process.env.COMPANION_TRANSLOADIT_KEY,
    secret: process.env.TRANSLOADIT_SECRET || process.env.COMPANION_TRANSLOADIT_SECRET,
    use_stream: true, 
    always_run: true 
  },
  tus: { enabled: false },

  // --- CONFIGURAÇÃO DE ALTA VELOCIDADE ---
  streamingUpload: true,
  sendSelfHosted: true,
  // Aumentamos o chunkSize para 10MB para evitar o estrangulamento de pacotes
  chunkSize: 10485760, 
  // Permitir explicitamente o tráfego de saída para a Transloadit
  uploadUrls: [
    /^https:\/\/.*\.transloadit\.com$/ 
  ],
  // ---------------------------------------

  server: {
    host: process.env.HOST || 'uppy-companion-v2-production.up.railway.app',
    protocol: 'https'
  },
  filePath: '/tmp',
  secret: process.env.COMPANION_SECRET || '600Dadosnaminhamao',
  debug: true
}

const { app: companionApp } = companion.app(companionOptions)
app.use(companionApp)

app.get('/', (req, res) => {
  res.send('Companion Online!')
})

const port = process.env.PORT || 3020
app.listen(port, '0.0.0.0', () => {
  console.log(`Uppy Companion a correr na porta ${port}`)
})
