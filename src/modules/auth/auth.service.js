import APIError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const registerService = async ({ name, email, password, role }) => {
  // do user registration

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw APIError.conflict("User already exist!");
  }

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  // send email to user with token

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.refreshToken;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;

  return userObj;
};

export { registerService };
