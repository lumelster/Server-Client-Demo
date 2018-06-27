let video;
let featureExtractor;
let buttonA;
let buttonB;
let predict;
let classifier;
let train;
let num_classA = 0;
let num_classB = 0;

function setup(){
noCanvas();
video = createCapture(VIDEO);
featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
classifier = featureExtractor.classification(video);
createButtons();
}

function createButtons(){
buttonA = createButton("Class A");
buttonB = createButton("Class B");
train = createButton("Train");
predict = createButton("Predict");

buttonA.mousePressed(function(){
addImage("ClassA");
select('#ClassANum').html(num_classA++);
});

buttonB.mousePressed(function (){
	addImage("ClassB");
	select("#ClassBNum").html(num_classB++);
});

train.mousePressed(function(){
	classifier.train(function(lossValue) {
		if (lossValue) {
		  loss = lossValue;
		  select('#loss').html('Loss: ' + loss);
		} else {
		  select('#loss').html('Done Training! Final Loss: ' + loss);
		}
	  });
});

predict.mousePressed(classify);

}

function classify(){
	classifier.classify(gotResults);
}

function gotResults(result){
	select('#result').html(result);
	classify();
}

function addImage(label){
	classifier.addImage(label);
}

function modelReady(){
	select('#loading').html('Base Model Loaded!');
}