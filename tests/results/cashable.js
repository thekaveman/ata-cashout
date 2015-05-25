"use strict";
describe("cashable", function() {
  beforeEach(module("ataCashout.results"));

  describe("cashableController", function() {
    var scope;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller("cashableController", { $scope: scope });
    }));

    it("should return result.cashable as cashableHours", function() {
      scope.result = { cashable: 5 };
      expect(scope.cashableHours()).toBe(5);
    });

    it("should calculate cashableAmount from cashableHours and member's payRate", function() {
      scope.cashableHours = function() {
        return 5;
      };
      scope.result = {
        member: {
          payRate: 2.00
        }
      };

      expect(scope.cashableAmount()).toBe('10.00');
    });
  });
});