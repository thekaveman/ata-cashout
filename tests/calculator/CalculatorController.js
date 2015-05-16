"use strict";

describe("CalculatorController", function() {

  beforeEach(module("ataCashout.calculator"));

  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("CalculatorController", { $scope: scope });
  }));

  describe("member", function() {
    it("should initialize with a current with empty accrued", function() {
      expect(scope.member.current).toEqual({ accrued: {} });
    });

    it("should initialize with a result that is not ready", function() {
      expect(scope.member.result).toEqual({ ready: false });
    });
  });

  describe("calc", function() {
    describe("go", function() {
      it("should make the member result ready", function() {
        expect(scope.member.result.ready).toBe(false);
        scope.calc.go();
        expect(scope.member.result.ready).toBe(true);
      });
    });

    describe("reset", function() {
      it("should reset to a current member with empty accrued", function() {
        scope.member.current = { prop1: "something", prop2: ["zero","one"] };
        scope.calc.reset();
        expect(scope.member.current).toEqual({ accrued: {} });
      });

      it("should reset to a member result that is not ready", function() {
        scope.member.result = { ready: true, something: ["one", "two"] }
        scope.calc.reset();
        expect(scope.member.result).toEqual({ ready: false });
      });
    });
  });

});
