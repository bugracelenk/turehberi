const { ObjectID } = require("mongodb");

const plateCodeValidate = plate_code => {

}

const isValidID = (_id, field) => {
  if (!_id) throw new Error(`${field}${errs.NO_ID}`);
  if (!ObjectID.isValid(_id)) throw new Error(`${field}${errs.INVALID_ID}`);
  true;
};

module.exports = { plateCodeValidate, isValidID };