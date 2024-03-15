const ROLES_LIST = {
  Admin: 5150,
  Staff: 1984,
  RegisteredUser: 2001,
  Public: 0,
};

const getRoleName = (roleValue) => {
  return Object.keys(ROLES_LIST).find((key) => ROLES_LIST[key] == roleValue);
};

const getRoleValue = (roleName) => {
  return ROLES_LIST[roleName];
};

export { getRoleName, getRoleValue };

export default ROLES_LIST;
