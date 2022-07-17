import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { dbInstance } from '../config/database.js'
import config from '../config/config.js'

export class User extends Model { }

User.init({

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  username: {
    type: DataTypes.STRING(50),
    unique: {
      msg: 'User.username duplicado'
    },
    allowNull: false,
    validate: {
      len: {
        args: [4, 50],
        msg: 'User.username Debe tener 5 o más caracteres'
      }
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },

  dni: {
    type: DataTypes.STRING(10),
    unique: {
      msg: 'User.dni duplicado'
    },
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      len: {
        args: [5, 15],
        msg: 'User.phone Debe tener 5 o más números'
      }
    }
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    validate: {
      isIn: {
        args: [[true, false]],
        msg: 'User.active Valores permitidos: [true, false]'
      }
    }
  }

}, {
  hooks: {
    beforeCreate: (user) => {
      user.password = bcrypt.hashSync(user.password, config.saltRound)
    },
    afterCreate: (user) => {
      delete user.dataValues.password
    }
  },
  tableName: 'user',
  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  },

  sequelize: dbInstance
})
