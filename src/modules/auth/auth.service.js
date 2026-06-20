import APIError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

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

const login = async ({ email, password }) => {
  // fetch User from DB
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw APIError.unauthorized("User not found!");
  }

  // Verify password is correct

  //
  if (!user.isVerified) {
    throw APIError.forbidden("Please verify your email before login");
  }

  const accessToken = generateAccessToken({
    id: user._id,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false }); // don't check before save because no need to verify

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

export { registerService };
