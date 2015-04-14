"use strict";

beforeEach(module("ataCashout", function($provide) {
  $provide.value("HoursInDay", 2);
}));

describe("DayHours", function() {
  var dayHours;

  beforeEach(inject(function(DayHours) {
    dayHours = DayHours;
  }));

  it("should convert hours to whole days", function() {
    expect(dayHours.toWholeDays(0)).toBe(0);
    expect(dayHours.toWholeDays(2)).toBe(1);
    expect(dayHours.toWholeDays(4.5)).toBe(2);
    expect(dayHours.toWholeDays(5)).toBe(2);
  });

  it("should convert days to hours", function() {
    expect(dayHours.toHours(0)).toBe(0);
    expect(dayHours.toHours(1)).toBe(2);
    expect(dayHours.toHours(2)).toBe(4);
  });
});

describe("SickCashout", function() {
  var sickCashout, member;

  beforeEach(function() {
    member = {
        accruals: { sick: 10 },
        serviceYears: 1,
        used: { sick: 0 },
    };
  });

  it("should take member's accruals on evaluation", function() {
    inject(function(SickCashout) {
      sickCashout = SickCashout;
    });

    var result = sickCashout.evaluate(member);
    expect(result.accrued).toBe(10);
  });

  it("should evaluate to 0 cashable when no rule matches", function() {
    module(function($provide) {
      $provide.value("SickCashoutRules", [{
        minYears: Number.MAX_VALUE,
        maxYears: Number.MIN_VALUE,
        usedToCashableDays: []
      }]);
    });

    inject(function(SickCashout) {
      sickCashout = SickCashout;
    });

    var result = sickCashout.evaluate(member);
    expect(result.cashable).toBe(0);
  });

  it("should evaluate using first matching rule", function() {
    module(function($provide) {
      $provide.value("SickCashoutRules", [
      {
        minYears: Number.MIN_VALUE,
        maxYears: Number.MAX_VALUE,
        usedToCashableDays: [3,3,3]
      },
      {
        minYears: Number.MIN_VALUE,
        maxYears: Number.MAX_VALUE,
        usedToCashableDays: [5,5,5]
      }]);
    });

    inject(function(SickCashout) {
      sickCashout = SickCashout;
    });

    var result = sickCashout.evaluate(member);
    expect(result.cashable).toBe(6);
    expect(result.diff).toBe(4);
  });
});
