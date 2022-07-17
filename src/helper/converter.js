export const toNewUser = (userFromRequest) => {
  const newUser = {
    username: userFromRequest.username,
    password: userFromRequest.password,
    name: userFromRequest.name,
    lastname: userFromRequest.lastname,
    dni: userFromRequest.dni,
    phone: userFromRequest.phone,
    roles: userFromRequest.roles,
    active: true
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
  updatePassword.password = dataFromRequest.password
  updatePassword.newpassword = dataFromRequest.newpassword
  return updatePassword
}
