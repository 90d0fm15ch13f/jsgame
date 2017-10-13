var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };
var backgroundImage = new Image();
backgroundImage.src = 'images/air_hockey_background.png';
var canvas = document.createElement("canvas");
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);
var player_score = 0;
var computer_score = 0;

var keysDown = {};

var render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.drawImage(backgroundImage, 0, 0);
    player.render();
    computer.render();
    ball.render();
};

var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 400) {
        this.x = 400 - this.width;
        this.x_speed = 0;
    }

				if (this.y + this.height > 600) {
				    this.y = 600 - this.height;
						this.y_speed = 0;
				}
};

				function Computer() {
						this.paddle = new Paddle(175, 10, 30, 30);
				}

				Computer.prototype.render = function () {
						this.paddle.render();
				};

				Computer.prototype.update = function (ball) {
						var x_pos = ball.x;
						var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
						if (diff < 0 && diff < -4) {
								diff = -5;
						} else if (diff > 0 && diff > 4) {
								diff = 5;
						}
						this.paddle.move(diff, 0);
						if (this.paddle.x < 0) {
								this.paddle.x = 0;
						} else if (this.paddle.x + this.paddle.width > 400) {
								this.paddle.x = 400 - this.paddle.width;
						}
				};

				function Player() {
						this.paddle = new Paddle(175, 560, 30, 30);
				}

				Player.prototype.render = function () {
						this.paddle.render();
				};

				Player.prototype.update = function () {
						for (var key in keysDown) {
								var value = Number(key);
								if (value == 37) {
										this.paddle.move(-4, 0);
								} else if (value == 39) {
										this.paddle.move(4, 0);
								} else if (value == 38) {
										this.paddle.move(0,-4);
								} else if (value == 40) {
										this.paddle.move(0,4);
								} else {
										this.paddle.move(0, 0);
								}
              if (this.paddle.y < 300) {
                this.paddle.y = 300;
              }
						}
				};

				function Ball(x, y) {
						this.x = x;
						this.y = y;
						this.x_speed = 0;
						this.y_speed = 3;
				}

				Ball.prototype.render = function () {
						context.beginPath();
						context.arc(this.x, this.y, 5, 2 * Math.PI, false);
						context.fillStyle = "#000000";
						context.fill();
				};

				Ball.prototype.update = function (paddle1, paddle2) {
						this.x += this.x_speed;
						this.y += this.y_speed;
						var top_x = this.x - 5;
						var top_y = this.y - 5;
						var bottom_x = this.x + 5;
						var bottom_y = this.y + 5;

						if (this.x - 5 < 0) {
								this.x = 5;
								this.x_speed = -this.x_speed;
						} else if (this.x + 5 > 400) {
								this.x = 395;
								this.x_speed = -this.x_speed;
						}

						if (this.y < 0 &&  this.x < 290 && this.x > 110) {
								player_score += 1;
								document.getElementById("s_player").innerHTML = player_score;
								this.x_speed = 0;
								this.y_speed = 3;
								this.x = 200;
								this.y = 300;
						}
					  if (this.y > 600 && this.x < 290 && this.x > 110){
								computer_score += 1;
								document.getElementById("s_comp").innerHTML = computer_score;
								this.x_speed = 0;
								this.y_speed = 3;
								this.x = 200;
								this.y = 300;
						}
						else if (this.y < 0 || this.y > 600){
                this.y_speed = -1 * this.y_speed;
						}

						if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3 + ( paddle1.y_speed / 2);
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3 + (paddle2.y_speed / 2);
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

function end_game(){
	if ( player_score > computer_score){
		alert("You won! Click OK to play again");
	}
	if( computer_score > player_score){
		alert("You lost loser! Click OK to play again");
	}
	else{
		alert("You tied! Click OK to play again");
	}
};

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            end_game();
						location.reload();
						highscore(player_score);
        }
    }, 1000);
};

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
	var time_3 = 60 * 3, 
		display = document.querySelector('#timer');
  startTimer(time_3, display);
	update_scores();
};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

