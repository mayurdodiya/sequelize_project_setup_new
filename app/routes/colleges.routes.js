const controller = require("../controller/colleges/colleges.controller.js");
const validation = require("../validation/collegesValidation.js");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  app.post("/api/collage", validation.addCollege, controller.add);
  app.put("/api/collage/:id", validation.updateCollege, controller.updateById);
  app.delete("/api/collage/:id", controller.deleteById);
  app.get("/api/collage", controller.viewAll); // use page, size, ans s(seraching) in query
  app.get("/api/collage/:id", controller.viewById);

};
