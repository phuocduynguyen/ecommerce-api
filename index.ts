import app from './src/app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT} to access the application`)
})
