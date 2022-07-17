import app from './app.js'
import config from './config/config.js'
import { dbInstance } from './config/database.js'
import './models/associations.js'

const port = config.port
app.listen(port, async () => {
  console.log(`Server running on port: ${port}`)

  try {
    await dbInstance.authenticate()
    console.log('Connection has been established successfully.')

    await dbInstance.sync({ force: false })
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
  }
})
