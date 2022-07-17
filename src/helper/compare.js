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
  if (userDB.username !== userFromRequest.username) {
    userDB.username = userFromRequest.username
    changes = true
  }

  if (userDB.name !== userFromRequest.name) {
    userDB.name = userFromRequest.name
    changes = true
  }

  if (userDB.lastname !== userFromRequest.lastname) {
    userDB.lastname = userFromRequest.lastname
    changes = true
  }

  if (userDB.phone !== userFromRequest.phone) {
    userDB.phone = userFromRequest.phone
    changes = true
  }

  return { changes, userDB }
}
