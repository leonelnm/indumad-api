export const toNewUser = (userFromRequest) => {
  const newUser = {
    username: userFromRequest.username.toLowerCase(),
    password: userFromRequest.password,
    name: userFromRequest.name,
    lastname: userFromRequest.lastname,
    dni: userFromRequest.dni,
    phone: userFromRequest.phone,
    role: userFromRequest.role,
    active: true,
    guilds: userFromRequest.guilds
  }

  return newUser
}

export const toUserUpdate = (userFromRequest) => {
  const updateUser = {
    username: userFromRequest.username,
    name: userFromRequest.name,
    lastname: userFromRequest.lastname,
    phone: userFromRequest.phone
  }

  return updateUser
}

export const toPasswordUpdate = ({ idFromParams, dataFromRequest = {} }) => {
  const updatePassword = {}
  updatePassword.id = idFromParams
  updatePassword.newpassword = dataFromRequest.newpassword
  return updatePassword
}

export const userdbToFullForm = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    lastname: user.lastname,
    dni: user.dni,
    phone: user.phone,
    active: user.active,
    createdAt: user.createdAt,
    role: rolesToSimpleList(user.role),
    guilds: user.guilds
  }
}

export const userdbToSimpleForm = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    dni: user.dni,
    lastname: user.lastname,
    active: user.active,
    role: rolesToSimpleList(user.role),
    guilds: user.guilds
  }
}

export const userdbListToForm = (userList = []) => {
  if (!Array.isArray(userList) || userList.length === 0) return []
  return userList.map(userdbToSimpleForm)
}

export const rolesToSimpleList = (role = {}) => {
  return role ? role.name : ''
}

// Guild or Reference
export const toGuildOrReferencedUpdate = ({ dataFromRequest = {} }) => {
  const update = {}
  if (dataFromRequest?.name) {
    update.name = dataFromRequest.name.toUpperCase()
  }
  if ('status' in dataFromRequest) {
    update.status = dataFromRequest.status
  }

  return update
}
