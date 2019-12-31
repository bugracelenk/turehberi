const mongoose = require("mongoose");
const { plateCodeValidate, isValidID } = require("../utils/validation");
const paginate = require("../utils/paginate");

const errMessage400 = (err,res) => {
  console.log(err.message);
  return res.status(400).json({
    error: err.message
  });
};

const errMessage500 = (err,res) => {
  console.log(err.message);
  return res.status(500).json({
    error: err.message
  });
};

exports.create_place = async (req, res, next) => {
  try {
    const args = req.body;

    plateCodeValidate(args.plate_code);

    let isCreated = await mongoose
      .model("Place")
      .findOne({ title: args.title });
    if (isCreated && isCreated.title === args.title) {
      return res.status(400).json({
        message: "Bu başlık ile daha önce bir mekan oluşturulmuş",
        request: {
          type: "GET",
          url: `http://${process.env.HOST}:${process.env.PORT}/api/places/${isCreated._id}`
        }
      });
    } else if (isCreated && isCreated.plate_code === args.plate_code) {
      return res.status(400).json({
        message: "Bu plaka kodu ile daha önce bir mekan oluşturulmuş",
        request: {
          type: "GET",
          url: `http://${process.env.HOST}:${process.env.PORT}/api/places/${isCreated._id}`
        }
      });
    }

    const new_place = {
      title: args.title,
      plate_code: args.plate_code,
      published_by: req.user_data.profile_id
    };

    let _new_place = await mongoose.model("Place").create(new_place);

    if (_new_place)
      return res.status(201).json({
        message: "Mekan Oluşturuldu",
        request: {
          type: "GET",
          url: `http://${process.env.HOST}:${process.env.PORT}/api/places/${_new_place._id}`
        }
      });
    else
      return res.status(500).json({
        error: "Internal Error",
        message:
          "Contact with the admin, error: Something went wrong when createing new place"
      });
  } catch (err) {
    errMessage400(err, res);
  }
};

exports.get_place_by_id = async (req, res, next) => {
  try {
    const args = req.params;

    await isValidID(args.place_id, "place_id");

    mongoose
      .model("Place")
      .findOne({ _id: args.place_id })
      .populate("faved_users", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .populate("liked_users", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .populate("published_by", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .exec()
      .then(result => {
        if (result) return res.status(200).json(result);
        else
          return res.status(400).json({
            error: "Couldn't find any place for this _id"
          });
      })
      .catch(err => {
        errMessage500(err, res);
      });
  } catch (err) {
    errMessage400(err, res);
  }
};

exports.get_places = (req, res, next) => {
  try {
    let args = {
      getData: {
        skip: req.params.skip,
        limit: req.params.limit
      }
    };
    mongoose
      .model("Place")
      .find({})
      .populate("liked_users", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .populate("faved_users", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .populate("published_by", "-_id -gw_list -gender -followers -following -comments -liked -favs -user_id")
      .limit(paginate.setLimit(args))
      .skip(paginate.setSkip(args))
      .sort({ plate_code: 1 })
      .exec()
      .then(result => {
        if (result.length > 0) {
          const response = {
            count: result.length,
            places: result.map(place => {
              return {
                title: place.title,
                point: place.point,
                plate_code: place.plate_code,
                fav_count: place.fav_count,
                faved_users: place.faved_users,
                like_count: place.like_count,
                liked_users: place.liked_users,
                created_at: place.created_at,
                published_by: place.published_by,
                request: {
                  type: "GET",
                  url: `http://${process.env.HOST}:${process.env.PORT}/api/places/${place._id}`
                }
              }
            })
          }

          return res.status(200).json(response);

        }
        else return res.status(200).json({ error: "There is no data" });
      })
      .catch(err => {
        errMessage500(err, res);
      });
  } catch (err) {
    errMessage400(err, res);
  }
};

exports.update_place = (req, res, next) => {
  try {
    const args = req.body;
    const id = req.params.place_id;
    const updateOps = {};
    for (const ops of args) {
      updateOps[ops.propName] = ops.value;
    }
    mongoose
      .model("Place")
      .findOneAndUpdate({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        if(result) return res.status(200).json({
          message: "Mekan Güncellendi",
          request: {
            type: "GET",
            url: `http://${process.env.HOST}:${process.env.PORT}/api/places/${result._id}`
          }
        })
      });
  } catch (err) {
    errMessage400(err, res);
  }
};

exports.delete_place = (req, res, next) => {
  try {
    const id = req.params.place_id;
    mongoose
      .model("Place")
      .findByIdAndDelete({ _id: id })
      .exec()
      .then(result => {
        if(result) return res.status(200).json({
          message: "Mekan Başarıyla Silindi",
        })
      });
  } catch (err) {
    errMessage400(err, res);
  }
};
