require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');
const db = ("../app/db");

describe('Manufacturing goals', function() {
    it('should get goals of user', function(done) {
        chai.request(server)
        .get('/manufacturing_goals')
        .query({
            user_id: 6
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(3);
            done();
        });
    });
    it('should get goals of non existent user', function(done) {
        chai.request(server)
        .get('/manufacturing_goals')
        .query({
            user_id: 90
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(0);
            done();
        });
    });
    it('should get skus of manufacturing goal', function(done) {
        chai.request(server)
        .get('/manufacturing_goals/7/skus')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(4);
            done();
        });
    });
    it('should get calculations for goal', function(done) {
        chai.request(server)
        .get('/manufacturing_goals/7/calculations')
        .query({
            units: 1
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(3);
            console.log(res.body);
            res.body[0].calc_res.should.equal("17.900");
            done();
        });
    });

    it('should get calculations for goal with package size, unit conversions', function(done) {
        chai.request(server)
        .get('/manufacturing_goals/7/calculations')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(3);
            res.body[0].calc_res.should.equal(0.559375);
            done();
        });
    });

    it('should add manufacturing goal', function(done) {
        chai.request(server)
        .post('/manufacturing_goals')
        .send({
            name: "goal4",
            user_id: 7,
            deadline: "2019-05-09"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property("id");
            done();
        });
    });
    it('should fail to add manufacturing goal with bad deadline', function(done) {
        chai.request(server)
        .post('/manufacturing_goals')
        .send({
            name: "goal4",
            user_id: 7,
            deadline: "243-4441-22"
        })
        .end(function(err, res) {
            res.should.have.status(409);
            res.body.should.have.property("error");
            done();
        });
    });

    it('should fail to add manufacturing goal with existing name', function(done) {
        chai.request(server)
        .post('/manufacturing_goals')
        .send({
            name: "goal4",
            user_id: 7,
            deadline: "2019-02-11"
        })
        .end(function(err, res) {
            res.should.have.status(409);
            res.body.should.have.property("error");
            done();
        });
    });
    
    it('should update existing goal', function(done) {
        chai.request(server)
        .put('/manufacturing_goals/8')
        .send({
            name: "updated goal"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('delete a goal', function(done) {
        chai.request(server)
        .delete('/manufacturing_goals/8')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('test cascade delete', function(done) {
        chai.request(server)
        .get('/manufacturing_goals/8/skus')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(0);
            done();
        });
    });

    it('remove sku from goal', function(done) {
        chai.request(server)
        .delete('/manufacturing_goals/7/skus')
        .send({
            skus: [5, 6, 67]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property("rowCount");
            res.body.rowCount.should.equal(1);
            done();
        });
    });

    it('should add skus to goal', function(done) {
        chai.request(server)
        .post('/manufacturing_goals/7/skus')
        .send({
            skus: [
            
                {
                    sku_id: 6,
                    quantity: 12
                },
                {
                    sku_id: 3,
                    quantity: 6.6
                }
            ]
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property("rowCount");
            res.body.rowCount.should.equal(2);
            done();
        });
    });
    it('should add skus to non-existent goal', function(done) {
        chai.request(server)
        .post('/manufacturing_goals/25/skus')
        .send({
            skus: [
            
                {
                    sku_id: 6,
                    quantity: 12
                },
                {
                    sku_id: 3,
                    quantity: 6.6
                }
            ]
        })
        .end(function(err, res) {
            res.should.have.status(409);
            done();
        });
    });

});
