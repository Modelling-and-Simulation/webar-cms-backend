import ROLES_LIST from "../../config/roles_list.js";

const makeStaffUser = (req, res, next) => {
  req.body.role = ROLES_LIST.Staff;

  // generate a random password
  // const randomPassword = Math.random().toString(36).slice(-8);
  const randomPassword = 'asdf'

  req.body.password = randomPassword;

  next();
};

export default makeStaffUser;
