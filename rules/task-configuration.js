const { is } = require("bpmnlint-utils");

/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 * https://github.com/bptlab/scylla/wiki/Simulation-Configuration
 */
module.exports = function () {
  function check(node, reporter) {
    if (is(node, "bpmn:Definitions") && !node.randomSeed) {
      reporter.report(node.id, "No Random Seed defined");
    }

    if (is(node, "bpmn:Definitions") && !node.zoneOffset) {
      reporter.report(node.id, "No Zone Offset defined");
    }

    if (is(node, "bpmn:Definitions") && !node.resourceAssignmentOrder) {
      reporter.report(node.id, "No resourceAssignmentOrder defined");
    }
  }

  return {
    check: check,
  };
};
