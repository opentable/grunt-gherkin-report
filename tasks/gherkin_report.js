'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var _ = require('underscore');

  grunt.registerMultiTask('gherkin_report', 'It saves your specflow features files in a html format', function() {

    var options = this.options({});

    var content = "";
    var template = grunt.file.read(path.join(__dirname, 'template.html'));

    this.files.forEach(function(f) {

      var fileContent = f.src.filter(function(filepath) {

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      _.forEach(fileContent, function(filepath){
        grunt.log.writeln("Adding " + filepath + "features...");
        content += "<pre><code class=\"gherkin\">\n" + grunt.file.read(filepath) + "\n</code></pre>";
      });
    });

    var templateWithData = template.replace("{{ title }}", options.title).replace("{{ data }}", content);

    grunt.file.write(options.destination, templateWithData);

    grunt.log.writeln('File "' + options.destination + '" created.');

  });

};
