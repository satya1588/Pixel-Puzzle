var ImagePuzzle_Game = {
	blankRow: 0,
	blankCol: 0,
	idCounter: null,
	score: null,
	imgsrc: null,
	rowCount: null,
	target: null,
	timerIntervalId: 0,
	move_snd: new Audio("sounds/move1.wav"),
	shuffle_snd: new Audio("sounds/shuffle1.wav"),
	win_snd: new Audio("sounds/success1.wav"),
	
	init: function(){
		ImagePuzzle_Game.imgsrc = document.getElementById('imageTextfield').value.replace("preview", "stock");
		ImagePuzzle_Game.rowCount = $('#gridSize :radio:checked').val();
		
		$('#chooseContainer').attr('style', 'display:none');
		$('#gameContainer').attr('style', 'display:inline');	
		
		newGame(ImagePuzzle_Game.imgsrc, ImagePuzzle_Game.rowCount);

		function newGame(imgsrc, rowCount){
			ImagePuzzle_ImageActions.loadImage(imgsrc, function(loadedImage){
				ImagePuzzle_ImageActions.resize(loadedImage, function(imageResizedOnCanvas){
					var canvasReady = ImagePuzzle_ImageActions.split(imageResizedOnCanvas, rowCount * rowCount);
					var tilesAvailable = new Array(rowCount ^ 2);
					
					for (var i = 0; i < canvasReady.length; i++) {
						tilesAvailable[i] = i;
					}
					
					var $tbl = $('<table border="1">').attr('id', 'grid'),
						$tbody = $('<tbody>').attr('id', 'tableBody'),
						index = 0;
					
					for (var i = 0; i < rowCount; i++) {
						var trow = $("<tr>").attr('id', 'row' + i);
						
						for (var j = 0; j < rowCount; j++) {
							var $cell = $('<td data-transition="flow">').append(canvasReady[index]);
							$cell.attr('id','cell' + index);
							
							if(index == ((canvasReady.length -1))){
								blankRow = i;
								blankCol = j;
							}
							
							$cell.appendTo(trow); 
							index++;
						}
						
						trow.appendTo($tbody);
						$tbl.append($tbody);
						$('table').remove();	
						$('#gridContainer').html($tbl);
					}
					
					$('#grid tr:eq(' + blankRow + ') td:eq(' + blankCol + ')').children().hide();
					$('#grid tr:eq(' + blankRow + ') td:eq(' + blankCol + ')').attr('id', 'blankCell');
					
					if ($('#mute').val() === 'off'){
						ImagePuzzle_Game.shuffle_snd.play();
					}
					
					ImagePuzzle_Utils.setStartTime(new Date());
					
					if (ImagePuzzle_Game.timerIntervalId){
						clearInterval(this.timerIntervalId);
					}
					
					ImagePuzzle_Utils.noOfMoves = 0;
					ImagePuzzle_Game.timerIntervalId = setInterval(ImagePuzzle_Utils.initTimer, 100);
					ImagePuzzle_Game.target = ImagePuzzle_Game.rowCount * ImagePuzzle_Game.rowCount;
					
					jumblePuzzle(rowCount);
					
					return false;
				});
			});
		}
	},
	
	moveEmptyCell: function(ex, ey, direction){
		var cellid = "";	  
		
		if(direction == 'u'){ //up
			cellid =document.getElementById("row"+(ey-1)).childNodes[ex].id;
		} else if (direction == 'd'){ //down
			cellid  =document.getElementById("row"+(ey+1)).childNodes[ex].id;
		} else if (direction == 'l'){ //left
			cellid =document.getElementById("row"+ey).childNodes[ex-1].id;
		} else{ //right
			cellid =document.getElementById("row"+ey).childNodes[ex+1].id;
		}
		
		var cell = $("#"+cellid).get(0),
			currow = cell.parentNode,
			empty = $("#blankCell").get(0),
			emptyrow = empty.parentNode,
			afterempty = empty.nextSibling,
			afterthis = cell.nextSibling;
		
		currow.insertBefore(empty, afterthis); 
		emptyrow.insertBefore(cell, afterempty);
	},
	
	getPossibleDirections: function(ex, ey, rowCount){
		var max = rowCount -1,
			min = 0; 
		
		if(ex == min && ey == min){
			return ['r','d'];
		}
		else if(ex == min && ey == max){
			return ['r','u'];
		}
		else if(ex == max && ey == min){
			return ['l','d'];
		}
		else if(ex == max && ey == max){
			return ['l','u'];
		}
		else if(ex == min && (ey > min  && ey < max)){
			return ['r','u','d'];
		}
		else if(ex == max && (ey > min  && ey < max)){
			return ['l','u','d'];
		}
		else if(ey == max && (ex > min  && ex < max)){
			return ['l','r','u'];
		}
		else if(ey == min && (ex > min  && ex < max)){
			return ['l','r','d'];
		}
		else{
			return ['l','r','u','d'];
		}
	},
	
	jumblePuzzle: function(rowCount){
		var prevDir = null;
		
		for (var i = 0; i < rowCount * rowCount * 2; i++){
			var empty = $("#blankCell").get(0),
				emptyrow = empty.parentNode,
				ex = empty.cellIndex,
				ey = emptyrow.rowIndex;
			
			var dirs = ImagePuzzle_Game.getPossibleDirections(ex, ey, rowCount);
			
			if (prevDir != null){
				if (prevDir == 'u')
					dirs = ImagePuzzle_Utils.removeItemFromList(dirs,'d');
				else if (prevDir == 'd')
					dirs = ImagePuzzle_Utils.removeItemFromList(dirs,'u');
				else if (prevDir == 'r')
					dirs = ImagePuzzle_Utils.removeItemFromList(dirs,'l');
				else
					dirs = ImagePuzzle_Utils.removeItemFromList(dirs,'r');
			}
			
			var randDir = ImagePuzzle_Utils.randomChoice(dirs);
			prevDir = randDir; 
			ImagePuzzle_Game.moveEmptyCell(ex, ey, randDir);
		}
	},
	
	updateGameState: function(){
		ImagePuzzle_Utils.noOfMoves++;
		
		if ($('#mute').val() === 'off') {
			ImagePuzzle_Game.move_snd.play();
		}
		
		ImagePuzzle_Utils.updateText('moveCount', ImagePuzzle_Utils.noOfMoves);
		
		ImagePuzzle_Game.idCounter = 0;
		ImagePuzzle_Game.score = 0;
		
		$("td").each(function() {
			if ($(this).children().attr("id") == "canvas" + ImagePuzzle_Game.idCounter) {
				ImagePuzzle_Game.score++;
				
				if (ImagePuzzle_Game.score == ImagePuzzle_Game.target) {
					$("#blankCell").children().show();
					$("#blankCell").attr('id', $("#blankCell").children().attr('id'));
					
					if ($('#mute').val() === "off") {
						ImagePuzzle_Game.win_snd.play();
					}
					
					clearInterval(ImagePuzzle_Game.timerIntervalId);
					
					var endTime = new Date(),
						duration = ImagePuzzle_Utils.diffBetweenTimes(
							ImagePuzzle_Utils.getStartTime(),
							endTime);
					
					ImagePuzzle_Utils.puzzlesSolved++;
					ImagePuzzle_Utils.updateText('puzzlesSolved', ImagePuzzle_Utils.puzzlesSolved);
					
					$('#playAgainLink').click();
				}
			}
			
			ImagePuzzle_Game.idCounter++;
		});
	}
};

document.addEventListener('keydown', function(event) {
	var empty = $("#blankCell").get(0),
		emptyrow = empty.parentNode,
		ex = empty.cellIndex,
		ey = emptyrow.rowIndex;
	
	switch (event.keyCode) {
		case 37:
			if (ex < ImagePuzzle_Game.rowCount - 1) {
				ImagePuzzle_Game.moveEmptyCell(ex, ey, 'r');
				ImagePuzzle_Game.updateGameState();
			}
			break;
		case 38: 
			if (ey < ImagePuzzle_Game.rowCount - 1) {
				ImagePuzzle_Game.moveEmptyCell(ex, ey, 'd');
				ImagePuzzle_Game.updateGameState();
			}
			break;
		case 39:
			if (ex > 0) {
				ImagePuzzle_Game.moveEmptyCell(ex, ey, 'l');
				ImagePuzzle_Game.updateGameState();
			}
			break;
		case 40:
			if (ey > 0) {
				ImagePuzzle_Game.moveEmptyCell(ex, ey, 'u');
				ImagePuzzle_Game.updateGameState();
			}
			break;
	}
});