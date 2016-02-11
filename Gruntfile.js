module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';',
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/dist/built.js' : ['public/dist/built.js'],
          //'public/style.css' : ['public/style.css'],
          'public/lib/backbone.js' : ['public/lib/backbone.js'],
          'public/lib/handlebars.js' : ['public/lib/handlebars.js'],
          'public/lib/jquery.js' : ['public/lib/jquery.js'],
          'public/lib/underscore.js' : ['public/lib/underscore.js'],
        }
      }
    },

    jshint: {
      files: {src: [
        'public/client/*.js', 'lib/*.js', 'app/collections/*.js', 'app/models/*.js'
      ]},
      options: {
        //force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
    'heroku-deploy': {
      production: {
        deployBranch: 'prod' //master
      },
      staging: {
        deployBranch: 'staging'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-heroku-deploy');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')){
      grunt.option('prod');
    }
    grunt.task.run(['jshint', 'test', 'heroku', 'upload']);
  });

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([''])
      //console.log('hello');
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });
  
  grunt.registerTask('heroku',[
    'concat:dist', 'uglify'
  ]);
};
