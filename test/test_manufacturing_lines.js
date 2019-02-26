require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');
const db = ("../app/db");

describe('manufacturing lines', function() {
    it('should search for manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/search')
        .query({
            name: ["man"]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(6);
            done();
        });
    });
    it('should order and filter for manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/search')
        .query({
            orderKey: "name",
            limit: 1
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body[0].name.should.equal("aeiruet");
            res.body.length.should.equal(1);
            done();
        });
    });
    it('get mapping of skus to manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/sku_mapping')
        .query({
            skus: [1, 21, 26]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('none');
            res.body.should.have.property('all');
            res.body.should.have.property('some');

            res.body.none.length.should.equal(5);
            res.body.all.length.should.equal(2);
            res.body.some.length.should.equal(1);
            done();
        });
    });

    it('get mapping of skus to manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/sku_mapping')
        .query({
            skus: [1, 21, 26]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('none');
            res.body.should.have.property('all');
            res.body.should.have.property('some');

            res.body.none.length.should.equal(5);
            res.body.all.length.should.equal(2);
            res.body.some.length.should.equal(1);
            done();
        });
    });

    it('get mapping of skus to manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/sku_mapping')
        .query({
            skus: [1, 21, 26]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('none');
            res.body.should.have.property('all');
            res.body.should.have.property('some');

            res.body.none.length.should.equal(5);
            res.body.all.length.should.equal(2);
            res.body.some.length.should.equal(1);
            done();
        });
    });

    it('get skus of a manufacturing lines', function(done) {
        chai.request(server)
        .get('/manufacturing_line/3/skus')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(4);
            done();
        });
    });
    it('should create new manufacturing line', function(done) {
        chai.request(server)
        .post('/manufacturing_line')
        .send({
            "name": "newname",
            "shortname": "eee"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property('id');
            done();
        });
    });
    it('should add skus to an existing manufacturing line', function(done) {
        chai.request(server)
        .post('/manufacturing_line/1/skus')
        .send({
            skus: [19, 20, 24, 26]
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.rowCount.should.equal(2);
            done();
        });
    });
    it('should bulk edit add many skus to manufacturing lines', function(done) {
        chai.request(server)
        .put('/manufacturing_line/sku_mapping')
        .send({
            all: [5, 6, 7],
            none: [1],
            skus: [1, 21, 26]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('insertedRows');
            res.body.should.have.property('deletedRows');

            res.body.insertedRows.should.equal(9);
            res.body.deletedRows.should.equal(3);
            done();
        });
    });
    it('should update a manufacturing line', function(done) {
        chai.request(server)
        .put('/manufacturing_line/1')
        .send({
            name: "new nameeememe"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('should delete a manufacturing line', function(done) {
        chai.request(server)
        .delete('/manufacturing_line/1')
        .end(function(err, res) {
            //should not be able to delete manufacturing line
            res.should.have.status(409);
            done();
        });
    });
});
