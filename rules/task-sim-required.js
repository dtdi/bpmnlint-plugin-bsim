const { is } = require("bpmnlint-utils");

function checkDuration(duration) {
  if (
    !duration.timeUnit ||
    !["MINUTES", "HOURS", "SECONDS", "DAYS", "MICROSECONDS"].includes(
      duration.timeUnit
    )
  ) {
    return `${duration.timeUnit} is no valid timeUnit`;
  }
  if (!duration.distribution) {
    return "does not provide a distribution.";
  }
}

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

    const bsim = node.bsim;
    if (!bsim.duration) {
      reporter.report(node.id, "Element is missing a duration");
    } else {
      const msg = checkDuration(bsim.duration);
      if (msg) {
        reporter.report(node.id, "Duration " + msg);
      }
    }
    if (bsim.setUpDuration) {
      checkDuration(bsim.setUpDuration);
      if (msg) {
        reporter.report(node.id, "Setup Duration " + msg);
      }
    }
    if (
      !bsim.resources ||
      !bsim.resources.resource ||
      !bsim.resources.resource.length
    ) {
      reporter.report(node.id, "Element is missing a resource assignment");
    }
  }

  return {
    check: check,
  };
};
