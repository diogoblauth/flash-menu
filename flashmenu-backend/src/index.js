import { app } from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`FlashMenu API rodando na porta ${PORT}`)
})
