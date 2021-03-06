"use strict";

describe("FiscalYears", function() {
  beforeEach(module("ataCashout.salaries"));

  describe("ClosestFiscalYearFilter", function() {
    var filter;

    beforeEach(inject(function(ClosestFiscalYearFilter) {
      filter = ClosestFiscalYearFilter;
    }));

    it("should return null for null or empty input", function() {
      expect(filter(null)).toBeNull();
      expect(filter([])).toBeNull();
    });

    describe("when July 1 or later", function() {
      beforeEach(function() {
        //months are base 0
        var baseTime = new Date(2015, 6, 1);
        jasmine.clock().mockDate(baseTime);
      });

      it("should match the last input", function() {
        var fiscalYears = [{id: "first"},{id:"second"},{id:"last"}];
        var match = filter(fiscalYears);
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
        expect(filter(fiscalYears).id).toBe("first");
      });

      it("should match the last sorted fiscal year if prev not found", function() {
        var fiscalYears = [{id: "first", code: "1314"},{id:"second", code: "1213"},{id:"last", code:"1110"}];
        expect(filter(fiscalYears).id).toBe("first");
      });
    });

  });

  describe("DataFileFilter", function() {
    var filter;

    beforeEach(inject(function(DataFileFilter) {
      filter = DataFileFilter;
    }));

    it("should return [] when no fiscal year in input", function() {
      var input = [{ name: "no-fiscal-year.json" }, { name: "wrong-ext-14-15.pdf" }];
      expect(filter(input)).toEqual([]);
    });

    it("should return the matching data files from input", function() {
      var files = [
        { name: "some-thing-14-15.json" },
        { name: "12-13-bla-bla.json" },
        { name: "nope-not-me.json" },
        { name: "not-json-11-12.pdf" },
      ];
      var result = filter(files);
      expect(result.length).toBe(2);
      expect(result[0].code).toBe("1415");
      expect(result[0].fy).toBe("FY 14/15");
      expect(result[0].name).toBe("some-thing-14-15.json");
      expect(result[1].code).toBe("1213");
      expect(result[1].fy).toBe("FY 12/13");
      expect(result[1].name).toBe("12-13-bla-bla.json");
    });
  });

  describe("FiscalYears", function() {

    beforeEach(module(function($provide) {
      $provide.value("ClosestFiscalYearFilter", function(years) {
        return years.length > 0 ? years[0] : undefined;
      });

      $provide.value("DataFileFilter", function(files) {
        var matching = files.filter(function(file) {
          return file.match;
        });
        return matching;
      });
    }));

    var $httpBackend;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should get all that match", inject(function(DataUrl, FiscalYears) {
      $httpBackend.expectGET(DataUrl).respond([
        {match: true, code:"code0", fy: "fy0", name: "name0"},
        {match: false, code:"code1", fy: "fy1", name: "name1"},
        {match: true, code:"code2", fy: "fy2", name: "name2"},
      ]);

      var promise = FiscalYears.findClosest();
      var closest;

      promise.then(function(data) {
        closest = data;
      });

      $httpBackend.flush();

      expect(closest).toBeDefined();
      expect(closest.code).toEqual("code0");
      expect(closest.fy).toEqual("fy0");
      expect(closest.name).toEqual("name0");
    }));
  });
});
