"use strict";

beforeEach(module("ataCashout.sick", function($provide) {
  $provide.value("HoursInDay", 2);
}));

describe("SickCashout", function() {
  var member, sickCashout;

  it("should initialize members on evaluation", inject(function(Members, SickCashout) {
    spyOn(Members, "initialize").and.callThrough();
    SickCashout.evaluate({});
    expect(Members.initialize).toHaveBeenCalled();
  }));

  describe("member with less than 12 hours banked", function() {
    beforeEach(inject(function(SickCashout) {
      sickCashout = SickCashout;
      member = {
        accrued: { sick: 10 },
        serviceYears: 1,
        used: { sick: 0 },
      };
    }));

    it("should return member's accrued on evaluation", function() {
      var result = sickCashout.evaluate(member);
      expect(result.accrued).toBe(10);
    });

    it("should evaluate to 0 cashable when member has less than 12 hours banked", function() {
      var result = sickCashout.evaluate(member);
      expect(result.cashable).toBe(0);
    });
  });

  describe("member with at least 12 hours banked", function() {
    beforeEach(function() {
      member = {
          accrued: { sick: 15 },
          serviceYears: 1,
          used: { sick: 0 },
      };
  });

    it("should return member's accrued on evaluation", inject(function(SickCashout) {
      var result = SickCashout.evaluate(member);
      expect(result.accrued).toBe(15);
    }));

    it("should evaluate to 0 cashable when no amount matches", function() {
      module(function($provide) {
        $provide.value("SickCashoutAmounts", [{
          minYears: Number.MAX_VALUE,
          maxYears: Number.MIN_VALUE,
          amounts: []
        }]);
      });

      inject(function(SickCashout) {
        var result = SickCashout.evaluate(member);
        expect(result.cashable).toBe(0);
      });

      
    });

    it("should evaluate using first matching amount", function() {
      module(function($provide) {
        $provide.value("SickCashoutAmounts", [{
          minYears: Number.MIN_VALUE,
          maxYears: Number.MAX_VALUE,
          amounts: [3,3,3]
        },{
          minYears: Number.MIN_VALUE,
          maxYears: Number.MAX_VALUE,
          amounts: [5,5,5]
        }]);
      });

      inject(function(SickCashout) {
        var result = SickCashout.evaluate(member);
        expect(result.cashable).toBe(6);
        expect(result.diff).toBe(9);
      });
    });
  });
});
