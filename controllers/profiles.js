const mongoose = require("mongoose");
const validation = require("../utils/validation");

exports.get_profile = async (req, res, next) => {
  let my_profile = await mongoose
    .model("Profile")
    .findOne({ _id: req.user_data.profile_id })
    .populate("followers", "name surname profile_pic -_id -__v")
    .populate("following", "name surname profile_pic -_id -__v")
    .populate("gw_list.gone_list", "title -__v")
    .populate("gw_list.will_go_list", "title -__v")
    .populate("routes.route", "title -__v")
    .populate("favs", "title -__v")
    .populate("liked", "title -__v")
    .populate("messages.with", "name surname -__v")
    .exec();
  if (my_profile) return res.status(200).json({ my_profile });
  else
    return res.status(500).json({
      error:
        "Something went wrong when getting your profile data, please try again and contact with an admin "
    });
};

exports.get_profile_by_id = async (req, res, next) => {
  let profile = await mongoose
    .model("Profile")
    .findOne({ _id: req.body.profile_id })
    .populate("followers", "name surname profile_pic -_id -__v")
    .populate("following", "name surname profile_pic -_id -__v")
    .populate("gw_list.gone_list", "title -__v")
    .populate("gw_list.will_go_list", "title -__v")
    .populate("routes.route", "title -__v")
    .populate("favs", "title -__v")
    .populate("liked", "title -__v")
    .exec();
  if (profile) return res.status(200).json({ profile });
  else
    return res.status(500).json({
      error:
        "Something went wrong when getting the profile data, please try again and contact with an admin "
    });
};

exports.update_profile = async (req, res, next) => {
  const updateOps = {};
  for (ops in req.body) {
    updateOps[ops.prop_name] = ops.value;
  }
  let old_profile = await mongoose
    .model("Profile")
    .findOne({ _id: req.user_data.profile_id });
  let updated_profile = await mongoose
    .model("Profile")
    .findOneAndUpdate({ _id: profile_id }, { $set: updateOps });

  if (old_profile !== updated_profile)
    return res.status(200).json({
      message: "Profil Güncellendi",
      request: {
        type: "GET",
        url: process.env.SERVER
          ? `http://${process.env.SERVER}/api/profiles/${profile_id}`
          : `http://${process.env.HOST}:${process.env.PORT}/api/profiles/${profile_id}`
      }
    });
  else
    return res.status(500).json({
      error:
        "Something went wrong when updating your profile, please try again and contact with an admin"
    });
};

exports.delete_profile = async (req, res, next) => {
  let deleted_profile = await mongoose
    .model("Profile")
    .findByIdAndDelete(req.user_data.profile_id);

  if (deleted_profile) {
    let deleted_user = await mongoose
      .model("User")
      .findByIdAndDelete(req.user_data._id);
    if (deleted_user)
      return res.status(200).json({
        message: "Profil başarılı bir şekilde silindi"
      });
    else
      return res.status(500).json({
        error:
          "Kullanıcı silinirken bir hata ile karşılaşıldı. tekrar deneyiniz ve admin ile iletişime geçiniz."
      });
  } else {
    res.status(500).json({
      error:
        "Profil silinirken bir hata ile karşılaşıldı. tekrar deneyiniz ve admin ile iletişime geçiniz."
    });
  }
};

exports.create_route = async (req, res, next) => {
  try {
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });
    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    if (!req.body.title || req.body.title === "")
      return res.status(405).json({
        error: "Lütfen Rotanız için bir başlık giriniz."
      });

    if (Array.isArray(req.body.route)) {
      if (req.body.route.length > 0) {
        req.body.route.map(_route => {
          validation.isValidID(_route, "route_id");
        });
      }
    } else {
      return res.status(405).json({
        error: "Lütfen rotanızı oluşturunuz."
      });
    }

    profile.routes.push(req.body);

    let _profile = await profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Rota kaydedilirken bir hata ile karşılaşıldı."
      });

    return res.status(201).json({
      message: "Rota başarılı bir şekilde kaydedildi."
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.follow_user = async (req, res, next) => {
  try {
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });
    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    let followed_profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.params.profile_id });

    if (!followed_profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    await validation.isValidID(req.params.profile_id, "profile_id");

    profile.following.push(req.params.profile_id);
    followed_profile.followers.push(req.user_data.profile_id);

    let _profile = profile.save();
    let _followed_profile = followed_profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Kullanıcı takip edilirken bir hata ile karşılaşıldı."
      });

    if (followed_profile === _followed_profile)
      return res.status(500).json({
        error: "Kullanıcı takip edilirken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "Kullanıcı takip edildi."
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.unfollow_user = async (req, res, next) => {
  try {
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });
    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    let following_profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.body.profile_id });

    if (!following_profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });

    await validation.isValidID(req.body.profile_id, "profile_id");

    profile.following.filter(user => {
      return user !== req.body.profile_id;
    });
    following_profile.filter(_user => {
      return _user !== req.user_data.profile_id;
    });

    let _profile = profile.save();
    let _following_profile = following_profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Kullanıcı takipten çıkarılırken bir hata ile karşılaşıldı."
      });

    if (following_profile === _following_profile)
      return res.status(500).json({
        error: "Kullanıcı takipten çıkarılırken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "Kullanıcı takipten çıkarıldı."
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

