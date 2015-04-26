"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataUrl", "https://api.example.com");
}]));

describe("ClosestFiscalYear", function() {
  var closestFY;

  beforeEach(inject(function(ClosestFiscalYear) {
    closestFY = ClosestFiscalYear;
  }));

  it("should match null for null or empty input", function() {
    expect(closestFY.filter(null)).toBeNull();
    expect(closestFY.filter([])).toBeNull();
  });

  describe("when July 1 or later", function() {
    beforeEach(function() {
      //months are base 0
      var baseTime = new Date(2015, 6, 1);
      jasmine.clock().mockDate(baseTime);
    });

    it("should match the last input", function() {
      var fiscalYears = [{id: "first"},{id:"second"},{id:"last"}];
      var match = closestFY.filter(fiscalYears);
      expect(match.id).toBe("last");
    });
  });

  describe("when June 30 or earlier", function() {
    beforeEach(function() {
      //months are base 0
      var baseTime = new Date(2015, 5, 30);
      jasmine.clock().mockDate(baseTime);
    });

    it("should match the previous fiscal year if found", function() {
      var fiscalYears = [{id: "first", code: "1415"},{id:"second", code: "1314"},{id:"last", code:"1516"}];
      expect(closestFY.filter(fiscalYears).id).toBe("first");
    });

    it("should match the last sorted fiscal year if not found", function() {
      var fiscalYears = [{id: "first", code: "1314"},{id:"second", code: "1213"},{id:"last", code:"1110"}];
      expect(closestFY.filter(fiscalYears).id).toBe("first");
    });
  });

});

describe("FileMatcher", function() {
  var matcher;

  beforeEach(inject(function(FileMatcher) {
    matcher = FileMatcher;
  }));

  it("should not match when no fiscal year in input", function() {
    var input = { name: "no-fiscal-year.json" };
    var result = matcher.match(input);
    expect(result).toBe(false);
  });

  it("should match the fiscal year from input", function() {
    var input = { name: "something-14-15-bla-bla.json" };
    var result = matcher.match(input);
    expect(result.code).toBe("1415");
    expect(result.fy).toBe("FY 14/15");
  });
});

describe("FiscalYears", function() {

  beforeEach(module(function($provide) {
    $provide.value("FileMatcher", {
      match: function(input) {
        if(input.match) {
          return {
            code: input.name,
            fy: input.name
          };
        }
        else return false;
      }
    });

    $provide.value("ClosestFiscalYear", {
      filter: function(years) {
        return [];
      }
    });
  }));

  var $httpBackend, fy;

  beforeEach(inject(function(_$httpBackend_, FiscalYears) {
    $httpBackend = _$httpBackend_;
    fy = FiscalYears;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should get all that match", inject(function(DataUrl) {
    $httpBackend.expectGET(DataUrl)
      .respond({
        data: [
          {match: true, name:"fy0"},
          {match: false, name:"fy1"},
          {match: true, name:"fy2"}
        ]
      });

    console.log(DataUrl);

    fy.getAll().then(function(data) {
        expect(data.length).toBe(2);
        expect(data[0].code).toBe("fy0");
        expect(data[0].fy).toBe("fy0");
        expect(data[0].name).toBe("fy0");
        expect(data[1].code).toBe("fy2");
        expect(data[1].fy).toBe("fy2");
        expect(data[1].name).toBe("fy2");
    });

    $httpBackend.flush();
  }));

  it("should call through to ClosestFiscalYear to filter closest", inject(function(ClosestFiscalYear) {
    spyOn(ClosestFiscalYear, "filter");
    var closest = fy.filterClosest([]);
    expect(ClosestFiscalYear.filter).toHaveBeenCalledWith([]);
  }));
});
