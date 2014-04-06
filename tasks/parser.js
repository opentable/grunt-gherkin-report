var _ = require('underscore');

module.exports = {
  getLines: function(fileContent){
    return fileContent.split("\n");
  },
  getFeatureLine: function(lines){
    for(var i = 0; i < lines.length; i++){
      var line = lines[i];
      if(line.indexOf('Feature:') >= 0){
        return i;
      }
    }
  },
  getFeatureName: function(fileContent){
    var lines = this.getLines(fileContent),
        featureLine = this.getFeatureLine(lines),
        featureName = featureLine >= 0 ? lines[featureLine].replace('Feature:', '').trim() : '';

    return featureName !== '' ? featureName : 'UnNamed feature';
  },
  getFeatureTags: function(fileContent){
    var lines = this.getLines(fileContent),
        featureLine = this.getFeatureLine(lines),
        tags = [];

    for(var i = 0; i < featureLine; i++){
      var trimmedLine = lines[i].trim();
      var words = trimmedLine.split(" ");
      for(var j = 0; j < words.length; j++){
        var word = words[j];
        if(word.length > 1 && word.substr(0, 1) === "@"){
          tags.push(word.substr(1));
        } else {
          break;
        }
      }
    }

    return tags;
  },
  filterByTags: function(fileContent, inclusions, exclusions){
    var featureTags = this.getFeatureTags(fileContent);

    // first the inclusions
    if(!_.contains(inclusions, '*')){
      var found = false;
      _.forEach(inclusions, function(inclusion){
        if(_.contains(featureTags, inclusion)){
          found = true;
        }
      });
      if(!found){
        return "";
      }
    }

    // then the exclusions
    if(_.contains(exclusions, '*')){
      return "";
    }

    return fileContent;
  }
};
