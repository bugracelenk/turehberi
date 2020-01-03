const mongoose = require("mongoose");

const errMessage500 = (err, res) => {
  console.log(err.message);
  return res.status(500).json({
    error: err.message
  });
};

exports.create_comment = async (req, res, next) => {
  try {
    const place_id = req.params.place_id;

    let place = await mongoose.model("Place").findOne({ _id: place_id });
    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });

    if (!place)
      return res.status(404).json({
        error: "Mekan bulunamadı."
      });

    if (!profile)
      return res.status(404).json({
        error: "Kullanıcı bulunamadı."
      });

    let comment = {
      text: req.body.text ? req.body.text : "",
      owner: req.user_data.profile_id,
      place: place_id
    };

    let _comment = await mongoose.model("Comment").create(comment);

    if (!_comment)
      return res.status(500).json({
        error: "Yorum kaydedilirken bir hata ile karşılaşıldı."
      });

    profile.comments.push(_comment._id);
    profile.batch += 1;
    let _profile = await profile.save();

    if (profile === _profile)
      return res.status(500).json({
        error: "Yorum profile işlenirken bir hata ile karşılaşıldı"
      });

    return res.status(201).json({
      message: "Yorum kaydedildi. Yönetici onayı bekliyor.",
      _comment
    });
  } catch (err) {
    errMessage500(err, res);
  }
};

exports.get_comments_for_place = async (req, res, next) => {
  try {
    const place_id = req.params.place_id;

    let comments = await mongoose.model("Comments").find({ place: place_id });

    if (comments.length === 0)
      return res.status(404).json({
        message: "Bu mekan için atılmış yorum bulunamadı."
      });

    return res.status(200).json({
      comments
    });
  } catch (err) {
    errMessage500(err, res);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    let comment_id = req.body.comment_id;

    let profile = await mongoose
      .model("Profile")
      .findOne({ _id: req.user_data.profile_id });

    if(!profile) res.status(404).json({
      error: "Kullanıcı bulunamadı."
    });

    let deleted_comment = await mongoose.model("Comment").findByIdAndDelete(comment_id);

    await profile.comments.filter(commment => { return comment !== comment_id });

    let _profile = await profile.save();

    if(_profile === profile) return res.status(500).json({
      error: "Yorum profilden silinirken bir hata oluştu."
    });

    return res.status(200).json({
      message: "Yorum başarılı bir şekilde silindi.",
      deleted_comment
    })
  }catch(err) {
    errMessage500(err, res);
  }
};

exports.get_unapproved_comments = async (req, res, next) => {
  try {
    let comments = await mongoose.model("Comments").find({ isApproved: false });

    if (comments.length === 0)
      return res.status(404).json({
        message: "Onay almamış yorum bulunmamakta."
      });

    return res.status(200).json({
      comments
    });
  } catch (err) {
    errMessage500(err, res);
  }
};

exports.approve_comment = async (req, res, next) => {
  try {
    let comment = await mongoose.model("Comments").findOne({ _id: req.body.comment_id });

    if (!comment)
      return res.status(404).json({
        message: "Yorum bulunamadı."
      });

    comment.isApproved = true;
    comment.updated_at = Date.now();

    let _comment = await comment.save();

    if(_comment === comment) return res.status(500).json({ error: "Yorum onaylanırken bir hata oluştu." });

    return res.status(200).json({
      _comment
    });
  } catch (err) {
    errMessage500(err, res);
  }
}