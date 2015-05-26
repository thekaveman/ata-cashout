"use strict";
describe("NoncashableController", function() {
  beforeEach(module("ataCashout.results"));

  var scope;

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("NoncashableController", { $scope: scope });
  }));

  describe("maps", function() {
    var maps;

    beforeEach(function(){
      maps = {
        descriptions: {
          stub: "stub-description"
        },
        icons: {
          stub: "stub-icon"
        }
      };
    });

    beforeEach(inject(function($controller) {
      $controller("NoncashableController", { $scope: scope, NoncashableMaps: maps });
    }));

    describe("description", function() {
      it("should pull from map if key exists", function() {
        var description = scope.description("stub");
        expect(description).toEqual("stub-description");
      });

      it("should return null if key doesn't exist", function() {
        var description = scope.description("nope");
        expect(description).toBeNull();
      });

      it("should use config key if non provided", function() {
        scope.result = { config: { noncashable: { type: "stub" } } };
        var description = scope.description();
        expect(description).toEqual("stub-description");
      });
    });

    describe("icon", function() {
      it("should pull from map if key exists", function() {
        var icon = scope.icon("stub");
        expect(icon).toContain("glyphicon-stub-icon");
      });

      it("should return null if key doesn't exist", function() {
        var icon = scope.icon("nope");
        expect(icon).toBeNull();
      });

      it("should use config key if non provided", function() {
        scope.result = { config: { noncashable: { type: "stub" } } };
        var icon = scope.icon();
        expect(icon).toContain("glyphicon-stub-icon");
      });
    });
  });

  describe("amounts", function() {
    beforeEach(function() {
      scope.result = {
        member: {
          payRate: 2.00
        }
      };
    });

    it("loss should calculate from result.loss and member's payRate", function() {
      scope.result.loss = 5;
      expect(scope.amounts.loss()).toBe("10.00");
    });

    it("loss should return 0.00 when result has no loss", function() {
      expect(scope.amounts.loss()).toBe("0.00");
    });

    it("noncashable should calculate from hours and member's payRate", function() {
      scope.hours = {
        noncashable: function() { return 5; }
      };

      expect(scope.amounts.noncashable()).toBe("10.00");
    });
  });

  describe("show", function() {
    it("should only show any when hours.noncashable() > 0", function() {
      scope.hours = {
        noncashable: function() { return 5; }
      };
      expect(scope.show.any()).toBe(true);

      scope.hours = {
        noncashable: function() { return 0; }
      };
      expect(scope.show.any()).toBe(false);
    });

    it("should only show description when description returns truthy", function() {
      scope.description = function() { return undefined; };
      expect(scope.show.description()).toBe(false);

      scope.description = function() { return null; };
      expect(scope.show.description()).toBe(false);

      scope.description = function() { return ""; };
      expect(scope.show.description()).toBe(false);

      scope.description = function() { return "a real description"; };
      expect(scope.show.description()).toBe(true);
    });

    it("should only show loss when hours.loss > 0", function() {
      scope.hours.loss = function() { return 5; };
      expect(scope.show.loss()).toBe(true);

      scope.hours.loss = function() { return 0; };
      expect(scope.show.loss()).toBe(false);
    });
  });
});