"use strict";

beforeEach(module("ataCashout.personal", function($provide) {

}));

describe("PersonalCashout", function() {
  var member;

  beforeEach(function() {
    member = {
      serviceYears: 1,
      accrued: { personal: 7, personalBank: 10 }
    };
  });

  it("should initialize members on evaluation", inject(function(Members, PersonalCashout) {
    spyOn(Members, "initialize").and.callThrough();
    PersonalCashout.evaluate({});
    expect(Members.initialize).toHaveBeenCalled();
  }));

  it("should return member's accrued on evaluation", inject(function(PersonalCashout) {
    var result = PersonalCashout.evaluate(member);
    expect(result.accrued.personal).toBe(7);
    expect(result.accrued.personalBank).toBe(10);
  }));

  it("should evaluate to 0 cashable when no amount matches", function() {
    module(function($provide) {
     $provide.value("PersonalCashoutAmounts", [{
        minYears: Number.MAX_VALUE,
        maxYears: Number.MIN_VALUE,
        amounts: []
      }]);
    });

    inject(function(PersonalCashout) {
      var result = PersonalCashout.evaluate(member);
      expect(result.cashable).toBe(0);
    })
  });

  it("should evaluate using first matching amount", function() {
    module(function($provide) {
      $provide.value("PersonalCashoutAmounts", [{
        minYears: Number.MIN_VALUE,
        maxYears: Number.MAX_VALUE,
        amounts: {
          cashable: 1,
          carryover: 3
        }
      },{
        minYears: Number.MIN_VALUE,
        maxYears: Number.MAX_VALUE,
        amounts: {
          cashable: 2,
          carryover: 4
        }
      }]);
    });

    inject(function(PersonalCashout) {
      var result = PersonalCashout.evaluate(member);
      expect(result.cashable).toBe(1);
      expect(result.carryover).toBe(3);
    })
  });
});
