import APIError from "../utils/api-error";

const validate = (DTOClass) => {
  return (req, res, next) => {
    const { errors, values } = DTOClass.validate(req.body);

    if (errors) {
      throw APIError.badRequest(errors.join(", "));
    }

    req.body = values;

    next();
  };
};

export default validate;
