const sinon = require('sinon');

class GithubStub {
    constructor(context) {
        this.context = context;
        this.client = {}; // gh api client??
    }

    getOctokit() {
        return { rest: this.client };
    }
}

module.exports = GithubStub;
