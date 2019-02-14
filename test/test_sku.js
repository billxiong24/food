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
            ingredients: [11, 16],
            prodlines: ["prod69"] 
        })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(7);
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
    it('should get ingredients of a SKU', function(done) {
        chai.request(server)
        .get('/sku/35/ingredients')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(4);
            done();
        });
    }); 

    it('should get ingredients of a SKU with no ingredients', function(done) {
        chai.request(server)
        .get('/sku/20/ingredients')
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.length.should.equal(0);
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
            comments: "commentingg",
            man_rate: 69.69,
            formula_id: 1
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
