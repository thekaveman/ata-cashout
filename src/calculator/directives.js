(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("accrualsPanel", accrualsPanel)
      .directive("jobPanel", jobPanel)
      .directive("resultsPanel", resultsPanel);

  function accrualsPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "calculator/accruals-panel.html"
    };
  }

  function jobPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "calculator/job-panel.html"
    };
  }

  function resultsPanel() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      templateUrl: "calculator/results-panel.html"
    };
  }

})();
