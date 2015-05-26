"use strict";
describe("resultsPanelController", function() {
  beforeEach(module("ataCashout.results"));

  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("resultsPanelController", { $scope: scope });
  }));

  describe("when result has no noncashable hours", function() {
    beforeEach(function() {
      scope.result= { noncashable: 0 };
    });

    it("should give cashable 8 md cols", function() {
      expect(scope.cols.cashable.number()).toBe(8);
      expect(scope.cols.cashable.class()).toBe("col-md-8");
    });

    it("should calculate 0 noncashable cols", function() {
      expect(scope.cols.noncashable.number()).toBe(0);
      expect(scope.cols.noncashable.class()).toBe(null);
    });
  });

  describe("when result has noncashable hours", function() {
    beforeEach(function() {
      scope.result= { noncashable: 1 };
    });

    it("should give cashable 5 md cols", function() {
      expect(scope.cols.cashable.number()).toBe(5);
      expect(scope.cols.cashable.class()).toBe("col-md-5");
    });

    it("should calculate noncashable md cols out of 12 possible", function() {
      //the number of cols to use for cashable
      scope.cols.cashable.number = function() { return 2; };
      //12 - 2 = 10;
      expect(scope.cols.noncashable.number()).toBe(10);
      expect(scope.cols.noncashable.class()).toBe("col-md-10");
    });
  });
});