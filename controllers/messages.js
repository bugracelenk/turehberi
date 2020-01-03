const mongoose = require("mongoose");

exports.get_messages = async (req, res, next) => {
  let _messages = await mongoose
    .model("Profile")
    .findOne({ _id: req.user_data.profile_id })
    .populate("messages.with", "name surname")
    .populate("messages.chat", "-__v")
    .exec((err, profile) => {
      if (err)
        return res.status(500).json({
          error: err.message
        });

      if (!profile)
        return res.status(500).json({
          error: "Mesajlar getirilirken bir hata oluştu."
        });
      if (profile.messages.length === 0)
        return res.status(200).json({
          message: "Hiç mesaj yok."
        });
      return res.status(200).json(profile.messages);
    });
};

exports.get_chat = async (req, res, next) => {
  let profile_chat = await mongoose
    .model("Profile")
    .findOne({
      _id: req.user_data.profile_id
    })
    .populate("messages.chat", "-__v")
    .exec(async (err, result) => {
      await mongoose
        .model("Profile")
        .populate(result.messages, [
          { path: "chat.from", select: "name surname" }
        ]);
      await mongoose
        .model("Profile")
        .populate(result.messages, [
          { path: "chat.to", select: "name surname" }
        ]);

      if (!result)
        return res.status(500).json({
          error: "Mesajlar getirilirken bir hata oluştur"
        });

      if (result.messages.length === 0) {
        return res.status(200).json({
          message: "Gösterilecek mesaj yok."
        });
      } else {
        result.messages.map(_chat => {
          if (_chat.with !== req.params.profile_id)
            return res.status(200).json(_chat.chat);
        });
      }
    });
};

async function my_profile(req, res) {
  let profile_chat = await mongoose.model("Profile").findOne({
    _id: req.user_data.profile_id
  });

  if (!profile_chat)
    return res.status(500).json({
      error:
        "Mesaj kaydedilirken bir hata ile karşılaşıldı. Konuşma getirilemedi."
    });

  let new_chat_object;

  const new_message = {
    from: req.user_data.profile_id,
    to: req.params.profile_id,
    message: req.body.message
  };

  let _new_message = await mongoose.model("Message").create(new_message);
  if (!_new_message)
    return res.status(500).json({
      error: "Mesaj kaydedilirken bir hata ile karşılaşıldı. Mesaj Getirilemedi"
    });

  if (profile_chat.messages.length === 0) {
    new_chat_object = {
      with: req.user_data.profile_id,
      chat: []
    };

    new_chat_object.chat.push(_new_message._id);

    profile_chat.messages.push(new_chat_object);
  } else {
    profile_chat.messages.map(async chat_ => {
      return chat_.with === req.params.profile_id
        ? null
        : chat_.chat.push(_new_message._id);

      // console.log(chat_)
      // console.log(req.user_data.profile_id)
      // if (chat_.with === req.user_data.profile_id){
      //   await chat_.chat.push(_new_message._id);
      //   console.log(chat_);
      // }
      // console.log(chat_)
    });
  }
}

async function other_profile(req, res) {
  let profile_chat = await mongoose.model("Profile").findOne({
    _id: req.params.profile_id
  });

  if (!profile_chat)
    return res.status(500).json({
      error:
        "Mesaj kaydedilirken bir hata ile karşılaşıldı. Konuşma getirilemedi."
    });

  let new_chat_object;

  const new_message = {
    from: req.user_data.profile_id,
    to: req.params.profile_id,
    message: req.body.message
  };

  let _new_message = await mongoose.model("Message").create(new_message);
  if (!_new_message)
    return res.status(500).json({
      error: "Mesaj kaydedilirken bir hata ile karşılaşıldı. Mesaj Getirilemedi"
    });

  if (profile_chat.messages.length === 0) {
    new_chat_object = {
      with: req.user_data.profile_id,
      chat: []
    };

    new_chat_object.chat.push(_new_message._id);

    profile_chat.messages.push(new_chat_object);
  } else {
    profile_chat.messages.map(async chat_ => {
      return chat_.with === req.user_data.profile_id
        ? null
        : chat_.chat.push(_new_message._id);

      // console.log(chat_)
      // console.log(req.user_data.profile_id)
      // if (chat_.with === req.user_data.profile_id){
      //   await chat_.chat.push(_new_message._id);
      //   console.log(chat_);
      // }
      // console.log(chat_)
    });
  }

  let _profile_chat = await profile_chat.save();

  if (_profile_chat !== profile_chat)
    return res.status(500).json({
      error:
        "Mesaj kaydedilirken bir hata ile karşılaşıldı. Mesaj Profile Kaydedilemedi"
    });
}

exports.send_message = async (req, res, next) => {
  let a = await my_profile(req, res);
  let b = await other_profile(req, res);
  return res.sendStatus(200);
};

exports.delete_chat = async (req, res, next) => {
  let profile_chat = await mongoose
    .model("Profile")
    .findOne({
      _id: req.user_data.profile_id
    });

  if (!profile_chat)
    return res.status(500).json({
      error:
        "Mesaj kaydedilirken bir hata ile karşılaşıldı. Konuşma getirilemedi."
    });

  let messages = profile_chat.messages.filter(message => {
    return message.with !== req.params.profile_id;
  });

  if(messages.length > 0 ) {
    messages.map(message => {
      mongoose.model("Message").deleteOne({ _id: message })
    })
  }

  let _profile_chat = profile_chat.save();

  return res.status(200).json({
    message: "Mesajlar başarılı bir şekilde silindi."
  });
};
