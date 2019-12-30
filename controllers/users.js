const mongoose = require("mongoose");
const speakeasy = require("speakeasy");
exports.login = (req, res, next) => {
  const args = req.body;
  mongoose
    .model("User")
    .findOne({ email: args.email })
    .exec()
    .then(user => {
      if (!user)
        return res.status(401).json({
          message: "Giriş Başarısız"
        });

      bcrypt.compare(args.password, user.password, (err, result) => {
        if (err)
          return res.status(401).json({
            message: "Giriş Başarısız"
          });
        if (result) {
          return res.status(200).json({
            token: speakeasy.totp({
              secret: "secret",
              encoding: "base32"
            }),
            remaining: (60 - Math.floor((new Date().getTime() / 1000.0) % 20)),
            _id: user._id
          })
        }
        return res.status(401).json({
          message: "Giriş Başarısız"
        });
      });
    }).catch(err => {
      console.log(err);
      return res.status(500).json({
        err,
        message: "Admin ile iletişime geç"
      });
    });
}

exports.user_verify = async (req, res, next) => {
  let user = await mongoose.model("User").findOne({ _id: req.params.user_id });
  let valid = speakeasy.totp.verify({ 
    secret: "secret",
    encoding: "base32",
    token: args.token,
    window: 5
  });

  if(valid) {
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        profile_id: user.profile_id,
      },
      "secret",
      {
        expiresIn: '1h'
      }
    );  

    return res.status(200).json({
      message: "Giriş Başarılı",
      token
    })
  }else {
    return res.status(409).json({
      err: "Doğrulama Hatası"
    })
  }
}

exports.register = (req, res, next) => {

  const args = req.body;

  let isTaken = await mongoose.model("User").findOne({ email: args.email });
  if(isTaken) return res.status(409).json({ message: "Bu eamil adresi kayıtlı."});

  bcrypt.hash(args.password, 10, (err, hash) => {
    if(err) return res.status(500).json({ err });
    else {
      let userId = new mongoose.Types.ObjectId();
      let profileId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId,
        email: args.email,
        password: hash,
        username: args.email,
        profile_id: profileId,
      };

      const profile = {
        _id: profileId,
        name: args.name,
        surname: args.surname,
        gender: args.gender,
        user_id: userId
      };

      mongoose.model("User").create(user).then(c_user => {
        if(!c_user) return res.status(500).json({ err: "Kullanıcı oluşturulamadı, admin ile iletişime geç."});
        mongoose.model("Profile").create(profile).then(c_profile => {
          if(!c_profile) return res.status(500).json({ err: "Profil oluşturulamadı, admin ile iletişime geç."});
          return res.status(201).json({ message: "Kullanıcı oluşturuldu", c_profile });
        });
      })
    }
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ err });
  })
}