module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    //clean up partial build results
    clean: {
      dist: ["dist/*.js", "!dist/*.min.js", "dist/*.css", "!dist/*.min.css"]
    },
    //concatenate javascript files
    concat: {
      dist: {
        files: {
          "dist/vendor.min.js": [
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/angular/angular.min.js",
            "node_modules/angular-*/angular-*.min.js",
          ]
        }
      }
    },
    //copy static
    copy: {
      fonts: {
        expand: true,
        cwd: "node_modules/bootstrap/dist/fonts/",
        src: "*.*",
        dest: "dist/fonts/"
      },
      partials: {
        expand: true,
        cwd: "src/",
        src: "**/*.html",
        dest: "dist/"
      },
      styles: {
        files: {
          "dist/vendor.min.css": ["node_modules/bootstrap/dist/css/bootstrap.min.css"],
        }
      },
    },
    //post-process HTML
    processhtml: {
      dist: {
        files: {
          "dist/index.html": "src/index.html"
        }
      }
    },
    //minify
    uglify: {
      dist: {
        files: {
          "dist/app.min.js": [
            "src/common/*.js",
            "src/**/*.js",
            "src/calculator/*.js",
            "src/app.js"
          ],
          "dist/app.min.css": "src/app.css",
        }
      }
    },
    //watch for changes, and run other tasks on detection
    watch: {
      main: {
        files: ["Gruntfile.js", "karma.config.js", "src/**/*.html", "src/**/*.js"],
        tasks: ["all"],
        options: {
          debounceDelay: 3000,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask("all", ["concat", "uglify", "copy", "processhtml", "clean"])
  grunt.registerTask("default", ["all"]);
};
