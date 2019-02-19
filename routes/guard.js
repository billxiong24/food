const checkUserAll = (req, res, next) => {
  let whitelist = false;
  if(req.path.search(/^\/users\/*/i) >= 0) whitelist = true;

  console.log(req.session.user);
  console.log(req.sessionID);
  if(!whitelist && (!req.session.user || !req.sessionID)) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdminAll = (req, res, next) => {
  let whitelist = false;
  if(req.path.search(/^\/users\/*/i) >= 0) whitelist = true;
  else if(req.path.search(/^\/manufacturing_goals\/*/i) >= 0) whitelist = true;
  
  if(whitelist || (req.session.admin && req.sessionID)) {
    next();
  } else {
    res.status(401).json({
      error: "You do not have administrative permissions"
    })
  }
}

const checkUser = (req, res, next) => {
  if(!req.session.user || !req.sessionID) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdmin = (req, res, next) => {
  if(req.session.admin && req.sessionID) {
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

module.exports = { checkUserAll, checkCookie, checkAdminAll, checkUser, checkAdmin }