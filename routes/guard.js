const checkUser = (req, res, next) => {
  if(req.path.search(/^\/users\/*/) < 0 && (!req.session.user || !req.sessionID)) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdmin = (req, res, next) => {
  if(req.session.admin==="true" && req.sessionID) {
    next();
  } else {
    res.status(401).json({
      error: "You do not have administrative permissions"
    })
  }
}

const checkCookie = (req, res, next) => {
  if(req.sessionID && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
}

module.exports = { checkUser, checkCookie, checkAdmin }