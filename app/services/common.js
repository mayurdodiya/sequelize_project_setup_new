const db = require("../../app/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config")

const methods = {
  create: async (model, data, additional = undefined) => {
    return model.create(data, additional || undefined);
  },
  update: async (model, query, data, additional = undefined) => {
    return model.update(data, query, additional || undefined);
  },
  delete: async (model, query, additional = undefined) => {
    return model.destroy(query, additional || undefined);
  },
  get: async (model, query, additional = undefined) => {
    return model.findOne(query, additional || undefined);
  },
  getAll: async (model, query) => {
    return model.findAll({ ...query });
  },
  getAndCountAll: async (model, query, limit, offset) => {
    return model.findAndCountAll({ ...query, limit, offset });
  },
  getPagination: (page, size) => {
    const limit = size ? Number(size) : 10;
    const offset = page ? (Number(page) - 1) * limit : 0;
    return { limit, offset };
  },
  getPagingData: (alldata, page, limit) => {
    const { count: totalItems, rows: data } = alldata;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data, totalPages, currentPage };
  },
  generateHashPassword: async (myPassword) => {
    return await bcrypt.hash(myPassword, 10);
  },
  passwordCompare: async (myPassword, hash) => {
    return await bcrypt.compare(myPassword, hash);
  },
  generateToken: (user_id, role) => {
    let token = jwt.sign({ userId: user_id, role: role }, config.SECRET_KEY, { expiresIn: config.EXPIRES_IN });
    return token;
  },
};

module.exports = { methods };
