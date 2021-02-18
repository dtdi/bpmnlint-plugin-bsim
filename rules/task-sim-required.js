const { is } = require("bpmnlint-utils");

/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 * https://github.com/bptlab/scylla/wiki/Simulation-Configuration
 */
module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "bpmn:Task")) return;

    if (!node.bsim) {
      reporter.report(node.id, "Element is missing bsimElement");
      return;
    }
  }

  return {
    check: check,
  };
};
