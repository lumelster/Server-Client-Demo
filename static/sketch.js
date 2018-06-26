
var ctracker;
var data;
var count;
var box;
var videoInput;
var button;
var p7x;
var p7y;
var p1x;
var p1y;
var p13x;
var p13y;
var landmarks_enabled = 0;

var meta_info;

var url = "/demo";

  function setup() {

	  // setup camera capture
	  videoInput = createCapture(VIDEO);
	  videoInput.size(400, 300);
	  videoInput.position(0, 0);
	  
	  // setup canvas
	  var cnv = createCanvas(400, 300);
	  cnv.position(0, 0);

	  // setup tracker
	  ctracker = new clm.tracker();
  
	  ctracker.init(pModel);
	  ctracker.start(videoInput.elt);
	  
	  button = createButton("Landmarks");
	  button.position(0,350);
	  button.mousePressed(enable_landmarks);

	  //noStroke();
		stroke(250);
	}

	//Function to enable or disable landmarks on button clicks
	function enable_landmarks(){
	  if(landmarks_enabled){
		  landmarks_enabled = 0;
	  }else{
		  landmarks_enabled = 1;
	  }
	}

	function draw() {

	  clear();
	  // get array of face marker positions [x, y] format
	  var positions = ctracker.getCurrentPosition();

	  //If no face is found in video...
	  if(!positions){
		  console.log("No face found!");

	  }else{

	  /*
  	  Pontos para montar bounding box (olhando para a tela)
	  Ponto 1 -> Lado esquerdo da cara
	  Ponto 13 -> Lado direito da cara
	  Ponto 7 -> Ponto mais baixo da cara
	  */

	  p7x = positions[7][0]; // P7 X
	  p7y = positions[7][1]; // P7 Y
	  p1x = positions[1][0]; // P1 X
	  p1y = positions[1][1]; // P1 Y
	  p13x = positions[13][0]; // P13 X
	  p13y = positions[13][1]; // P13 Y

  //Crop face from video
  var frame_h = 2*(p7y-p1y);
  var frame_w = p13x-p1x;
  var img = videoInput.get(p1x,p1y-(p7y-p1y),frame_w,frame_h);
	
  //Encode image to base64 for JSON parsing
  var file = img.canvas.toDataURL("image/jpeg");
  //console.log(file);

//Build meta_info
meta_info = {
	"client": 'cyberlabs',
	"group": 'botafogo office',
	//"camera": params.camera || 'x',
	"models": 'face_frozen',
	"frame_w": frame_w,
	"frame_h": frame_h
};

  //Rough Bounding Box using points from facial landmarks
  line(p1x,p1y,p1x,p7y);
  line(p13x,p13y,p13x,p7y);
  line(p7x,p7y,p1x,p7y);
  line(p7x,p7y,p13x,p7y);
  line(p1x,p1y,p1x,p1y-(p7y-p1y));
  line(p1x,p1y-(p7y-p1y),p13x,p1y-(p7y-p1y));
  line(p13x,p1y-(p7y-p1y),p13x,p13y);

  if(landmarks_enabled){
  for (var i=0; i<positions.length; i++) {
		// set the color of the ellipse based on position on screen
		fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
		// draw ellipse at each position point
		ellipse(positions[i][0], positions[i][1], 8, 8);
		}
	}

	send_data(meta_info, file,url);

	}	

}

//Build and send JSON as POST Form
  function send_data(meta_info,file, url){
		var formData = new FormData();
		formData.append("meta_info", JSON.stringify(meta_info));
		formData.append("blob", file);

		let request = new XMLHttpRequest();
		
		request.open('POST',url,true);
		request.onload = function (){
			if(this.status != 200){
				console.error(request);
			}
		};
		//Build POST form data couldnt get FormData working...
		var data = "meta_info="+JSON.stringify(meta_info)+"&"+"blob="+file;
		request.send(formData);		

	}