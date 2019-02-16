require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');
const db = ("../app/db");

describe('manufacturing lines', function() {

    it('should search for manufacturing lines', function(done) {
        done();
    });

});
