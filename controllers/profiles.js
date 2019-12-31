const mongoose = require("mongoose");

exports.get_profile = async (req, res, next) => {
  let my_profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });
  if(my_profile) return res.status(200).json({ my_profile })
  else return res.status(500).json({ error: "Something went wrong when getting your profile data, please try again and contact with an admin "});
}

exports.get_profile_by_id = async (req, res, next) => {
  let profile = await mongoose.model("Profile").findOne({ _id: req.body.profile_id });
  if(profile) return res.status(200).json({ profile })
  else return res.status(500).json({ error: "Something went wrong when getting the profile data, please try again and contact with an admin "});
}

exports.update_profile = async (req, res, next) => {
  const updateOps = {};
  for(ops in req.body) {
    updateOps[ops.prop_name] = ops.value
  }
  let old_profile = await mongoose.model("Profile").findOne({ _id: req.user_data.profile_id });
  let updated_profile = await mongoose.model("Profile").findOneAndUpdate({ _id: profile_id }, { $set: updateOps });

  if(old_profile !== updated_profile) return res.status(200).json({
    message: "Profil Güncellendi",
    request: {
      type: "GET",
      url: process.env.SERVER ? `http://${process.env.SERVER}/api/profiles/${profile_id}` : `http://${process.env.HOST}:${process.env.PORT}/api/profiles/${profile_id}`
    }
  })
  else return res.status(500).json({
    error: "Something went wrong when updating your profile, please try again and contact with an admin"
  })
}

exports.delete_profile = async (req, res, next) => {

  let deleted_profile = await mongoose.model("Profile").findByIdAndDelete(req.user_data.profile_id);

  if(deleted_profile) {
    let deleted_user = await mongoose.model("User").findByIdAndDelete(req.user_data._id);
    if(deleted_user) return res.status(200).json({
      message: "Profil başarılı bir şekilde silindi"
    })
    else return res.status(500).json({
      error: "Kullanıcı silinirken bir hata ile karşılaşıldı. tekrar deneyiniz ve admin ile iletişime geçiniz."
    })
  }else {
    res.status(500).json({
      error: "Profil silinirken bir hata ile karşılaşıldı. tekrar deneyiniz ve admin ile iletişime geçiniz."
    })
  }
}