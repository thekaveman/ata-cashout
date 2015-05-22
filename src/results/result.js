(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("result", result);

  function result() {
    return {
      restrict: "E",
      scope: {
        heading: "@",
        member: "=",
        nonCashableRule: "=",
        result: "=",
      },
      templateUrl: "results/result.html"
    };
  }
})();