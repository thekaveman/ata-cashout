"use strict";
describe("cashableController", function() {
  beforeEach(module("ataCashout.results"));

  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("cashableController", { $scope: scope });
  }));

  it("should calculate cashableAmount from cashableHours and member's payRate", function() {
    scope.cashableHours = function() {
      return 5;
    };
    scope.result = {
      member: {
        payRate: 2.00
      }
    };

    expect(scope.cashableAmount()).toBe("10.00");
  });

  it("should show only when cashableHours > 0", function() {
    scope.cashableHours = function() {
      return 5;
    };

    expect(scope.show()).toBe(true);

    scope.cashableHours = function() {
      return 0;
    };

    expect(scope.show()).toBe(false);
  });
});