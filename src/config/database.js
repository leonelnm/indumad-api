import Sequelize from 'sequelize'
import config from './config.js'

export const dbInstance = new Sequelize(config.dbConnection)
