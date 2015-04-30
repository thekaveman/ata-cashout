(function () {
  "use strict";

  angular
    .module("ataCashout.members")
      .directive("accrualsPanel", accrualsPanel);

  function accrualsPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "members/accrualsPanel.html"
    };
  }

})();
