const db = require("../../models");
const message = require("../../services/message");
const { methods: commonServices } = require("../../services/common");
const Op = db.Sequelize.Op;

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.users.findOne({ where: { email, deletedAt: null } });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await commonServices.passwordCompare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = await commonServices.generateToken(user.id, user.role);

    user = user.toJSON();
    delete user.password;
    user.token = token;

    return res.status(200).json({ success: true, message: "Login successful", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// add
exports.register = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { name, email, password, phone, role, details } = req.body;

    const isExisting = await commonServices.get(db.users, { where: { email } });
    if (isExisting) {
      return res.status(400).json({
        success: false,
        message: message.DATA_EXIST("User"),
      });
    }

    const hashedPassword = await commonServices.generateHashPassword(password);

    const user = await db.users.create(
      {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
      { transaction: t },
    );

    if (details) {
      await db.userDetails.create(
        {
          ...details,
          userId: user.id,
        },
        { transaction: t },
      );
    }

    await t.commit();

    return res.status(201).json({ success: true, message: message.ADD_DATA("User") });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

// update by id
exports.updateById = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const id = req.params.id;
    const { name, email, phone, role, details } = req.body;

    const user = await db.users.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: message.NO_DATA("User") });
    }

    await db.users.update({ name, email, phone, role }, { where: { id }, transaction: t });

    if (details) {
      const existingDetails = await db.userDetails.findOne({ where: { userId: id } });

      if (existingDetails) {
        await db.userDetails.update(details, {
          where: { userId: id },
          transaction: t,
        });
      } else {
        await db.userDetails.create({ ...details, userId: id }, { transaction: t });
      }
    }

    await t.commit();

    return res.json({ success: true, message: message.UPDATE_PROFILE("User") });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

// delete by id
exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await commonServices.get(db.users, { where: { id } });
    if (!user) {
      return res.status(200).json({ success: "false", message: message.NO_DATA("User") });
    }

    let data = await commonServices.delete(db.users, { where: { id } });

    if (data > 0) {
      res.status(200).json({ success: "true", message: message.DELETED_SUCCESS("User") });
    } else {
      res.status(200).json({ success: "false", message: message.NOT_DELETED("User") });
    }
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: "false", message: error.message });
  }
};

// view by id
exports.viewById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await db.users.findOne({
      where: { id },
      attributes: ["id", "name", "email", "phone", "role"],
      include: [
        {
          model: db.userDetails,
          as: "details",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: message.NO_DATA("User") });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// view all
exports.viewAll = async (req, res) => {
  try {
    let { page, size, s } = req.query;
    page = Number(page);
    size = Number(size);

    let where = {};

    if (s) {
      where[Op.or] = [
        { name: { [Op.like]: `%${s}%` } },
        { email: { [Op.like]: `%${s}%` } },

        // search from joined table
        { "$details.city$": { [Op.like]: `%${s}%` } },
        { "$details.state$": { [Op.like]: `%${s}%` } },
      ];
    }

    const { limit, offset } = commonServices.getPagination(page, size);

    const query = {
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
      attributes: ["id", "name", "email", "phone", "role"],
      include: [
        {
          model: db.userDetails,
          as: "details",
          attributes: ["id", "userId", "address", "city", "state"],
        },
      ],
    };
    const data = await commonServices.getAndCountAll(db.users,query, limit, offset)

    return res.json({
      success: true,
      data: commonServices.getPagingData(data, page, limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
