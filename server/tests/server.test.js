const request = require('supertest')
const expect = require('expect')
const {app} = require('./../server')

const {Application} = require('./../models/application');
const {exampleApps, clearApps} = require('./seed/seed')

describe('POST /apps', () => {
    before(clearApps);  
    it('should create an application', (done) => {
        request(app)
        .post('/apps')
        .send(exampleApps)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          // make sure data inserted is correct
          Application.find({}).then((apps) => {
            expect(apps.length).toBe(2);
            expect(apps[0].fullName).toBe(exampleApps[0].fullName);
            expect(apps[1].fullName).toBe(exampleApps[1].fullName);
            done();
        })
      })
    })
})

describe('GET /validity', () => {
  it('should get 1 valid 1 invalid ', (done) => {
    request(app)
      .get('/validity')
      .expect(200)
      .expect((res) => {
        expect(res.body.validApp.length).toBe(1);
        expect(res.body.invalidApp.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /accRisk', () => {
  before(clearApps)
  it('should return status 200 ', (done) => {
    request(app)
      .get('/accRisk')
      .expect(200)
      .expect((res) => {
        expect(typeof res.body.accRisk).toBe('number')
      })      
      .end(done);
  });
});

describe('GET /failedApps', () => {
  before(clearApps)
  it('should return an array ', (done) => {
    request(app)
      .get('/failedApps')
      .expect(200)
      .expect((res) => {
        expect(typeof res.body.failedApps).toBe('object')
      })
      .end(done);
  });
});
