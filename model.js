var BrainJSClassifier = require('natural-brain');
var sleep = require('sleep')
module.exports = {}

module.exports.getResponseToQuestion = function(classifier,question)
{
    sleep.sleep(5);
    var res = classifier.classify(question);
    console.log(res);
    return res.label;
};

module.exports.trainClassifier = function()
{
  var classifier = new BrainJSClassifier();
  classifier.addDocument('my unit-tests failed.', 'software');
  classifier.addDocument('tried the program, but it was buggy.', 'software');
  classifier.addDocument('tomorrow we will do standup.', 'meeting');
  classifier.addDocument('the drive has a 2TB capacity.', 'hardware');
  classifier.addDocument('i need a new power supply.', 'hardware');
  classifier.addDocument('can you play some new music?', 'music');
  classifier.train();
  return classifier;
};
