import APIError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
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

const loginService = async ({ email, password }) => {
  // fetch User from DB
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw APIError.unauthorized("User not found!");
  }

  // Verify password is correct
  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw APIError.unauthorized("Invalid email or password");
  }

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

const refresh = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw APIError.unauthorized("Refresh token not found");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id).select("+refreshToken"); // access id from decoded value
  if (!user) {
    throw APIError.unauthorized("User not found!");
  }

  if (user.refreshToken !== hashToken(token)) {
    throw APIError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    id: user._id,
  });

  const getRefreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = hashToken(getRefreshToken);
  await user.save({ validateBeforeSave: false }); // don't check before save because no need to verify

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const logout = async (userId) => {
  // Way 1
  // const user = await User.findById(userId); // access id from decoded value
  // if (!user) {
  //   throw APIError.unauthorized("User not found!");
  // }

  // user.refreshToken = undefined;
  // await user.save({ validateBeforeSave: true });

  // Way 2
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw APIError.unauthorized("User not found!");
  }

  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  //TODO: sent mail to user with raw token
};

const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw APIError.notFound("User not found!");

  return user;
};

const verifyEmail = async (token) => {
  const hashedToken = hashToken(token);
  const user = await User.findOne({ verificationToken: hashedToken }).select(
    "+verificationToken",
  );

  // throw error if user not found
  if (!user) {
    throw APIError.notFound("User not found");
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();
  return user;
};

// TODO: Reset password
const resetPassword = async (token) => {};

export {
  registerService,
  loginService,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

//TODO: After register user, create service for verify token - for that sent email with hash token and also save this token in DB
// and whenever compare both this token then update "isVerify" status in DB

//TODO: Same as forgot password, and reset password with token
