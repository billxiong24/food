require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');

describe('ingredients', function() {
    it('should search for ingredients with a keyword on GET /ingredients/search', function(done) {
        chai.request(server)
        .get('/ingredients/search')
        .query({
            names: ["ing"],
            skus: [3, 5]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(3);
            done();
        });
    });

    it('should offset and limit GET /ingredients/search', function(done) {
        chai.request(server)
        .get('/ingredients/search')
        .query({
            names: ["ing"],
            offset: 9,
            limit: 5
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(5);
            done();
        });
    });

    it('add an ingredient with POST /ingredients', function(done) {
        chai.request(server)
        .post('/ingredients')
        .send({
                name: "nomore",
                pkg_size: 24,
                unit: "ml",
                pkg_cost: 555,
                vend_info: "someinfo"
            })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property("id");
            res.body.should.have.property("num");
            done();
        });
    });

    it('should get SKUs of an ingredient with GET /ingredients/skus', function(done) {
        chai.request(server)
        .get('/ingredients/16/skus')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(6);
            done();
        });
    });

    it('should update an ingredient with PUT /ingredients', function(done) {
        chai.request(server)
        .put('/ingredients/1')
        .send({
            num: 11122
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });

    it('should delete an ingredient with DELETE /ingredients', function(done) {
        chai.request(server)
        .delete('/ingredients/4')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
});
