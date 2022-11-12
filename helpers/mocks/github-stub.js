const sinon = require('sinon');

class GithubStub {
  constructor(context) {
    this.context = context;
    this.client = new OctokitStub();
  }

  getOctokit() {
    return { rest: this.client };
  }
}

class OctokitStub {
  constructor() {
    this.repos = {
      updateRelease: sinon.stub(),
      createRelease: sinon.stub(),
      uploadReleaseAsset: sinon.stub(),
    };
  }
}

module.exports = GithubStub;
