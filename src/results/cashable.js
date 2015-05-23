(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("cashable", cashable);

  function cashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      templateUrl: "results/cashable.html"
    };
  }
})();