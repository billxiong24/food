const checkUser = (req, res, next) => {
  console.log(req.path.search(/^\/users\/*/));
  if(req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.status(401).json({
      error: "Please log in first"
    })
  }
}

module.exports = { checkUser, }