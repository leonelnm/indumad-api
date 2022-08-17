import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Contact extends Model { }

Contact.init({

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: {
    type: DataTypes.STRING(80),
    allowNull: false
  },

  address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [5, 15],
        msg: 'Contact.phone must be 5 or more numbers'
      }
    }
  }

}, {
  tableName: 'contact',
  sequelize: dbInstance
})
