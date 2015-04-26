"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataUrl", "https://api.example.com");
}]));

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

describe("FiscalYearMatcher", function() {
  var matcher;

  beforeEach(inject(function(FiscalYearMatcher) {
    matcher = FiscalYearMatcher;
  }));

  it("should match null for null or empty input", function() {
    expect(matcher.match(null)).toBeNull();
    expect(matcher.match([])).toBeNull();
  });

  describe("when July 1 or later", function() {
    beforeEach(function() {
      //months are base 0
      var baseTime = new Date(2015, 6, 1);
      jasmine.clock().mockDate(baseTime);
    });

    it("should match the last input", function() {
      var fiscalYears = [{id: "first"},{id:"second"},{id:"last"}];
      var match = matcher.match(fiscalYears);
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
      var fiscalYears = [{id: "first", sort: "1415"},{id:"second", sort: "1314"},{id:"last", sort:"1516"}];
      expect(matcher.match(fiscalYears).id).toBe("first");
    });

    it("should match the last sorted fiscal year if not found", function() {
      var fiscalYears = [{id: "first", sort: "1314"},{id:"second", sort: "1213"},{id:"last", sort:"1110"}];
      expect(matcher.match(fiscalYears).id).toBe("first");
    });
  });

});

describe("JobMatcher", function() {
  var matcher;

  beforeEach(inject(function(JobMatcher) {
    matcher = JobMatcher;
  }));

  it("should match false when BargainingUnit Code is not ATA", function() {
    var job = { BargainingUnit: { Code: "NotATA" } };
    var result = matcher.match(job);
    expect(result).toBe(false);
  });

  it("should match true when BargainingUnit Code is ATA", function() {
    var job = { BargainingUnit:  { Code: "ATA" } };
    var result = matcher.match(job);
    expect(result).toBe(true);
  });
});

describe("Salaries", function() {

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

    $provide.value("JobMatcher", {
      match: function(job) {
        return job.match;
      }
    });
  }));

  describe("$http", function() {

    //mock the $window.atob function for getJobClasses
    beforeEach(module(function($provide) {
      $provide.value("$window", {
        atob: function(input) {
          return {
            JobClasses: [
              { match: true, Title:"class0" },
              { match: false, Title:"class1" },
              { match: true, Title:"class2" }
          ]};
        }
      });
    }));

    var $httpBackend, salaries;

    beforeEach(inject(function(_$httpBackend_, Salaries) {
      $httpBackend = _$httpBackend_;
      salaries = Salaries;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should get matching fiscal years", inject(function(DataUrl) {
      $httpBackend.when("GET", DataUrl)
        .respond([
          {match: true, name:"fy0"},
          {match: false, name:"fy1"},
          {match: true, name:"fy2"}
        ]);

      $httpBackend.expectGET(DataUrl);

      salaries.getFiscalYears().then(function(data) {
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

    it("should get matching job classes", inject(function(DataUrl) {
      $httpBackend.when("GET", DataUrl + "/file").respond({ data: { content: "somebase64encodedjson" }});

      $httpBackend.expectGET(DataUrl+"/file");

      salaries.getJobClasses("file").then(function(data) {
          expect(data.length).toBe(2);
          expect(data[0].Title).toBe("class0");
          expect(data[1].Title).toBe("class2");
      });

      $httpBackend.flush();
    }));
  });

  it("should call through to FiscalYearMatcher to get closest", inject(function(FiscalYearMatcher,Salaries) {
    spyOn(FiscalYearMatcher, "match");
    var closest = Salaries.getClosestFiscalYear([]);
    expect(FiscalYearMatcher.match).toHaveBeenCalledWith([]);
  }));
});