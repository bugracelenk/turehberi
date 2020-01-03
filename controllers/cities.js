const mongoose = require("mongoose");

exports.get_cities = async (req, res, next) => {
  let cities = await mongoose.model("City").find({});

  if(cities.length === 0) return res.status(404).json({
    message: "Kayıtlı şehir bulunmamakta."
  });

  return res.status(200).json({
    cities
  })
}

exports.add_city = async (req, res, next) => {
  const city_data = {
    name: req.body.name,
    plate_code: req.body.plate_code
  }

  let city = await mongoose.model("City").create(city_data);

  if(!city) return res.status(500).json({
    error: "Şehir kaydedilirken bir hata ile karşılaşıldı."
  });

  return res.status(201).json(city);
}