/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // QUnit with istambul code coverage.
    qunit: {
      options: {
        coverage: {
          disposeCollector: true,
          src: ['src/**/*.js'],
          instrumentedFiles: 'tmp/',
          htmlReport: 'report/coverage',
          linesThresholdPct: 90,
          statementsThresholdPct: 90,
          functionsThresholdPct: 90,
          branchesThresholdPct: 90
        }
      },
      files: ['test/**/*.html']
    },
    watch: {
      options: {
        // Turning spawn off allows us to use events.
        spawn: false
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        'etc/*.js'
      ],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        loopfunc: true,
        globals: {
          jQuery: true,
          define: true
        }
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        'ect/*.js'
      ]
    }
  });

  // For some things we want to limit the scope of the action when a file changes.
  grunt.event.on('watch', function(action, filepath) {
    // Use this to clear the code coverage thresholds. If we're testing one
    // file it's not all that useful due to dependencies.
    function dropCoverageThresholds() {
      grunt.config('qunit.options.coverage.linesThresholdPct', 0);
      grunt.config('qunit.options.coverage.statementsThresholdPct', 0);
      grunt.config('qunit.options.coverage.functionsThresholdPct', 0);
      grunt.config('qunit.options.coverage.branchesThresholdPct', 0);
    }

    if (filepath.lastIndexOf('src/', 0) === 0) {
      // If it's a source file then only hint and test that file.
      grunt.config('jshint.source.src', filepath);
      grunt.config('qunit.files', filepath.replace(/src\/(.*)$/, 'test/$1_test.html'));
      dropCoverageThresholds();
    }
    if (filepath.lastIndexOf('test/', 0) === 0) {
      // If it's a test then only hint that file and run its tests.
      grunt.config('jshint.tests.src', filepath);
      grunt.config('qunit.files', filepath.replace(/test\/(.*).js$/, 'test/$1.html'));
      dropCoverageThresholds();
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  // Default task.
  grunt.registerTask('default', ['test', 'watch']);
  // Test task
  grunt.registerTask('test', ['jshint', 'qunit']);

};
