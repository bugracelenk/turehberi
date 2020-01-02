const { ObjectID } = require("mongodb");

const isValidID = (_id, field) => {
  if (!_id) throw new Error(`${field}${errs.NO_ID}`);
  if (!ObjectID.isValid(_id)) throw new Error(`${field}${errs.INVALID_ID}`);
  true;
};

module.exports = { isValidID };