'use strict';

var grunt = require('grunt');
var path = require('path');

var inputDir = path.join(__dirname, 'fixtures');
var outputDir = path.join(__dirname, 'output');

exports.after_running_task = {
  should_input_files_be_in_place: function(test) {
    test.expect(3);
    test.ok(grunt.file.exists(path.join(inputDir, 'AnotherFeature.feature')));
    test.ok(grunt.file.exists(path.join(inputDir, 'My Feature.feature')));
    test.ok(grunt.file.exists(path.join(inputDir, 'Sub Category/Feature.feature')));
    test.done();
  },
  should_the_output_files_be_produced: function(test) {
    test.expect(1);
    test.ok(grunt.file.exists(path.join(outputDir, 'report.html')));
    test.done();
  },
};
