import catchAsync from "../utils/catchAsync";

const zodValidationRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    // validation
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default zodValidationRequest;
