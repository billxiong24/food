const checkUserAll = (req, res, next) => {
  let whitelist = false;
  if(req.path.search(/^\/users\/*/i) >= 0) whitelist = true;

  if(!whitelist && (!req.session.user || !req.sessionID)) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdminAll = (req, res, next) => {
  console.log("checkingadminall")
  console.log(req.session);

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
    console.log("checking user")

    console.log(req.session);

  if(!req.session.user || !req.sessionID) {
    res.status(401).json({
      error: "Please log in first"
    })
  } else {
    next();
  }
}

const checkAdmin = (req, res, next) => {
  console.log('checking admin single')
    console.log(req.session);

  if(req.session.admin && req.sessionID) {
    next();
  } else {
    res.status(401).json({
      error: "You do not have administrative permissions"
    })
  }
}

const checkCookie = (req, res, next) => {
  console.log("checking cookie");
    console.log(req.session);

  if(req.sessionID && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
}

module.exports = { checkUserAll, checkCookie, checkAdminAll, checkUser, checkAdmin }