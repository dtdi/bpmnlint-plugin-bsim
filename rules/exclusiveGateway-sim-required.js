const { is } = require("bpmnlint-utils");
/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 */
module.exports = function () {
  function check(node, reporter) {
    if (is(node, "bpmn:ExclusiveGateway") && node.outgoing.length > 1) {
      if (!node.bsim) {
        reporter.report(node.id, "Element is lacking bsim specs");
        return;
      }

      const bsim = node.bsim;

      if (!bsim.outgoingSequenceFlow || !bsim.outgoingSequenceFlow.length) {
        reporter.report(
          node.id,
          "Element is lacking bsim outgoingSequenceFlow specs"
        );
      }

      let sumProbability = 0;
      node.outgoing.forEach(function (sequenceFlow) {
        if (!sequenceFlow.bsim) {
          reporter.report(
            sequenceFlow.id,
            "Element is lacking bsim outgoingSequenceFlow specs"
          );
        } else if (!sequenceFlow.bsim.branchingProbability) {
          reporter.report(
            sequenceFlow.id,
            "Element is lacking bsim outgoingSequenceFlow specs"
          );
          return;
        } else {
          const branchingProbability = sequenceFlow.bsim.branchingProbability;
          if (!branchingProbability || !branchingProbability.value) {
            reporter.report(
              sequenceFlow.id,
              "Element is lacking branchingProbability"
            );
            return;
          } else {
            sumProbability += parseFloat(branchingProbability.value);
          }
        }
      });
      const sumVal = 1.0;
      if (sumProbability != sumVal) {
        reporter.report(
          node.id,
          `branchingProbabilities do not add to ${sumVal.toPrecision(
            2
          )} (${sumProbability.toFixed(1)})`
        );
      }
    }
  }

  return {
    check: check,
  };
};
