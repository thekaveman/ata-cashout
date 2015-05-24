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

    it("should initialize with empty results", function() {
      expect(scope.member.results).toEqual([]);
    });
  });

  describe("calc", function() {
    describe("go", function() {
      it("should make the calc ready", function() {
        expect(scope.calc.ready()).toBe(false);
        scope.calc.go();
        expect(scope.calc.ready()).toBe(true);
      });
    });

    describe("ready", function() {
      it("should be false when member has no results", function() {
        scope.member.results = [];
        expect(scope.calc.ready()).toBe(false);
      });
      
      it("should be true when member has results", function() {
        scope.member.results = ["something", { else: "something" }];
        expect(scope.calc.ready()).toBe(true);
      });
    });

    describe("reset", function() {
      it("should reset to a current member with empty accrued", function() {
        scope.member.current = { prop1: "something", prop2: ["zero","one"] };
        scope.calc.reset();
        expect(scope.member.current).toEqual({ accrued: {} });
      });

      it("should reset to a member results that is empty", function() {
        scope.member.results = ["something", { else: "something" }]
        scope.calc.reset();
        expect(scope.member.results).toEqual([]);
      });

      it("should broadcast the reset message", function() {
        var messageReceived = false;
        scope.$on("reset", function() { messageReceived = true; });

        scope.calc.reset();

        expect(messageReceived).toBe(true);
      });
    });
  });
});