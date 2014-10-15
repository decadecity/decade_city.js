/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:decade_city.js.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'src/module.js',
          'src/accessibility.js',
          'src/cookies.js',
          'src/polyfill.js',
          'src/speed_test.js',
          'src/timing.js',
          'src/profile.js',
          'src/images.js',
          'src/flickr.js'
        ],
        dest: 'dist/decade_city.js'
      }
    },
    uglify: {
      options: {
        banner: '<config:meta.banner>'
      },
      dist: {
        files: {
         'dist/decade_city.min.js': ['dist/decade_city.js']
        }
      }
    },
    qunit: {
      files: [
        'test/**/*.html'
      ]
    },
    watch: {
      options: {
        // Turning spawn off allows us to use events.
        spawn: false
      },
      files: ['grunt.js', 'src/**/*.js'],
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
        },
      },
      files: ['grunt.js', 'src/**/*.js']
    }
  });

  // For some things we want to limit the scope of the action when a file changes.
  grunt.event.on('watch', function(action, filepath) {
    if (filepath.lastIndexOf('src/', 0) === 0) {
      // If it's a source file then only hint and test that file.
      grunt.config('jshint.source.src', filepath);
      grunt.config('qunit.files', filepath.replace(/src\/(.*)\.js$/, 'test/$1.html'));
    }
    if (filepath.lastIndexOf('test/', 0) === 0) {
      // If it's a test then only hint that file and run its tests.
      grunt.config('jshint.tests.src', filepath);
      grunt.config('qunit.files', filepath.replace(/test\/(.*)\.js$/, 'test/$1.html'));
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'watch']);

};
