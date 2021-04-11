const { is } = require("bpmnlint-utils");

/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 * https://github.com/bptlab/scylla/wiki/Simulation-Configuration
 */
module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "bpmn:Task")) return;

    const bsim = node.bsim;

    if (!bsim) {
      return;
    }

    if (bsim.resources && bsim.resources.length && bsim.resources.length >= 2) {
      reporter.report(node.id, "more than one resource assigned");
      return;
    }

    if (bsim.resources && bsim.resources.length && bsim.resources.length > 0) {
      reporter.report(node.id, "more than two resources defined");
      return;
    }

    if (node.lanes && node.lanes.length && node.lanes.length > 0) {
      let laneRes = node.lanes[0].bsim;

      if (
        laneRes &&
        bsim.resources &&
        bsim.resources.resource &&
        bsim.resources.resource.length &&
        bsim.resources.resource.length > 0
      ) {
        reporter.report(node.id, "task resources override lane configuration");
        return;
      }
    }
  }

  return {
    check: check,
  };
};
