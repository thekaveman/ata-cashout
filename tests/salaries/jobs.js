"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataUrl", "https://api.example.com");
}]));

describe("BargainingUnitFilter", function() {
  var filter;

  beforeEach(inject(function(BargainingUnitFilter) {
    filter = BargainingUnitFilter;
  }));

  it("should return [] given null or empty", function() {
    var result = filter([], "code");
    expect(result).toEqual([]);
  });

  it("should filter for matching BargainingUnit Codes", function() {
    var jobs = [
      { BargainingUnit:  { Code: "match" } },
      { BargainingUnit:  { Code: "don't match" } },
      { BargainingUnit:  { Code: "match" } }
    ];
    var result = filter(jobs, "match");
    expect(result.length).toBe(2);
  });
});

describe("JobClasses", function() {

  beforeEach(module(function($provide) {
    $provide.value("BargainingUnitFilter", function(jobs) {
      return jobs.filter(function(job) {
        return job.match;
      });
    });

    $provide.value("JobsDecoder", {
      decode: function(content) {
        return [
          { match: true, Title:"class0" },
          { match: false, Title:"class1" },
          { match: true, Title:"class2" }
        ];
      }
    });
  }));

  var $httpBackend, jobs;

  beforeEach(inject(function(_$httpBackend_, JobClasses) {
    $httpBackend = _$httpBackend_;
    jobs = JobClasses;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should get matching job classes", inject(function(DataUrl) {
    $httpBackend.expectGET(DataUrl + "/file")
      .respond({
        data: {
          content: "somebase64encodedjson"
        }
      });

    jobs.getAll("file").then(function(data) {
      expect(data.length).toBe(2);
      expect(data[0].Title).toBe("class0");
      expect(data[1].Title).toBe("class2");
    });

    $httpBackend.flush();
  }));
});
