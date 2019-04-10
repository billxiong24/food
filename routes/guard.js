const checkUserWithWhitelist = (req, res, next) => {
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

const checkCookie = (req, res, next) => {

  if(req.sessionID && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
}

const checkCoreRead = (req, res, next) => {
  if(!req.session.core_read) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to read CORE DATA"
    })
  } else {
    next();
  }
}

const checkCoreWrite = (req, res, next) => {
  if(!req.session.core_write) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to edit CORE DATA"
    })
  } else {
    next();
  }
}

const checkSalesRead = (req, res, next) => {
  if(!req.session.sales_read) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to read SALES DATA"
    })
  } else {
    next();
  }
}

const checkSalesWrite = (req, res, next) => {
  if(!req.session.sales_write) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to edit SALES DATA"
    })
  } else {
    next();
  }
}

const checkGoalsRead = (req, res, next) => {
  if(!req.session.goals_read) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to read MANUFACTURING GOAL DATA"
    })
  } else {
    next();
  }
}

const checkGoalsWrite = (req, res, next) => {
  if(!req.session.goals_write) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to edit MANUFACTURING GOAL DATA"
    })
  } else {
    next();
  }
}

const checkScheduleRead = (req, res, next) => {
  if(!req.session.schedule_read) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to read MANUFACTURING SCHEDULE DATA"
    })
  } else {
    next();
  }
}

const checkScheduleWrite = (req, res, next) => {
  if(!req.session.schedule_write) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to edit MANUFACTURING SCHEDULE DATA"
    })
  } else {
    next();
  }
}

const checkUserRead = (req, res, next) => {
  if(!req.session.user_read) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to read USER DATA"
    })
  } else {
    next();
  }
}

const checkUserWrite = (req, res, next) => {
  if(!req.session.user_write) {
    res.status(401).json({
      error: "Unauthorized Access: Missing permission to edit USER DATA"
    })
  } else {
    next();
  }
}

module.exports = {
  checkUserWithWhitelist, 
  checkCookie,
  checkCoreRead,
  checkCoreWrite,
  checkGoalsRead,
  checkGoalsWrite,
  checkSalesRead,
  checkSalesWrite,
  checkScheduleRead,
  checkScheduleWrite,
  checkUserRead,
  checkUserWrite
}