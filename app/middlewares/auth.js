const jwt = require("jsonwebtoken");
const db = require("../models");

module.exports = {
  auth: ({ isTokenRequired = true, usersAllowed = [] } = {}) => {
    return async (req, res, next) => {
      const token = req.header("x-auth-token");

      if (isTokenRequired && !token) {
        return res.status(401).json({ success: false, message: "Token required" });
      }

      if (!isTokenRequired && !token) return next();

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(decoded, "-------------1");
        const user = await db.users.findOne({where:{id:decoded.userId}});
        console.log(user,'-------------');

        if (!user) {
          return res.status(401).json({ success: false, message: "Invalid token" });
        }

        req.user = user;

        if (usersAllowed.length) {
          if (usersAllowed.includes("*")) return next();
          if (usersAllowed.includes(user.role)) return next();

          return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        return next();
      } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }
    };
  },
};
