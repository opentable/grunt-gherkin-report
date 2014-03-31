'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var _ = require('underscore');

  grunt.registerMultiTask('gherkin_report', 'It saves your Cucumber/Specflow features files in a html format', function() {

    var options = this.options({});

    var content = "";
    var contentTree = {
      name: options.title,
      items: [],
      children: {}
    };

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
        if (!grunt.file.exists(path.join(f.cwd, filepath))){
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      _.forEach(validFiles, function(filepath, i){
        var fileContent = grunt.file.read(path.join(f.cwd, filepath));
        var featureName = getFeatureName(fileContent);
        grunt.log.writeln("Adding " + filepath + " scenarios...");

        var splittedPath = filepath.split(path.sep);
        var destPath = contentTree;

        for(var j = 0; j < splittedPath.length - 1; j++){
          if(!destPath.children[splittedPath[j]]){
            destPath.children[splittedPath[j]] = { items: [], children: {}};
          }

          destPath = destPath.children[splittedPath[j]];
        }

        destPath.items.push({ name: featureName, content: fileContent });
      });
    });

    var templateWithData = template.replace("{{ data }}", JSON.stringify(contentTree));

    grunt.file.write(options.destination, templateWithData);
    grunt.log.writeln('File "' + options.destination + '" created.');
  });
};
