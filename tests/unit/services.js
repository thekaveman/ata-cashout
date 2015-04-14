"use strict";

describe("DayHours", function() {
  var dayHours;

  beforeEach(module("ataCashout", function($provide) {
    $provide.value("HoursInDay", 2);
  }));
  
  beforeEach(inject(function(_DayHours_) {
    dayHours = _DayHours_;
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
    expect(dayHours.toHours(3)).toBe(6);
  });
});