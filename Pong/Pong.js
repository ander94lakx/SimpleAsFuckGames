window.addEventListener("load", function() {

// ----- [VARIABLES] ----------------------------------------------------------

	// Canvas resources (for the graphics)
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var cWidth = canvas.getAttribute("width");
	var cHeight = canvas.getAttribute("height");

	// The margin of the horizontal ends with the center point of the players
	var margin = 15;

	// Variables to change both players sizes
	var playerHeight = 100;
	var playerWidth = 20;

	var scoreToWin = 10;
	
// ----- [ELEMENTS] -----------------------------------------------------------
	
	var player1 = {
		posX: margin, 
		posY: cHeight/2, 
		width: playerWidth, 
		height: playerHeight,
		score: 0
	};
	
	var player2 = {
		posX: cWidth - margin, 
		posY: cHeight/2, 
		width: playerWidth, 
		height: playerHeight,
		score: 0
	};
	
	var ball = {
		posX: cWidth/2,
		posY: cHeight/2,
		size: 16,
		radius: Math.ceil(Math.random() * 360),
		velocity: 20,
		acceleration: 0 // This will change
	};

// ----- [GRAPHICS] -----------------------------------------------------------
	
	function drawBackground() {
		ctx.save();	

		// draws black rectangle
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, cWidth, cHeight);

		// draw 1 px thickness white border 
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, cWidth/2, cHeight);
		ctx.strokeRect(cWidth/2, 0, cWidth/2, cHeight);	

		ctx.restore();
	}
						
	function drawPlayers() {
		ctx.save();

		ctx.fillStyle = "white";
		ctx.fillRect(player1.posX - player1.width/2, player1.posY - player1.height/2, player1.width, player1.height);
		ctx.fillRect(player2.posX - player2.width/2, player2.posY - player2.height/2, player2.width, player2.height);

		ctx.restore();
	}

	function drawBall() {
		ctx.save();

		ctx.fillStyle = "white";
		ctx.fillRect(ball.posX - ball.size/2, 
					 ball.posY - ball.size/2, 
					 ball.size,
					 ball.size);

		ctx.restore();
	}

	function drawScores() {
		ctx.save();

		var size = 42;
		var marginForText = 10;
		ctx.fillStyle = "white";
		ctx.font = size + "px Arial";
		ctx.fillText(player1.score, cWidth/2 - (size + marginForText), size + marginForText);
		ctx.fillText(player2.score, cWidth/2 + (size - marginForText), size + marginForText);

		ctx.restore();
	}
	
// ----- [INPUT] --------------------------------------------------------------

	var Key = {
		_pressed: {},

		A: 65,
		Z: 90,
		K: 75,
		M: 77,

		ENTER: 13,

		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},

		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
		},

		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};

	// Adds events to listen to the keyboard input
	window.addEventListener("keyup", 
		function(event) { Key.onKeyup(event); }
	);
	window.addEventListener("keydown",
		function(event) { Key.onKeydown(event); }
	);

// ----- [LOGIC] --------------------------------------------------------------

	function movePlayer1() {
		if (Key.isDown(Key.A))
			if (player1.posY > player1.height/2)
				player1.posY -= 20;

		if (Key.isDown(Key.Z))
			if (player1.posY < cHeight - player1.height/2)
				player1.posY += 20;
	}
	
	function movePlayer2() {
		if (Key.isDown(Key.K))
			if (player2.posY > player2.height/2)
				player2.posY -= 20;

		if (Key.isDown(Key.M))
			if (player2.posY < cHeight - player2.height/2)
				player2.posY += 20;
	}

	function moveBall() {
		function degreesToRadians(degrees) { return degrees*(Math.PI / 180); }

		// Check if collides with the walls
		if (ball.posY < margin || ball.posY > cHeight - margin) {
			ball.radius = 180 - ball.radius;
		}
		
		// Check if one of the players has scored
		if (ball.posX < 0 || ball.posX > cWidth) {
			var player = (ball.posX < cWidth/2) ? player1 : player2;
			player.score++;
			if (player.score >= scoreToWin)
				end = true;
			restart();
			return;
		}

		// Check collisions with the players -> NEED TO BE FIXED!!!
		if (ball.posX < cWidth/2) {
			// Now only can collide with the p1 -> check collisions with p1
			if ((ball.posX - ball.size/2) - (player1.posX + player1.width/2) < player1.width/2) {
				if (Math.abs(ball.posY - player1.posY) < player1.height/2) {
					if(ball.radius < 180)
						ball.radius -= 180;
					else
						ball.radius += 90 - ball.radius;
				}
			}
		} else {
			// Now only can collide with the p2 -> check collisions with p2
			if ((player2.posX - player2.width/2) - (ball.posX + ball.size/2) < player2.width/2) {
				if (Math.abs(ball.posY - player2.posY) < player2.height/2) {
					if(ball.radius < 180)
						ball.radius -= 180;
					else
						ball.radius += 90 - ball.radius;
				}
			}
		}

		// ...and finally moves!
		ball.velocity += ball.acceleration;
		ball.posX += ball.velocity * Math.sin(degreesToRadians(ball.radius));
		ball.posY -= ball.velocity * Math.cos(degreesToRadians(ball.radius));
	}

// ----- [GAME LOOP] ----------------------------------------------------------

	var start = false;
	var end = false;

	function init() {
		if (typeof game_loop != "undefined")
			clearInterval(game_loop);
		var game_loop = setInterval(main, 50);
		render(); // Render initial state of the game
	}

	function update() {
		movePlayer1();
		movePlayer2();
		moveBall();
	}

	function restart() {
		player1.posX = margin; 
		player1.posY =  cHeight/2;

		player2.posX = cWidth - margin;
		player2.posY = cHeight/2; 

		ball.posX = cWidth/2;
		ball.posY = cHeight/2;
		ball.radius = Math.ceil(Math.random() * 360);
		ball.velocity = 20;
	}

	function endGame() {
		start = false;
		restart();
		var elem = document.getElementById("subtitle");
		elem.innerHTML = "To restart the game refresh the web page (press F5)";
		elem.style.visibility = "visible";
	}

	function render() {
		drawBackground();
		drawScores();
		drawPlayers();
		drawBall();
	}
			
	function main() {
		if (Key.isDown(Key.ENTER)) {
			start = true;
			// Delete instructions to start the game
			var elem = document.getElementById("subtitle");
			//elem.parentNode.removeChild(elem);
			elem.style.visibility = "hidden";
		}
		if (end) 
			endGame();
		if (start) {
			update();
			render();
		}
	}

// --------------------------------------------- ... and this do the magic! ---

	init();

});