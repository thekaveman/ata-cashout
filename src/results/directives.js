(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("cashable", cashable)
      .directive("noncashable", noncashable)
      .directive("result", result);

  function cashable() {
    return {
      restrict: "E",
      scope: {
        member: "=",
        result: "="
      },
      templateUrl: "results/cashable.html"
    };
  }

  function noncashable() {
    return {
      restrict: "E",
      scope: {
        member: "=",
        result: "=",
        rule: "="
      },
      templateUrl: "results/noncashable.html"
    };
  }

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