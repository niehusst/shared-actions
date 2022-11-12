const sinon = require('sinon');

class GithubStub {
  constructor(context) {
    this.context = context;
    this.client = {
      repos: {
        updateRelease: sinon.stub(),
        createRelease: sinon.stub(),
        uploadReleaseAsset: sinon.stub(),
      },
    };
  }

  getOctokit() {
    return { rest: this.client };
  }
}

module.exports = GithubStub;
