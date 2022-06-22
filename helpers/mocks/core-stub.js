const sinon = require('sinon');

class CoreStub {
  constructor(inputs) {
    this.inputs = inputs || {};
    this.outputs = {};

    this.getInput = sinon.stub().callsFake(this.getInputString);
    this.setOutput = sinon.stub().callsFake(this.setOutputString);
    this.setFailed = sinon.spy();
  }

  getInputString(key) {
    const value = this.inputs[key];
    if (!value) {
      return '';
    }
    return String(value);
  }

  setOutputString(key, value) {
    this.outputs[key] = String(value);
  }
}

module.exports = CoreStub;
