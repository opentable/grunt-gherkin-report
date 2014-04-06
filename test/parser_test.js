'use strict';

var grunt = require('grunt');
var path = require('path');

var parser = require('../tasks/parser');



var feature = "\n\n\n  @feature_tag @feature_tag1\n#a comment\n#a commented @tag\n@feature_tag2\n" +
              "Feature: Hello world\n\n\n#a comment\n\n@tag @another_tag\n" +
              "Scenario: My scenario\nGiven I am doing something\nWhen something happens" +
              "Then I should be happy";

exports.the_parser = {
  should_correctly_get_featureName: function(test) {
    test.expect(1);
    test.equal(parser.getFeatureName(feature), "Hello world");
    test.done();
  },
  should_correctly_get_Tags: function(test) {
    test.expect(1);
    test.deepEqual(parser.getFeatureTags(feature), ["feature_tag", "feature_tag1", "feature_tag2"]);
    test.done();
  },
  should_correctly_filter_by_global_tags_when_wildcard_on_inclusions: function(test){
    test.expect(1);
    test.equal(parser.filterByTags(feature, ['*'], []), feature);
    test.done();
  },
  should_correctly_filter_by_global_tags_when_no_inclusions: function(test){
    test.expect(1);
    test.equal(parser.filterByTags(feature, [], []), '');
    test.done();
  },
  should_correctly_filter_by_global_tags_when_wildcard_on_exclusions: function(test){
    test.expect(1);
    test.equal(parser.filterByTags(feature, ['feature_tag'], ['*']), '');
    test.done();
  },
  should_correctly_filter_by_global_tags_when_found_tag_on_inclusions: function(test){
    test.expect(1);
    test.equal(parser.filterByTags(feature, ['feature_tag'], []), feature);
    test.done();
  },
  should_correctly_filter_by_global_tags_when_not_found_tag_on_inclusions: function(test){
    test.expect(1);
    test.equal(parser.filterByTags(feature, ['feature_unexisting_tag'], []), '');
    test.done();
  }
};
