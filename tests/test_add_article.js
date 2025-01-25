const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const app = require('../'); // Replace with the actual path to your app
const BlogPost = require('../models/blogPost'); // Replace with the actual path to your BlogPost model

chai.use(chaiHttp);

describe('POST /admin/add-article', () => {
  let saveStub;

  before(() => {
    // Stub the save method of BlogPost to avoid actual database interaction
    saveStub = sinon.stub(BlogPost.prototype, 'save');
  });

  after(() => {
    // Restore the original method
    saveStub.restore();
  });

  it('should redirect to /admin/login if not authenticated', (done) => {
    chai
      .request(app)
      .post('/admin/add-article')
      .send({ title: 'Test Title', content: 'Test Content' })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo('/admin/login');
        done();
      });
  });

  it('should add an article and redirect to /articles if authenticated', (done) => {
    saveStub.resolves(); // Simulate successful save

    chai
      .request(app)
      .post('/admin/add-article')
      .set('cookie', 'isAuthenticated=true') // Simulate authenticated session
      .send({ title: 'Test Title', content: 'Test Content' })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo('/articles');
        done();
      });
  });

  it('should flash error and redirect to /admin/add-article on save failure', (done) => {
    saveStub.rejects(new Error('Save failed')); // Simulate save failure

    chai
      .request(app)
      .post('/admin/add-article')
      .set('cookie', 'isAuthenticated=true') // Simulate authenticated session
      .send({ title: 'Test Title', content: 'Test Content' })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo('/admin/add-article');
        done();
      });
  });
});
