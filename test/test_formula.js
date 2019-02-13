require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');
const db = ("../app/db");

describe('Formula', function() {
    it('should search for formulas by name, sorted by name', function(done) {
        chai.request(server)
        .get('/formula/search')
        .query({
            names: ['form', '6'],
            orderKey: 'name'
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(2);
            done();
        });
    });

    it('should search for formulas by name and ingredient, limit and offset', function(done) {
        chai.request(server)
        .get('/formula/search')
        .query({
            ingredients: [19],
            limit: 2,
            offset: 1
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(1);
            done();
        });
    });

    it('should create a formula', function(done) {
        chai.request(server)
        .post('/formula')
        .send({
            name: "making"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property('id');
            done();
        });
    });
    it('should add ingredients for formula', function(done) {
        chai.request(server)
        .post('/formula/4/ingredients')
        .send({
            "ingredients": [
                {
                    "ingredients_id": 22,
                    "quantity": 0.4,
                    "unit": "lb"
                },
                {
                    "ingredients_id": 23,
                    "quantity": 2.17,
                    "unit": "lb"
                }
            ]
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(2);
            done();
        });
    });
    it('should delete ingredients from formula', function(done) {
        chai.request(server)
        .delete('/formula/4/ingredients')
        .send({
            ingredients: [22, 23]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(2);
            done();
        });
    });

    it('should update a formula', function(done) {
        chai.request(server)
        .put('/formula/1')
        .send({
            name: "updated name"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('should delete a formula', function(done) {
        chai.request(server)
        .delete('/formula/1')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
});
