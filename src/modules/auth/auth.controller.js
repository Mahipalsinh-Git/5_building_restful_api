import APIResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

const register = async (req, res) => {
  const user = await authService.registerService(req.body);

  try {
    APIResponse.created(res, "Registration success", user);
  } catch (error) {}
};

export { register };
