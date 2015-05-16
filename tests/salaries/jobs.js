"use strict";

describe("Jobs", function() {
  beforeEach(module("ataCashout.salaries"));

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

  describe("JobsDecoder", function() {
    var decoder;

    beforeEach(inject(function(JobsDecoder) {
      decoder = JobsDecoder;
    }));

    it("should throw an error when content isn't base64 data", function() {
      expect(function() { decoder.decode("&%**#!)("); }).toThrowError();
    });

    it("should throw an error when decoded content isn't parsable json", inject(function($window) {
      expect(function() { decoder.decode($window.btoa("not json")); }).toThrowError();
    }));

    it("should return [] when decoded json doesn't have JobClasses", inject(function($window) {
      var content = $window.btoa(angular.toJson({ content: "something" }));
      expect(decoder.decode(content)).toEqual([]);
    }));

    it("should return decoded JobClasses", inject(function($window) {
      var data = { JobClasses: [{ Title: "one" }, { Title: "two" }] };
      var encoded = $window.btoa(angular.toJson(data));
      expect(decoder.decode(encoded)).toEqual(data.JobClasses);
    }));
  });

  describe("JobClasses", function() {

    beforeEach(module(function($provide) {
      $provide.value("BargainingUnitFilter", function(jobs, unit) {
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

    var $httpBackend;

    beforeEach(inject(function($injector, DataUrl) {
      $httpBackend = $injector.get("$httpBackend");
      $httpBackend.when("GET", DataUrl + "/file").respond(200, { data: { content: "somebase64encodedjson" } });
    }));

    afterEach(function() {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should get matching job classes", inject(function(JobClasses) {
      JobClasses.getAll("file").then(function(data) {
        expect(data.length).toBe(2);
        expect(data[0].Title).toBe("class0");
        expect(data[1].Title).toBe("class2");
      });
    }));
  });

  describe("JobPanelController", function() {
    var scope, fyMock, jobsMock;

    beforeEach(inject(function($rootScope, $controller) {
      fyMock = {
       findClosest: function() {
          return {
            then: function(callback) {
              return callback({ name: "closest" });
            }
          };
        }
      };

      jobsMock = {
        getAll: function(file) {
          return {
            then: function(callback) {
              return callback([
                { Title: "job0" }, { Title: "job1" }
              ]);
            }
          };
        }
      };

      spyOn(fyMock, "findClosest").and.callThrough();
      spyOn(jobsMock, "getAll").and.callThrough();

      scope = $rootScope.$new();
      $controller("JobPanelController", { $scope: scope, FiscalYears: fyMock, JobClasses: jobsMock });
    }));

    it("should initialize with a falsy selectedJob", function() {
      expect(scope.jobPanel.selectedJob).toBeFalsy();
    });

    it("should get all job classes", function() {
      expect(fyMock.findClosest).toHaveBeenCalled();
      expect(jobsMock.getAll).toHaveBeenCalled();
      expect(scope.jobPanel.jobs).toEqual([{ Title: "job0" }, { Title: "job1" }]);
    });

    describe("hasSelection", function() {
      it("should return true if selectedJob is truthy", function() {
        scope.jobPanel.selectedJob = { Title: "some job" };
        expect(scope.jobPanel.hasSelection()).toBe(true);
      });

      it("should return false if selectedJob is falsy", function() {
        scope.jobPanel.selectedJob = undefined;
        expect(scope.jobPanel.hasSelection()).toBe(false);
      });
    });

    describe("onJobSelect", function() {
      it("should reset the member's payRate", function() {
        scope.member = { payRate: 14.77 };

        scope.jobPanel.onJobSelect();

        expect(scope.member.payRate).toBeUndefined();
      });
    });
  });
});
