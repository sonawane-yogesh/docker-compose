import App from '../../src/server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
chai.use(chaiHttp);

describe('Hello API Request', () => {
    it('should return response on call', (done) => {
        chai.request(App).get('/api/home/get-status').then(res => {
            console.log(res.body);
            return done();
        }).catch((err) => {
            return done();
        });
    });

    it('base address verification call', (done) => {
        chai.request(App).get('/').then(res => {
            console.log(res.body);
            return done();
        }).catch((err) => {
            return done();
        });
    });
});