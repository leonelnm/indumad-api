import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Note extends Model { }

Note.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.STRING(5000),
    allowNull: false
  },
  readByEmployee: {
    type: DataTypes.BOOLEAN(),
    defaultValue: false,
    allowNull: false
  },
  readByGestor: {
    type: DataTypes.BOOLEAN(),
    defaultValue: false,
    allowNull: false
  }

}, {
  sequelize: dbInstance,
  tableName: 'note',
  defaultScope: {
    attributes: {
      exclude: ['JobId', 'UserId']
    }
  }
})
