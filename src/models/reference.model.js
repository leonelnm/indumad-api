import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Reference extends Model { }

Reference.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(30),
    unique: {
      msg: 'Reference.name duplicate'
    },
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    validate: {
      isIn: {
        args: [[true, false]],
        msg: 'Reference.status Allowed values: [true, false]'
      }
    }
  }

}, {
  sequelize: dbInstance,
  timestamps: false,
  tableName: 'reference'
})
