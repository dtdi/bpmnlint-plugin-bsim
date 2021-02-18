const { is } = require("bpmnlint-utils");

/**
 * Rule that validates Durations.
 */
module.exports = function () {
  function check(node, reporter) {
    if (!is(node, "bpmn:Task") && !is(node, "bpmn:StartEvent")) {
      return;
    }
    if (!node.bsim) {
      reporter.report(node.id, "No <bsim> element assigned");
      return;
    }
    const bsim = node.bsim;
    let distribution;
    let timeUnit;
    if (is(node, "bpmn:StartEvent")) {
      if (!is(bsim, "bsim:startEvent")) {
        reporter.report(node.id, "Not type of <bsim:startEvent> assigned");
        return;
      }
      if (!bsim.arrivalRate || !is(bsim.arrivalRate, "bsim:arrivalRate")) {
        reporter.report(node.id, "Not type of <bsim:arrivalRate> provide");
        return;
      }
      distribution = bsim.arrivalRate.distribution;
      timeUnit = bsim.arrivalRate.timeUnit;
    }

    if (is(node, "bpmn:Task")) {
      if (!is(bsim, "bsim:task")) {
        reporter.report(node.id, "Not type of <bsim:task> assigned");
        return;
      }
      if (!bsim.duration || !is(bsim.duration, "bsim:duration")) {
        reporter.report(node.id, "Not type of <bsim:duration> provide");
        return;
      }
      distribution = bsim.duration.distribution;
      timeUnit = bsim.duration.timeUnit;
    }
    const timeUnitMsg = checkTimeUnit(timeUnit);
    if (timeUnitMsg) {
      reporter.report(node.id, timeUnitMsg);
      return;
    }
    const distributionMsg = checkDistribution(distribution);
    if (distributionMsg) {
      reporter.report(node.id, distributionMsg);
      return;
    }

    console.log(node);
  }

  return {
    check: check,
  };
};

function checkTimeUnit(timeUnit) {
  if (
    !timeUnit ||
    !["MINUTES", "HOURS", "SECONDS", "DAYS", "MICROSECONDS"].includes(timeUnit)
  ) {
    return `${timeUnit} is no valid timeUnit`;
  }
}

function checkDistribution(dis) {
  if (!dis || !is(dis, "bsim:Distribution")) {
    return "Not type of <bsim:distribution> provided";
  }
  if (is(dis, "bsim:binomialDistribution")) {
    if (isValuesProblem(dis, ["probability", "amount"])) {
      return "Value problem for binomial distribution";
    }
    if (dis.probability.value < 0 || dis.probability.value > 1)
      return `Invalid Value provided for <bsim:probability> provided: ${dis.probability.value}`;

    return;
  }
  if (is(dis, "bsim:uniformDistribution")) {
    if (isValuesProblem(dis, ["lower", "upper"])) {
      return "Invalid Value provided for <bsim:uniformDistribution>";
    }
    if (dis.lower.value > dis.upper.value) {
      return "Lower value must be smaller than upper value <bsim:uniformDistribution>";
    }
    return;
  }
  if (is(dis, "bsim:normalDistribution")) {
    if (isValuesProblem(dis, ["mean", "standardDeviation"])) {
      return "Invalid Value provided for <bsim:normalDistribution>";
    }
    if (dis.standardDeviation.value <= 0) {
      return "Standard deviation must be > 0 <bsim:normalDistribution>";
    }
    return;
  }
  if (is(dis, "bsim:triangularDistribution")) {
    if (isValuesProblem(dis, ["lower", "upper", "peak"])) {
      return "Invalid Value provided for <bsim:triangularDistribution>";
    }
    if (
      dis.lower.value >= dis.upper.value ||
      dis.lower.value > dis.peak.value ||
      dis.peak.value > dis.upper.value
    ) {
      return "Invalid Value provided for <bsim:triangularDistribution>";
    }
    return;
  }
  if (is(dis, "bsim:constantDistribution")) {
    if (isValuesProblem(dis, "constantValue")) {
      return "Not type of <bsim:constantValue> provided for distribution";
    }
    return;
  }
  if (is(dis, "bsim:erlangDistribution")) {
    if (isValuesProblem(dis, ["order", "mean"])) {
      return "Not type of <bsim:mean> provided for distribution";
    }
    return;
  }
  if (is(dis, "bsim:arbitraryFiniteProbabilityDistribution")) {
    return;
  }
  if (is(dis, "bsim:uniformDistribution")) {
    if (isValuesProblem(dis, ["lower", "upper"])) {
      return "Invalid Value provided for <bsim:uniformDistribution>";
    }
    return;
  }
  if (is(dis, "bsim:exponentialDistribution")) {
    if (isValuesProblem(dis, "mean")) {
      return "Not type of <bsim:mean> provided for bsim:exponentialDistribution";
    }

    if (dis.mean.value < 0)
      return `Invalid value provided for <bsim:mean>: ${dis.mean.value}`;

    return;
  }
  if (is(dis, "bsim:poissonDistribution")) {
    if (isValuesProblem(dis, "mean")) {
      return "Not type of <bsim:mean> provided for distribution";
    }
    return;
  }
  return `Unknown <bsim:distribution> provided ${dis.$type}`;
}

function isValuesProblem(distribution, elements) {
  if (elements && !Array.isArray(elements)) {
    elements = [elements];
  }

  return elements.some((value) => {
    const ele = distribution.get(value);
    if (!ele && !is(ele, value)) {
      return true;
    }
    if (!ele.value || isNaN(ele.value)) {
      return true;
    }
  });
}
