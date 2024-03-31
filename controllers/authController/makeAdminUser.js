import ROLES_LIST from "../../config/roles_list.js";

const makeAdminUser = (req, res, next) => {
  req.body.role = ROLES_LIST.Admin;

  // generate a random password
  const randomPassword = Math.random().toString(36).slice(-8);

  req.body.password = randomPassword;

  next();
};

export default makeAdminUser;
