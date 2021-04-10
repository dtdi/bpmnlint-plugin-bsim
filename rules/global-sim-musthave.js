const { is } = require("bpmnlint-utils");

/**
 * Rule that reports missing targetNamespace on bpmn:Definitions.
 */
module.exports = function () {
  function check(node, reporter) {
    if (is(node, "bpmn:Definitions") && !node.timetables) {
      reporter.report(node.id, "No Timetables defined");
    }

    if (
      is(node, "bpmn:Definitions") &&
      (!node.resourceData || !node.resourceData.dynamicResource)
    ) {
      reporter.report(node.id, "No ResourceData defined");
    }
    if (!is(node, "bpmn:Definitions")) return;
    const timetables = node.timetables;
    const resourceData = node.resourceData;

    if (!timetables || !resourceData) return;

    resourceData.dynamicResource.forEach((resource) => {
      if (
        is(resource, "bsim:dynamicResource") &&
        !resource.defaultTimetableId
      ) {
        reporter.report(resource.id, "No TimeTable Attached");
      }
    });
  }

  return {
    check: check,
  };
};
