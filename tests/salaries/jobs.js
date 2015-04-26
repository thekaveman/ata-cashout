"use strict";

beforeEach(module("ataCashout.salaries", ["$provide", function($provide) {
  $provide.value("DataUrl", "https://api.example.com");
}]));

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

describe("JobClasses", function() {

  beforeEach(module(function($provide) {
    $provide.value("JobsDecoder", {
      decode: function(content) {
        return [
          { match: true, Title:"class0" },
          { match: false, Title:"class1" },
          { match: true, Title:"class2" }
        ];
      }
    });

    $provide.value("JobMatcher", {
      match: function(job) {
        return job.match;
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
