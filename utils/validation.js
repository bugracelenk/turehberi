const plateCodeValidate = plate_code => {
  let plate_code_regex = /^[1-8]?[0-1]$/;
  let isValid = plate_code_regex.test(plate_code);
  if(isValid) return true;
  else throw new Error("Unvalid plate code");
}

const isValidID = (_id, field) => {
  if (!_id) throw new Error(`${field}${errs.NO_ID}`);
  if (!ObjectID.isValid(_id)) throw new Error(`${field}${errs.INVALID_ID}`);
  true;
};

module.exports = { plateCodeValidate, isValidID };