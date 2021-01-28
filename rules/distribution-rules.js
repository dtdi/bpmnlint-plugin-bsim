const { is } = require("bpmnlint-utils");

function isValidNumber(num) {
  return num && !isNaN(num);
}

/**
 * Rule that reports erroreous Distributions
 */
module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "bsim:Distribution")) return;

    const bpmnEle = node.$parent.$parent.bpmnElement;
    if (!is(bpmnEle, "bpmn:Task")) return;

    // binomial
    if (is(node, "bsim:binomialDistribution")) {
      if (
        !isValidNumber(node.propability) ||
        node.propability < 0 ||
        node.propability > 1
      ) {
        reporter.report(
          bpmnEle.id,
          `binomialDistribution has no valid propability`
        );
      }
      if (!isValidNumber(node.amount)) {
        reporter.report(
          bpmnEle.id,
          `binomialDistribution has no valid propability`
        );
      }
    }

    // constant
    if (
      is(node, "bsim:constantDistribution") &&
      (!node.constantValue || !isValidNumber(node.constantValue.value))
    ) {
      reporter.report(
        bpmnEle.id,
        `constantDistribution has no valid constantValue`
      );
    }

    // exponential
    if (
      is(node, "bsim:exponentialDistribution") &&
      (!node.mean || !isValidNumber(node.mean.value) || node.mean.value < 0)
    ) {
      reporter.report(bpmnEle.id, `exponentialDistribution has no valid mean`);
    }
  }

  return {
    check: check,
  };
};
