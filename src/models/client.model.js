import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Client extends Model { }

Client.init({

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  nif: {
    type: DataTypes.STRING(25)
    // unique: true
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [5, 15],
        msg: 'Client.phone must be 5 or more numbers'
      }
    }
  }

}, {
  tableName: 'client',
  sequelize: dbInstance
})
