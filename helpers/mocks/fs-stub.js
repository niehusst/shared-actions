const sinon = require('sinon');

class FsStub {
  constructor(data = {}) {
    this.data = data;
    this.readFile = sinon.stub().callsFake(this.mockReadFile);
    this.writeFile = sinon.stub().callsFake(this.mockWriteFile);
  }

  mockReadFile(key) {
    return this.data[key];
  }

  mockWriteFile(key, value) {
    this.data[key] = value;
  }
}

module.exports = FsStub;
