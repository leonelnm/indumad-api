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
