import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class RegisterDTO extends BaseDTO {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required().pattern(emailRegex),
    password: Joi.string()
      .min(8)
      .required()
      .message("Password must contain 8 chars minimum"),
    name: Joi.string().valid("customer", "seller").default("customer"), // valid - for checking enum value with defaul value
  });
}

export default RegisterDTO;
