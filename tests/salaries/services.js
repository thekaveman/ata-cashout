"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataSourcesUrl", "https://api.example.com");
}]));

describe("FileMatcher", function() {
  var matcher;

  beforeEach(inject(function(FileMatcher) {
    matcher = FileMatcher;
  }));

  it("should parse false when no fiscal year in input", function() {
    var input = "no-fiscal-year.json";
    var result = matcher.parse(input);
    expect(result).toBe(false);
  });

  it("should parse the fiscal year from input", function() {
    var input = "something-14-15-bla-bla.json";
    var result = matcher.parse(input);
    expect(result.shortCode).toBe("FY 14/15");
    expect(result.sort).toBe("1415");
  });
});

describe("Salaries", function() {
  var salaries, $httpBackend;

  beforeEach(module(function($provide) {
    $provide.value("FileMatcher", {
      parse: function(input) {
        return {
          shortCode: input,
          sort: input,
        };
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

  it("should get fiscal years", inject(function(DataSourcesUrl) {
    $httpBackend.when("GET", DataSourcesUrl).respond([{name:"fy0",download_url:"dl0"},{name:"fy1",download_url:"dl1"}]);

    $httpBackend.expectGET(DataSourcesUrl);
    salaries.getFiscalYears().then(function(data) {
        expect(data.length).toBe(2);
        expect(data[0].shortCode).toBe("fy0");
        expect(data[0].sort).toBe("fy0");
        expect(data[0].url).toBe("dl0");
        expect(data[1].shortCode).toBe("fy1");
        expect(data[1].sort).toBe("fy1");
        expect(data[1].url).toBe("dl1");
    });
    $httpBackend.flush();
  }));
});