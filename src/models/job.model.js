import { Model, DataTypes } from 'sequelize'
import { dbInstance } from '../config/database.js'
import { JobStateType, JobStateTypeAsList } from '../types/jobStateEnumType.js'
import { PriorityType, PriorityTypeAsList } from '../types/levelEnumType.js'
import { Client } from './client.model.js'
import { Contact } from './contact.model.js'
import { Guild } from './guild.model.js'
import { Reference } from './reference.model.js'
import { User } from './user.model.js'

export class Job extends Model { }

Job.init({

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  extReference: {
    type: DataTypes.STRING(50)
  },

  priority: {
    type: DataTypes.ENUM(PriorityTypeAsList),
    defaultValue: PriorityType.NORMAL,
    allowNull: false
  },

  state: {
    type: DataTypes.ENUM(JobStateTypeAsList),
    defaultValue: JobStateType.INITIAL,
    allowNull: false
  },

  incidentInfo: {
    type: DataTypes.STRING(4000)
  },

  // Presupuesto sin IVA
  budgetProposal: {
    type: DataTypes.STRING(15)
  },

  budgetAccepted: {
    type: DataTypes.BOOLEAN,
    // defaultValue: false,
    // allowNull: false,
    validate: {
      isIn: {
        args: [[true, false]],
        msg: 'Job.budgetAccepted Allow values: [true, false]'
      }
    }
  },

  iva: {
    type: DataTypes.SMALLINT,
    defaultValue: 21,
    allowNull: false
  },

  // Presupuesto + IVA
  budgetFinal: {
    type: DataTypes.STRING(15)
  },

  // Precio sin IVA
  price: {
    type: DataTypes.STRING(15)
  },

  // Precio + IVA
  finalPrice: {
    type: DataTypes.STRING(15)
  },

  closedAt: {
    type: DataTypes.DATE
  }

}, {
  tableName: 'job',
  sequelize: dbInstance,
  defaultScope: {
    attributes: {
      exclude: [
        'ContactId', 'contactId',
        'ClientId', 'clientId',
        'UserId', 'employeeId',
        'ReferenceId', 'referenceId',
        'GuildId', 'guildId'
        // 'InvoiceId', 'invoiceId'
      ]
    },
    include: [
      { model: Client, as: 'client' },
      { model: Contact, as: 'contact' },
      { model: User, as: 'employee' },
      { model: Guild, as: 'guild' },
      { model: Reference, as: 'reference' }
    ]
  },
  scopes: {
    billing: {
      attributes: {
        exclude: [
          'ContactId', 'contactId',
          'ClientId', 'clientId',
          'UserId', 'employeeId',
          'ReferenceId', 'referenceId',
          'GuildId', 'guildId'
        ]
      }
    }
  }
})
