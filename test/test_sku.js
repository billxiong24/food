require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
var server = require('../app');
const execSync = require('child_process').execSync;
const db = ("../app/db");

//mocha --exit
function clean(done) {
    execSync("./cleandb.sh");
    done();
}

describe('SKUs', function() {
    it('should search for sku with a keyword on GET /sku/search', function(done) {
        chai.request(server)
        .get('/sku/search')
        .query({
            names: ["sku"],
            ingredients: ["ing234", "name"],
            prodlines: ["prod69"] 
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(3);
            done();
        });
    });

    it('should offset and limit GET /sku/search', function(done) {
        chai.request(server)
        .get('/sku/search')
        .query({
            names: ["sku"],
            offset: 9,
            limit: 5,
            orderKey: "name"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(5);
            res.body[0].name.should.equal("sku1");
            done();
        });
    });

    it('Create a SKU with POST /sku', function(done) {
        chai.request(server)
        .post('/sku')
        .send({
            name: "sadfu2", 
            case_upc: 25389999, 
            unit_upc: 253208, 
            unit_size: "12 lbs", 
            count_per_case: 1,
            prd_line: "prod4",
            comments: "commentingg"
        })
        .end(function(err, res) {
            res.should.have.status(201);
            res.body.should.have.property('id');
            res.body.should.have.property('num');
            done();
        });
    });

    it('should delete a SKU with DELETE /sku', function(done) {
        chai.request(server)
        .delete('/sku/37')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('should get ingredients of a sku', function(done) {
        chai.request(server)
        .get('/sku/1/ingredients')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(4);
            res.body[0].id.should.equal(1);
            res.body[1].id.should.equal(23);
            done();
        });
    });

    it('should get ingredients of a sku', function(done) {
        chai.request(server)
        .get('/sku/1/ingredients')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(4);
            res.body[0].id.should.equal(1);
            res.body[1].id.should.equal(23);
            done();
        });
    });

    it('should add ingredients of a sku', function(done) {
        chai.request(server)
        .post('/sku/1/ingredients')
        .send({
            ingredients: [
                {
                    ingred_num: 1414,
                    quantity: 8
                }
            ]
        })
        .end(function(err, res) {
            console.log(res.body);
            res.should.have.status(201);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });

    it('should reject adding bad ingredient to a sku', function(done) {
        chai.request(server)
        .post('/sku/1/ingredients')
        .send({
            ingredients: [
                {
                    ingred_num: 234787,
                    quantity: 8
                }
            ]
        })
        .end(function(err, res) {
            res.should.have.status(409);
            res.body.should.have.property('error');
            done();
        });
    });

    it('delete ingredient from sku', function(done) {
        chai.request(server)
        .delete('/sku/1/ingredients')
        .send({
            ingredients: [1414]
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });

    it('update sku', function(done) {
        chai.request(server)
        .put('/sku/1')
        .send({
            name: "hethehdfhdf"
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('rowCount');
            res.body.rowCount.should.equal(1);
            done();
        });
    });
    it('bad update sku', function(done) {
        chai.request(server)
        .put('/sku/1')
        .send({
            num: 12
        })
        .end(function(err, res) {
            res.should.have.status(409);
            res.body.should.have.property('error');
            done();
        });
    });
});
