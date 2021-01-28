const { is } = require("bpmnlint-utils");

function isValidDate(d) {
  const date = new Date(d);

  return date instanceof Date && !isNaN(date);
}

/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 */
module.exports = function () {
  function check(node, reporter) {
    if (is(node, "bsim:simulationConfiguration")) {
      if (!node.processInstances) {
        reporter.report(node.id, "No processInstances defined");
      }

      if (!node.startEvent) {
        reporter.report(node.id, "No startEvent defined");
      } else {
        if (!node.startEvent.bpmnElement)
          reporter.report(node.id, "startEvent does not exist defined");
      }

      if (!node.startDateTime) {
        reporter.report(node.id, `No startDateTime given`);
      } else if (!isValidDate(node.startDateTime)) {
        reporter.report(
          node.id,
          `${node.startDateTime} is not a valid startDateTime`
        );
      }
      if (node.endDateTime && !isValidDate(node.endDateTime)) {
        reporter.report(
          node.id,
          `${node.endDateTime} is not a valid endDateTime`
        );
      }
    }
  }

  return {
    check: check,
  };
};
