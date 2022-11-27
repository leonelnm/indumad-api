import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'

export class Invoice extends Model { }

Invoice.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subtotal: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  iva: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  total: {
    type: DataTypes.STRING(15),
    allowNull: false
  },

  invoiceDate: {
    type: DataTypes.DATEONLY(),
    allowNull: false
  },

  amountJobs: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  sequelize: dbInstance,
  tableName: 'invoice',
  timestamps: true,
  createdAt: true,
  updatedAt: false
})
