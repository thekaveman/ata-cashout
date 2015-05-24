"use strict";

describe("SickCashout", function() {
  beforeEach(module("ataCashout.sick", function($provide) {
    $provide.value("HoursInDay", 2);
    $provide.value("SickCashoutBank", {
        minBalance: 10
      });
  }));

  var member, sickCashout;

  beforeEach(function() {
    member = {};
  });

  it("should initialize members on evaluation", inject(function(Members, SickCashout) {
    spyOn(Members, "initialize").and.callThrough();
    SickCashout.evaluate(member);
    expect(Members.initialize).toHaveBeenCalled();
  }));

  it("should return member's accrued on evaluation", inject(function(SickCashout) {
    member.accrued = { sick: 10 };
    var result = SickCashout.evaluate(member);
    expect(result.accrued).toBe(10);
  }));

  describe("member with less than bank minBalance", function() {
    beforeEach(inject(function(SickCashout) {
      sickCashout = SickCashout;
    }));

    it("should evaluate to 0 cashable", function() {
      member.accrued = { sick: 9 };
      var result = sickCashout.evaluate(member);
      expect(result.cashable).toBe(0);
    });
  });

  describe("member with at least bank minBalance", function() {
    beforeEach(function() {
      member = {
        accrued: { sick: 15 },
        serviceYears: 1,
        used: { sick: 0 },
      };
  });

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
          //they both match, use this one
          minYears: Number.MIN_VALUE,
          maxYears: Number.MAX_VALUE,
          //cashable days indexed by used days
          amounts: [3,2,1]
        },{
          minYears: Number.MIN_VALUE,
          maxYears: Number.MAX_VALUE,
          amounts: [6,4,2]
        }]);
      });

      inject(function(SickCashout) {
        var result = SickCashout.evaluate(member);
        expect(result.cashable).toBe(6);
        expect(result.noncashable).toBe(9);
      });
    });
  });
});
