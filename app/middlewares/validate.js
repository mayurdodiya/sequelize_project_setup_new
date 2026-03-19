// module.exports = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.body.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         status: false,
//         message: error.details[0].message,
//       });
//     }

//     next();
//   };
// };


module.exports = (schema) => {
  return (req, res, next) => {
    const validations = [];

    if (schema.body) {
      validations.push(schema.body.validate(req.body));
    }

    if (schema.params) {
      validations.push(schema.params.validate(req.params));
    }

    if (schema.query) {
      validations.push(schema.query.validate(req.query));
    }

    for (const result of validations) {
      if (result.error) {
        return res.status(400).json({
          status: false,
          message: result.error.details[0].message,
        });
      }
    }

    next();
  };
};