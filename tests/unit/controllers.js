"use strict";

beforeEach(module("ataCashout"));

describe("CalculatorController", function() {
  var scope, controller;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("CalculatorController", { $scope: scope });
  }));

  it("should initialize with a member with empty accrued", function() {
    expect(scope.member).toEqual({ accrued: {} });
  });

  it("should initialize with an empty result that is not ready", function() {
    expect(scope.result).toEqual({ ready: false });
  });

  describe("calc.go", function() {
    it("should make the result ready", function() {
      expect(scope.result.ready).toBe(false);
      scope.calc.go();
      expect(scope.result.ready).toBe(true);
    });
  });

  describe("calc.reset", function() {
    it("should reset to a member with empty accrued", function() {
      scope.member = { prop1: "something", prop2: ["zero","one"] };
      scope.calc.reset();
      expect(scope.member).toEqual({ accrued: {} });
    });

    it("should reset to an empty result that is not ready", function() {
      scope.member = { prop1: "something", prop2: ["zero","one"] };
      scope.calc.reset();
      expect(scope.result).toEqual({ ready: false });
    });
  });
});
