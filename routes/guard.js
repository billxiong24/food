const checkUser = (req, res, next) => {
  console.log(req.session);
  console.log(req.cookies);
  if(req.path.search(/^\/users\/*/) < 0 && (!req.session.user || !req.cookies.user_sid)) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdmin = (req, res, next) => {
  if(req.session.admin==="true" && req.cookies.user_sid) {
    next();
  } else {
    res.status(401).json({
      error: "You do not have administrative permissions"
    })
  }
}

const checkCookie = (req, res, next) => {
  if(req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
}

module.exports = { checkUser, checkCookie, checkAdmin }