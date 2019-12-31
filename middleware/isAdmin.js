
module.exports = (req, res, next) => {
  console.log(req.user_data)
  if(req.user_data.user_type !== "admin") {
    return res.status(409).json({
      user_type: req.user_data.user_type,
      message: "Bu işlemi yapabilmek için admin olmanız gerekiyor. ss"
    });
  }
  next();
}