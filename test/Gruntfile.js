module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		mocha_istanbul: {
			coverage: {
				src: 'test',
				options: {
					timeout: 30000,
					ignoreLeaks: false,
					check: {
						statements: 85,
						branches: 79,
						functions: 89,
						lines: 85
					}
				}
			}
		},
		// jshint: {
		// 	options: {
		// 		jshintrc: true
		// 	},
		// 	src: ['lib/**/*.js', 'test/**/*.js']
		// },
		clean: ['tmp']
	});

	// Load grunt plugins for modules.
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Register tasks.
	grunt.registerTask('default', ['mocha_istanbul:coverage', 'clean']);

};