const checkUser = (req, res, next) => {
  console.log(req.path);
  if(req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.status(401).json({
      error: "Please log in first"
    })
  }
}

module.exports = { checkUser, }