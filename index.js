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
        "bsim/exclusiveGateway-sim-required": "warn",
        "bsim/duration-values": "warn",
      },
    },
  },
};
