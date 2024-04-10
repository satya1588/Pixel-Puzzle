$(document).ready(function() {
	$('#imageSelection').children('li').bind('click', function(e) {
	    $('#imageTextfield').val($(this).children('a').children('img').attr('src'));
	});
	
	$('.loadChooseUI').click(function(){
		ImagePuzzle_Utils.loadChooseUI();
		$('#gameContainer').attr('style', 'display:none');
		$('#chooseContainer').attr('style', 'display:inline');
		$('#moveCount').html('0');
		clearInterval(ImagePuzzle_Game.timerIntervalId);
	});
	
	document.getElementById('submit').addEventListener('click', function(event) {
		ImagePuzzle_Game.init();
	}, false);
	
	document.getElementById('restartButton').addEventListener('click', function(event) {
		ImagePuzzle_Utils.loadChooseUI();
		$('#gameContainer').attr('style', 'display:none');
		$('#chooseContainer').attr('style', 'display:inline');
		$('#moveCount').html('0');
	}, false);
	
	document.getElementById('help').addEventListener('click', function(event) {
		window.open('https://github.com/justc0de/imagepuzzle/wiki/How-to-play');
	}, false);
	
	$('#imageInput').on('change', function(e) {
	    var file = e.target.files[0];
	    var reader = new FileReader();
	
	    reader.onload = function(event) {
	        $('#imageTextfield').val(event.target.result);
	    };
	
	    reader.readAsDataURL(file);
	});
});


var ImagePuzzle_Utils = {
		
	startTime: null,
	notificationIntervalId: null,
	puzzlesSolved: 0,
	noOfMoves: 0,
	
	loadChooseUI: function(){
		
		$('#indexContainer').attr('style', 'display:none');
		$('#chooseContainer').attr('style', 'display:inline');
	},
	
	getStartTime: function(){
		return this.startTime;
	},
	
	setStartTime: function(startTimeTemp){
		this.startTime = startTimeTemp;
	},
	
	//remove a value from a array
	//returns an array
	removeItemFromList: function(array, removeItem) {
		array =  jQuery.grep(array, function(value) {
			return value != removeItem;
		});

		return array;
	},
	
	//get a random value from a list of elements
	//returns a random value
	randomChoice: function(list) {
		return list[Math.floor(Math.random()*list.length)];
	},
	
	
	//update text of an element
	//Parameters: The element ID, the text
	updateText: function(elementID,text) {
		document.getElementById(elementID).innerHTML = text;
	},

	
	//briefly show a notification to the user
	//Parameters: elementID to show and the duration 
	//to show in milliseconds
	notify: function(elementID,duration){
	
         //set message to show in case it has previously faded out
         $(elementID).fadeTo('fast', 1);
                                
       //ensuring notificationIntervalId is cleared
 		if (this.notificationIntervalId){
 			clearInterval(this.notificationIntervalId);
 		}
 		
	     //set message to fade out
 		this.notificationIntervalId = setTimeout(function() {
	      	$(elementID).fadeTo('fast', 0);
		  }, duration); 
	},
	

	//Get the time difference between two javascript date objects
	//Returns a string containing the time.
	diffBetweenTimes: function(beginTime, endTime){
		var timeTaken = new Date(endTime.getTime() - beginTime.getTime());
		
	 	return ImagePuzzle_Utils.formatTime(timeTaken);
	},
	
	formatTime: function(timeTaken){
		var timeTakenString = "";
		
		// calc hours
		/*if ((timeTaken.getHours() - 1) < 1)	
			timeTakenString += '00:';
		else if((timeTaken.getHours() - 1) >= 0 && (timeTaken.getHours() - 1) < 10)
			timeTakenString += '0' + (timeTaken.getHours() - 1).toString() + ':';
		else
			timeTakenString += (timeTaken.getHours() - 1).toString() + ':';*/
		
		// calc minutes
		if (timeTaken.getMinutes() < 1)
			timeTakenString += '00:';
		else if(timeTaken.getMinutes() >= 0 && timeTaken.getMinutes() < 10)
			timeTakenString += '0' + timeTaken.getMinutes().toString() + ':';
		else
			timeTakenString += timeTaken.getMinutes().toString() + ':';
		
		//calc seconds
		if (timeTaken.getSeconds() < 1)
			timeTakenString += '00.';
		else if(timeTaken.getSeconds() >= 0 && timeTaken.getSeconds() < 10)
			timeTakenString += '0' + timeTaken.getSeconds().toString() + '.';
		else
			timeTakenString += timeTaken.getSeconds().toString() + '.';
			
		//calc decisecond
		if (parseInt(timeTaken.getMilliseconds().toString()[0]) < 1)
			timeTakenString += '0';
		else
			timeTakenString += timeTaken.getMilliseconds().toString()[0];


	 	return timeTakenString;
	},
	
	initTimer: function(){

		ImagePuzzle_Utils.updateText(
	    		'timer', 
	    		ImagePuzzle_Utils.diffBetweenTimes(
	    				ImagePuzzle_Utils.startTime, 
	    				new Date()));
	},
	
	dialog: function(title, body){

		$('<div><p>' + body + '</p></div>').dialog({
	    	modal: true,
		    title: title,
		    buttons:[{ 
		    	text: "Ok", click: function() {
		    		$(this).dialog("close");
			    }
			}]
		});
	}
};
