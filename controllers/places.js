const mongoose = require("mongoose");
const { isValidID } = require("../utils/validation");
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
    }

    let _city = await mongoose.model("City").findOne({ plate_code: args.plate_code });
    if(!_city) return res.status(405).json({
      error: "Girilen plaka koduna ait şehir bulunamadı"
    })

    const new_place = {
      title: args.title,
      city: _city._id,
      published_by: req.user_data.profile_id,
      images: Array.isArray(req.body.images) ? req.body.images : []
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
      .populate("city", "-places")
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
      .populate("city", "-places")
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

exports.fav_place = async (req, res, next) => {
  let profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });

  let place = await mongoose.model("Place").findOne({ _id: req.params.place_id });

  if(!place || !profile) return res.status(500).json({
    error: "Veriler getirilirken bir hata ile karşılaşıldı."
  });

  place.fav_count += 1;
  place.faved_users.push(req.user_data.profile_id);

  profile.favs.push(req.params.place_id);

  let _place = await place.save();
  let _profile = await profile.save();

  if(profile.favs === _profile.favs) return res.status(500).json({
    error: "Mekan favorilere eklenirken bir hata oluştu."
  });

  if(place === _place) return res.status(500).json({
    error: "Mekan favorilere eklenirken bir hata oluştu."
  });

  return res.status(200).json({
    message: "Mekan favorilere eklendi."
  })
}

exports.unfav_place = async (req, res, next) => {
  let profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });

  let place = await mongoose.model("Place").findOne({ _id: req.params.place_id });

  if(!place || !profile) return res.status(500).json({
    error: "Veriler getirilirken bir hata ile karşılaşıldı."
  });

  place.fav_count -= 1;
  place.faved_users.filter(user => { return user !== req.user_data.profile_id});

  profile.favs.filter(fav_place => { return fav_place !== req.params.place_id});

  let _place = await place.save();
  let _profile = await profile.save();

  if(profile.favs === _profile.favs) return res.status(500).json({
    error: "Mekan favorilerden çıkartılırken bir hata oluştu."
  });

  if(place === _place) return res.status(500).json({
    error: "Mekan favorilerden çıkartılırken bir hata oluştu."
  });

  return res.status(200).json({
    message: "Mekan favorilerden çıkartıldı."
  })
}

exports.like_place = async (req, res, next) => {
  let profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });

  let place = await mongoose.model("Place").findOne({ _id: req.params.place_id });

  if(!place || !profile) return res.status(500).json({
    error: "Veriler getirilirken bir hata ile karşılaşıldı."
  });

  place.like_count += 1;
  place.liked_users.push(req.user_data.profile_id);

  profile.liked.push(req.params.place_id);

  let _place = await place.save();
  let _profile = await profile.save();

  if(profile.liked === _profile.liked) return res.status(500).json({
    error: "Mekan beğenilirken bir hata oluştu."
  });

  if(place === _place) return res.status(500).json({
    error: "Mekan beğenilirken bir hata oluştu."
  });

  return res.status(200).json({
    message: "Mekan beğenilenlere eklendi."
  })
}

exports.dislike_place = async (req, res, next) => {
  let profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });

  let place = await mongoose.model("Place").findOne({ _id: req.params.place_id });

  if(!place || !profile) return res.status(500).json({
    error: "Veriler getirilirken bir hata ile karşılaşıldı."
  });

  place.like_count -= 1;
  place.liked_users.filter(user => { return user !== req.user_data.profile_id});

  profile.liked.filter(liked_place => { return liked_place !== req.params.place_id});

  let _place = await place.save();
  let _profile = await profile.save();

  if(profile.favs === _profile.favs) return res.status(500).json({
    error: "Mekan beğenilenlerden çıkartılırken bir hata oluştu."
  });

  if(place === _place) return res.status(500).json({
    error: "Mekan beğenilenlerden çıkartılırken bir hata oluştu."
  });

  return res.status(200).json({
    message: "Mekan beğenilenlerden çıkartıldı."
  })
}

exports.add_wg_list = async (req, res, next) => {
  try {
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });
    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    await validation.isValidID(req.params.place_id, "place_id");

    profile.gw_list.will_go_list.push(req.params.place_id);
    let _profile = await profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Mekan gidilecekler listesine eklenirken bir hata ile karşılaşıldı."
      });
    
    return res.status(200).json({
      message: "Mekan gidilecekler listesine eklendi"
    })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    })
  }
};

exports.add_gone_list = async (req, res, next) => {
  try {
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });
    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    await validation.isValidID(req.params.place_id, "place_id");

    profile.gw_list.gone_list.push(req.params.place_id);
    let _profile = await profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Mekan gidilenler listesine eklenirken bir hata ile karşılaşıldı."
      });
    
    return res.status(200).json({
      message: "Mekan gidilenler listesine eklendi"
    })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    })
  }
};
