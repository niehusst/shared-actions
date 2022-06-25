const sinon = require('sinon');

class CoreStub {
  constructor(inputs) {
    this.inputs = inputs || {};
    this.outputs = {};

    this.getInput = sinon.stub().callsFake(this.getInputString);
    this.setOutput = sinon.stub().callsFake(this.setOutputString);
    this.setFailed = sinon.spy();
  }

  getInputString(key, options) {
    const value = this.inputs[key];
    if (!value) {
      if (options.required) {
        throw new Error(`The input ${key} is required but was empty.`);
      }
      return '';
    }
    return String(value);
  }

  setOutputString(key, value) {
    this.outputs[key] = String(value);
  }
}

module.exports = CoreStub;
