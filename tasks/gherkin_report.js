'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var _ = require('underscore');

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

  var createNodeStructure = function(root, nodePath){

    var splittedPath = nodePath.split('/');
    var destPath = root;

    for(var j = 0; j < splittedPath.length - 1; j++){
      if(!destPath.children[splittedPath[j]]){
        destPath.children[splittedPath[j]] = { 
          items: [], 
          children: {}
        };
      }
      
      destPath = destPath.children[splittedPath[j]];
    }
     
    return destPath;   
  };

  var getContentTree = function(files, options){

    var contentTree = {
      name: options.title,
      subtitle: options.subtitle,
      items: [],
      children: {}
    };

    files.forEach(function(f) {

      var validFiles = f.src.filter(function(filepath) {
        if (!grunt.file.exists(path.join(f.cwd, filepath))){
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      _.forEach(validFiles, function(filepath, i){
        grunt.log.writeln("Adding " + filepath + " scenarios...");

        var fileContent = grunt.file.read(path.join(f.cwd, filepath)),
            featureName = getFeatureName(fileContent),
            destPath = createNodeStructure(contentTree, filepath);

        destPath.items.push({ 
          name: featureName, 
          content: fileContent, 
          fileName: filepath
        });
      });
    });
    
    return contentTree;
  };

  grunt.registerMultiTask('gherkin_report', 'It saves your Cucumber/Specflow features files in a html format', function() {

    var options = this.options({}),
        data = JSON.stringify(getContentTree(this.files, options)),
        template = grunt.file.read(path.join(__dirname, 'template.html')),
        templateWithData = template.replace("{{ data }}", data);

    grunt.file.write(options.destination, templateWithData);
    
    grunt.log.writeln('File "' + options.destination + '" created.');
  });
};
