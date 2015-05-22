(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("resultPanel", resultPanel)
      .factory("resultPanelConfig", resultPanelConfig);

  function resultPanel() {
    return {
      restrict: "E",
      scope: {
        config: "=",
      },
      templateUrl: "results/resultPanel.html"
    };
  }

  function resultPanelConfig() {
    return {
      new: function(config) {
        return {
          heading: config.heading || "",
          id: config.id || "",
          member: config.member || {},
          nonCashableRule: config.nonCashableRule || {},
          result: config.result || {}
        };
      }
    };
  }
})();