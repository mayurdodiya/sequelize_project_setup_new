module.exports = (app) => {
    const userRoutes = require("./users.routes");
//   const collegeRoutes = require("./colleges.routes");

  app.use("/api/users", userRoutes);
//   app.use("/api/colleges", collegeRoutes);
};
