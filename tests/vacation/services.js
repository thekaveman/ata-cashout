"use strict";

describe("VacationCashout", function() {
  beforeEach(module("ataCashout.vacation", function($provide) {
    $provide.value("HoursInDay", 2);
  }));

  var vacationCashout, member;

  beforeEach(inject(function(VacationCashout) {
    vacationCashout = VacationCashout;
    member = {
      accrued: { vacation: 5 }
    };
  }));

  it("should initialize members on evaluation", inject(function(Members) {
    spyOn(Members, "initialize").and.callThrough();
    vacationCashout.evaluate({});
    expect(Members.initialize).toHaveBeenCalled();
  }));

  it("should return member's accrued on evaluation", function() {
    var result = vacationCashout.evaluate(member);
    expect(result.accrued).toBe(5);
  });

  it("should evaluate in whole increments of hoursInDay", function() {
    var result = vacationCashout.evaluate(member);
    expect(result.cashable).toBe(4);
    expect(result.diff).toBe(1);
  });
});
