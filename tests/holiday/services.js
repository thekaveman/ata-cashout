"use strict";

beforeEach(module("ataCashout.holiday", function($provide) {
  $provide.value("CashableHolidayHours", 2);
}));

describe("HolidayCashout", function() {
  var holidayCashout, member;

  beforeEach(inject(function(HolidayCashout) {
    holidayCashout = HolidayCashout;
  }));

  it("should initialize members on evaluation", inject(function(Members) {
    spyOn(Members, "initialize").and.callThrough();
    holidayCashout.evaluate({});
    expect(Members.initialize).toHaveBeenCalled();
  }));

  it("should return member's accrued on evaluation", function() {
    var member = {
      accrued: { holiday: 7 }
    };

    var result = holidayCashout.evaluate(member);
    expect(result.accrued).toBe(7);
  });

  it("should evaluate accred as cashable when < cashableHours", inject(function(CashableHolidayHours) {
    var member = {
      accrued: { holiday: CashableHolidayHours * 5 }
    };

    var result = holidayCashout.evaluate(member);
    expect(result.cashable).toBe(CashableHolidayHours);
  }));

  it("should evaluate cashableHours as cashable when accrued >= cashableHours", inject(function(CashableHolidayHours) {
    var member = {
      accrued: { holiday: CashableHolidayHours + 2 }
    };

    var result = holidayCashout.evaluate(member);
    expect(result.cashable).toBe(CashableHolidayHours);
    expect(result.diff).toBe(2);
  }));
});
