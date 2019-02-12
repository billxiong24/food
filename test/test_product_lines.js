require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');

describe('Product lines', function() {
    it('should search for product line with a keyword on GET /productline/search', function(done) {
        chai.request(server)
        .get('/productline/search')
        .query({
            names: ["prod", "69"],
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(1);
            done();
        });
    });

    it('should offset and limit GET /productline/search', function(done) {
        chai.request(server)
        .get('/productline/search')
        .query({
            names: ["prod"],
            offset: 1,
            limit: 2
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(2);
            res.body[0].name.should.equal("prod69");
            done();
        });
    });

    it('Create a product line with POST /productline', function(done) {
        chai.request(server)
        .post('/productline')
        .send({
            name: "eroi"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property('id');
            res.body.should.have.property('name');
            done();
        });
    });
    it('Attempt to delete productline with skus', function(done) {
        chai.request(server)
        .delete('/productline/1')
        .end(function(err, res) {
            res.should.have.status(409);
            res.body.should.have.property('error');
            done();
        });
    });

    it('should update prodline with PUT /productline', function(done) {
        chai.request(server)
        .put('/productline/1')
        .send({
            name: "prod69"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
});
