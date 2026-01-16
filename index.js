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
    // Força o envio direto para a Transloadit sem usar protocolos intermédios lentos
    use_stream: true, 
    always_run: true 
  },
  // Desativar o Tus é vital no Railway para evitar a queda de velocidade
  tus: {
    enabled: false
  },
  server: {
    host: process.env.HOST || 'uppy-companion-v2-production.up.railway.app',
    protocol: 'https'
  },
  uploadUrls: [
    'https://api2.transloadit.com',
    /^https:\/\/.*\.transloadit\.com$/ 
  ],

  // --- CONFIGURAÇÕES DE PERFORMANCE (ANTI-QUEDA DE VELOCIDADE) ---
  streamingUpload: true, // Não guarda no disco, usa a RAM para passar o ficheiro
  sendSelfHosted: true,  // Autoriza o envio direto do Railway para a Transloadit
  filePath: '/tmp',
  chunkSize: 10485760,   // 10MB por pedaço (ajuda a manter o fluxo constante)
  
  // Impede que o servidor interrompa a ligação por inatividade
  serverRuntimeConfig: {
    bodyLimit: '100mb' 
  },
  // -------------------------------------------------------------

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
