const error_controller = require('./error_controller');
class Controller {

    constructor() {

    }

    static convertParamToArray(param) {
        if(!param) {
            param = [];
        }
        else if(!Array.isArray(param)) {
            param = [param];
        }
        return param;
    }

    constructGetResponse(res, promise) {
        return promise.then((result) => {
            res.status(200).json(result.rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                error: error_controller.getErrMsg(err)
            });
        });
    }

    constructRowCountPostResponse(res, promise) {
        return promise.then((result) => {
            //HTTP 201 is successful addition
            res.status(201).json({
                rowCount: result.rowCount
            });
        })
        .catch((err) => {
            console.log(err);
            //HTTP 409 is conflict status
            res.status(409).json({
                error: error_controller.getErrMsg(err)
            });
        });
    }

    constructPostResponse(res, promise) {
        return promise.then((result) => {
            //HTTP 201 is successful addition
            res.status(201).json(result.rows[0]);
        })
        .catch((err) => {
            //HTTP 409 is conflict status
            res.status(409).json({
                error: error_controller.getErrMsg(err)
            });
        });
    }

    constructUpdateResponse(res, promise, rows=true) {
        promise.then((result) => {
            let retObj = {};
            if(rows) {
                retObj = {
                    rowCount: result.rowCount
                }
            }
            else {
                retObj = result;
            }

            res.status(200).json(retObj);
        })
        .catch((err) => {
            res.status(409).json({
                error: error_controller.getErrMsg(err)
            });
        });
    }

    constructDeleteResponse(res, promise) {
        return this.constructUpdateResponse(res, promise);
    }
}


module.exports = Controller;
