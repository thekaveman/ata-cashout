"use strict";

beforeEach(module("ataCashout.hours", function($provide) {
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
