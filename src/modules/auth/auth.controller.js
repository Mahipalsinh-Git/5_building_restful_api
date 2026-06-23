import APIResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

const register = async (req, res) => {
  const user = await authService.registerService(req.body);

  try {
    APIResponse.created(res, "Registration success", user);
  } catch (error) {}
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginService(
    req.body,
  );

  //   return { user: userObj, accessToken, refreshToken };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  try {
    APIResponse.ok(res, "Login success", {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {}
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  APIResponse.ok(res, "User profile", user);
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  APIResponse.ok("Logout success");
};

export { register, login, logout, getMe };
