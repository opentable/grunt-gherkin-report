'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var _ = require('underscore');

  grunt.registerMultiTask('gherkin_report', 'It saves your Cucumber/Specflow features files in a html format', function() {

    var options = this.options({});

    var content = "";
    var template = grunt.file.read(path.join(__dirname, 'template.html'));

    var getFeatureName = function(fileContent){
      var lines = fileContent.split("\n");

      for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        if(line.indexOf('Feature:') >= 0){
          return line.replace('Feature:', '').trim();
        }
      }
      return "Unnamed feature";
    };

    this.files.forEach(function(f) {

      var validFiles = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      _.forEach(validFiles, function(filepath, i){
        var fileContent = grunt.file.read(filepath);
        grunt.log.writeln("Adding " + filepath + " scenarios...");
        content += "<div id=\"feature" + i + "\"><a class=\"title\" href=\"#\">" + getFeatureName(fileContent) + "</a>";
        content += "<pre class=\"feature hide\"><code class=\"gherkin\">\n" + fileContent + "\n</code></pre></div>";
      });
    });

    var templateWithData = template.replace("{{ title }}", options.title).replace("{{ data }}", content);

    grunt.file.write(options.destination, templateWithData);
    grunt.log.writeln('File "' + options.destination + '" created.');

  });
};
