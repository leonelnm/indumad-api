export const equals = (obj1 = {}, obj2 = {}) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// from: https://www.30secondsofcode.org/js/s/equals
export const equalsDeep = (a, b) => {
  if (a === b) return true

  if (a instanceof Date && b instanceof Date) { return a.getTime() === b.getTime() }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) { return a === b }

  if (a.prototype !== b.prototype) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  return keys.every(k => equalsDeep(a[k], b[k]))
}

export const compareUser = (userDB = {}, userFromRequest = {}) => {
  let changes = false
  const fields = ['username', 'name', 'lastname', 'phone', 'dni']

  fields.forEach(field => {
    if (compareValue(userDB, userFromRequest, field)) {
      userDB[field] = userFromRequest[field]
      changes = true
    }
  })

  return { changes, userDB }
}

export const compareJob = (jobDB = {}, jobFromRequest = {}) => {
  let changes = false
  const keys = ['extReference', 'incidentInfo', 'iva', 'priority', 'state']
  const fields = []

  keys.forEach(key => {
    if (compareValue(jobDB, jobFromRequest, key)) {
      jobDB[key] = jobFromRequest[key]
      changes = true
      fields.push(key)
    }
  })

  return { changes, jobDB, fields }
}

export const compare = (objectDB = {}, objectFromRequest = {}) => {
  let changes = false
  const keys = Object.keys(objectFromRequest)

  keys.forEach(key => {
    if (compareValue(objectDB, objectFromRequest, key)) {
      objectDB[key] = objectFromRequest[key]
      changes = true
    }
  })

  return { changes, objectDB }
}

const compareValue = (obj1 = {}, updatedObj = {}, tag = '') => {
  return Object.prototype.hasOwnProperty.call(updatedObj, tag) && updatedObj[tag] !== obj1[tag]
}
