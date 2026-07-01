const { sendError } = require('../utils/apiResponse');

/**
 * Middleware factory to validate request body/params/query against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'params'|'query'} source - What part of the request to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }
    // Replace the source with the parsed (sanitized) data
    req[source] = result.data;
    next();
  };
};

module.exports = { validate };
