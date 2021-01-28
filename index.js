module.exports = {
  configs: {
    recommended: {
      rules: {
        "bsim/task-sim-required": "error",
      },
    },
    all: {
      rules: {
        "bsim/task-sim-required": "warn",
        "bsim/global-sim-musthave": "error",
        "bsim/sim-config-musthave": "error",
        "bsim/distribution-rules": "warn",
        "bsim/exclusiveGateway-sim-required": "warn",
      },
    },
  },
};
