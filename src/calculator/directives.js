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
      templateUrl: "calculator/accrualsPanel.html"
    };
  }

  function jobPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "calculator/jobPanel.html"
    };
  }

  function resultsPanel() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      templateUrl: "calculator/resultsPanel.html"
    };
  }

})();
