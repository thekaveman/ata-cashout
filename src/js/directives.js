(function () {
  "use strict";

  angular
    .module("ataCashout")
    .directive("accrualsPanel", accrualsPanel)
    .directive("jobPanel", jobPanel)
    .directive("resultsPanel", resultsPanel);

  function accrualsPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "partials/accruals-panel.html"
    };
  }

  function jobPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "partials/job-panel.html"
    };
  }

  function resultsPanel() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      templateUrl: "partials/results-panel.html"
    };
  }

})();
