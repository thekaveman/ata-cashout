"use strict";

describe("Members", function() {
  beforeEach(module("ataCashout.members"));

  var members;

  beforeEach(inject(function(Members) {
    members = Members;
  }));

  describe("by default", function() {
    var member;

    beforeEach(function() {
      member = members.default();
    });

    it("should have 0 payRate", function() {
      expect(member.payRate).toBe(0);
    });

    it("should have 0 serviceYears", function() {
      expect(member.serviceYears).toBe(0);
    });

    it("should have 0 accrued", function() {
      expect(member.accrued.holiday).toBe(0);
      expect(member.accrued.personal).toBe(0);
      expect(member.accrued.personalBank).toBe(0);
      expect(member.accrued.sick).toBe(0);
      expect(member.accrued.vacation).toBe(0);
    });

    it("should have 0 used", function() {
      expect(member.used.sick).toBe(0);
    });
  });

  describe("initialize", function() {
    it("should return the default when given empty", function() {
      var result = members.initialize(undefined);
      expect(result).toEqual(members.default());

      result = undefined;
      result = members.initialize({});
      expect(result).toEqual(members.default());
    });

    it("should always take the argument's values", function() {
      var arg = {
        payRate: 5,
        serviceYears: 5,
        accrued: {
          holiday: 5,
          personal: 5,
          personalBank: 5,
          sick: 5,
          vacation: 5
        },
        used: {
          sick: 5
        }
      };

      var result = members.initialize(arg);
      expect(result.payRate).toBe(5);
      expect(result.serviceYears).toBe(5);
      expect(result.accrued.holiday).toBe(5);
      expect(result.accrued.personal).toBe(5);
      expect(result.accrued.personalBank).toBe(5);
      expect(result.accrued.sick).toBe(5);
      expect(result.accrued.vacation).toBe(5);
    });

    it("should fill in the argument's missing values with defaults", function() {
      var arg = {
        //payRate: 5,
        //serviceYears: 5,
        accrued: {
          //holiday: 5,
          //personal: 5,
          personalBank: 5,
          sick: 5,
          vacation: 5
        },
        used: {
          //sick: 5
        }
      };
      var result = members.initialize(arg);
      expect(result.payRate).toBe(0);
      expect(result.serviceYears).toBe(0);
      expect(result.accrued.holiday).toBe(0);
      expect(result.accrued.personal).toBe(0);
      expect(result.accrued.personalBank).toBe(5);
      expect(result.accrued.sick).toBe(5);
      expect(result.accrued.vacation).toBe(5);
      expect(result.used.sick).toBe(0);
    });
  });
});