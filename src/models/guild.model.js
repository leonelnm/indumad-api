import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Guild extends Model { }

Guild.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(30),
    unique: {
      msg: 'Guild.name duplicate'
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
        msg: 'Guild.status Allowed values: [true, false]'
      }
    }
  }

}, {
  sequelize: dbInstance,
  timestamps: false,
  tableName: 'guild'
})
