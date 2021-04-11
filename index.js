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
        "bsim/exclusiveGateway-sim-required": "error",
        "bsim/duration-values": "warn",
        "bsim/lane-participant-unmatch": "warn",
      },
    },
  },
};
