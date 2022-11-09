import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Schedule extends Model { }

Schedule.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING(100)
  },

  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },

  duration: {
    type: DataTypes.STRING(3),
    allowNull: false
  }

}, {
  sequelize: dbInstance,
  tableName: 'schedule',
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  defaultScope: {
    attributes: {
      exclude: ['JobId', 'UserId']
    }
  },
  hooks: {
    afterCreate: (user) => {
      delete user.dataValues.JobId
      delete user.dataValues.UserId
    }
  }
})
