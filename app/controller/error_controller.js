const err_obj = {
    "23503": "Your request depends on something that doesn't exist (e.g. ingredients, SKU's, manufacturing goals)", //foreign key violation
    "22P02": "Something was syntactically wrong with your request.",  //syntax error
    "23505": "That entry already exists.", //unique violation
    "42703": "There's an undefined field in your request." //undefined column
}


function getErrMsg(err) {
    //string message
    if(!err.code)
        return err;

    if(!err_obj[err.code])
        return "Something went wrong.";

    return err_obj[err.code];
}

module.exports = {
    getErrMsg: getErrMsg
};
