module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    //clean up partial build results
    clean: {
      bin: ["bin/js/*.js", "!bin/js/*.min.js", "bin/css/*.css", "!bin/css/*.min.css"]
    },
    //concatenate javascript files
    concat: {
      bin: {
        files: [
          {
            src: [
              "node_modules/bootstrap/bin/css/bootstrap.min.css"
            ],
            dest: "bin/css/vendor.min.css"
          },
          {
            src: [
              "src/css/app.css"
            ],
            dest: "bin/css/app.min.css"
          },
          {
            src: [
              "node_modules/jquery/bin/jquery.min.js",
              "node_modules/bootstrap/bin/js/bootstrap.min.js",
              "node_modules/angular/angular.min.js",
              "node_modules/angular-*/angular-*.min.js",
            ],
            dest: "bin/js/vendor.min.js"
          },
          {
            src: "src/js/*.js",
            dest: "bin/js/app.js"
          }
        ]
      }
    },
    //copy static
    copy: {
      fonts: {
        expand: true,
        cwd: "node_modules/bootstrap/bin/fonts/",
        src: "*.*",
        dest: "bin/fonts/"
      },
      partials: {
        expand: true,
        cwd: "src/partials",
        src: "*.html",
        dest: "bin/partials/"
      }
    },
    //post-process HTML
    processhtml: {
      bin: {
        files: {
          "bin/index.html": "src/index.html"
        }
      }
    },
    //minify javascript files
    uglify: {
      bin: {
        files: [
          {
            src: "bin/js/app.js",
            dest: "bin/js/app.min.js"
          }
        ]
      }
    },
    //watch for changes, and run other tasks on detection
    watch: {
      main: {
        files: ["Gruntfile.js", "src/**/*.html", "src/js/*.js"],
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

  grunt.registerTask("all", ["concat", "uglify", "processhtml", "copy", "clean"])
  grunt.registerTask("default", ["all"]);
};
