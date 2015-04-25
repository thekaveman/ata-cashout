"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataSourcesUrl", "https://api.example.com");
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
    expect(result.shortCode).toBe("FY 14/15");
    expect(result.sort).toBe("1415");
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
  var salaries, $httpBackend;

  beforeEach(module(function($provide) {
    $provide.value("FileMatcher", {
      match: function(input) {
        if(input.match) {
          return {
            shortCode: input.name,
            sort: input.name,
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

  beforeEach(inject(function(Salaries, _$httpBackend_) {
    salaries = Salaries;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it("should get matching fiscal years", inject(function(DataSourcesUrl) {
    $httpBackend.when("GET", DataSourcesUrl)
      .respond([
        {match: true, name:"fy0", download_url:"dl0"},
        {match: false, name:"fy1", download_url:"dl1"},
        {match: true, name:"fy2", download_url:"dl2"}
      ]);

    $httpBackend.expectGET(DataSourcesUrl);
    salaries.getFiscalYears().then(function(data) {
        expect(data.length).toBe(2);
        expect(data[0].shortCode).toBe("fy0");
        expect(data[0].sort).toBe("fy0");
        expect(data[0].url).toBe("dl0");
        expect(data[1].shortCode).toBe("fy2");
        expect(data[1].sort).toBe("fy2");
        expect(data[1].url).toBe("dl2");
    });
    $httpBackend.flush();
  }));

  it("should get matching job classes", inject(function(DataSourcesUrl) {
    $httpBackend.when("GET", DataSourcesUrl)
      .respond({
        jobClasses: [
          { match: true, Title:"class0" },
          { match: false, Title:"class1" },
          { match: true, Title:"class2" }
      ]});

    $httpBackend.expectGET(DataSourcesUrl);
    salaries.getJobClasses(DataSourcesUrl).then(function(data) {
        expect(data.length).toBe(2);
        expect(data[0].Title).toBe("class0");
        expect(data[1].Title).toBe("class2");
    });
    $httpBackend.flush();
  }));
});