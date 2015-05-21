"use strict";

describe("VacationCashout", function() {
  beforeEach(module("ataCashout.vacation", function($provide) {
    $provide.value("HoursInDay", 2);
  }));

  var vacationCashout, member;

  beforeEach(inject(function(VacationCashout) {
    vacationCashout = VacationCashout;
    member = {};
  }));

  it("should initialize members on evaluation", inject(function(Members) {
    spyOn(Members, "initialize").and.callThrough();
    vacationCashout.evaluate({});
    expect(Members.initialize).toHaveBeenCalled();
  }));

  it("should return member's accrued on evaluation", function() {
    member.accrued = { vacation: 10 }
    var result = vacationCashout.evaluate(member);
    expect(result.accrued).toBe(10);
  });

  it("should evaluate in whole increments of hoursInDay", function() {
    member.accrued = { vacation: 5 };
    var result = vacationCashout.evaluate(member);
    expect(result.cashable).toBe(4);
    expect(result.diff).toBe(1);
  });

  describe("member with less than 10 years", function() {
    beforeEach(function() {
      member.serviceYears = 8;
      member.accrued = { vacation: 42 };
    });

    it("should be able to cash up to 40 hours", function() {
      var result = vacationCashout.evaluate(member);
      expect(result.cashable).toBe(40)
      expect(result.diff).toBe(2);
    });
  });

  describe("member with more than 10 years and less than 15 years", function() {
    beforeEach(function() {
      member.serviceYears = 12;
      member.accrued = { vacation: 62 };
    });

    it("should be able to cash up to 40 hours", function() {
      var result = vacationCashout.evaluate(member);
      expect(result.cashable).toBe(60)
      expect(result.diff).toBe(2);
    });
  });

  describe("member with 15 or more years", function() {
    beforeEach(function() {
      member.serviceYears = 20;
      member.accrued = { vacation: 82 };
    });

    it("should be able to cash up to 80 hours", function() {
      var result = vacationCashout.evaluate(member);
      expect(result.cashable).toBe(80)
      expect(result.diff).toBe(2);
    });
  });
});
