import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import pkg from '@uppy/companion' // Importa o pacote inteiro como padrão

const { companion } = pkg // Extrai a funcionalidade daqui

const app = express()

// 1. Middlewares de segurança e sessão
app.use(cors({
  origin: true, 
  credentials: true
}))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.COMPANION_SECRET || 'chave-segura-123',
  resave: true,
  saveUninitialized: true
}))

// 2. Opções do Companion
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
        // Usa a tua variável HOST que definiste no Railway
        host: process.env.HOST || 'uppy-companion-v2-production.up.railway.app', 
        protocol: 'https'
      },
  filePath: '/tmp',
  secret: process.env.COMPANION_SECRET || 'chave-segura-123',
  debug: true
}

// 3. Inicialização correta para v4
const { app: companionApp } = companion.instance(companionOptions)
app.use(companionApp)

// Rota de Health Check para o Railway saber que está tudo bem
app.get('/', (req, res) => {
  res.send('Companion Online e Pronto!')
})

const port = process.env.PORT || 3020
app.listen(port, '0.0.0.0', () => {
  console.log(`Uppy Companion running on port ${port}`)
})
