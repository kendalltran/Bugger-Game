let score = 0
let speedVariable = 1
let lives = 3;
let streak = 0;
let longStreak = 0;
let selectedPlayer = 0;
let selectPhase = true;
let allEnemies = [];
let enemy1;
let enemy2;
let enemy3;
const heart1 = document.querySelector('.heart1');
const heart2 = document.querySelector('.heart2');
const heart3 = document.querySelector('.heart3');

//Helper function for incrementing streak and its effect on the game
const streakUp = function () {
  streak += 1;
  document.getElementById('streak').innerHTML = `Streak: ${streak}`;
  streakIncrement();
  determineLongStreak();
}

//Helper function for zeroing out once hit a bug
const streakZero = function () {
  if (streak >= 5) {
    swal("Streak Over!");
  }
  streak = 0;
  speedVariable = 1;
  document.getElementById('streak').innerHTML = `Streak: ${streak}`;
  allEnemies = [];
  allEnemies.push(enemy1, enemy2, enemy3);
  allEnemies.forEach( () => this.update);
}

//Helper function to make the game harder as streak goes up
const streakIncrement = function () {
  if (streak === 5) {
    swal("More Bugs!");
    increaseBug();
  } else if (streak === 10) {
    speedVariable = 2;
    swal("Speed Up!");
  }
}

//Helper function to determine longest streak
const determineLongStreak = function () {
  if (streak > longStreak) {
    longStreak = streak;
  }
}

//Helper function to increase bugs to 4
const increaseBug = function () {
  allEnemies = [];
  let enemy4 = new Enemy(-60, 315, 50 + Math.random() * 70);
  allEnemies.push(enemy1, enemy2, enemy3, enemy4);
  allEnemies.forEach( () => this.update);
}

//Helper function after player reaches water, streak up and display updated score
const reachWater = function () {
  streakUp();
  score += 100;
  document.getElementById('scoretable').innerHTML = `Score: ${score}`;
}

//Helper function to decrease life
const decreaseLife = function () {
  lives -= 1;
  drawHearts(lives);
  if (lives === 1) {
    swal("Final life!")
  }
  if (lives === 0) {
    gameRestartOption();
  }
}

//Helper function to give options to Player after game over
const gameRestartOption = function () {
  swal(`You scored ${score} points with a long streak of ${longStreak}!`, {
  buttons: {
    practice: "Practice on current game settings",
    reload: "Pick new character"
    }
  }
)
.then((value) => {
  switch (value) {

    case "practice":
      swal("Enjoy!");
      break;

    case "reload":
      swal("Game Restart", "Let's do this!", "success");
      setTimeout(() => {location.reload();}, 1000)
      break;
  }
});
}

//Helper function to render the heart counters
const drawHearts = function(num) {
  if (num >= 3) {
    heart1.classList.remove('far');
    heart2.classList.remove('far');
    heart3.classList.remove('far');

    heart1.classList.add('fas');
    heart2.classList.add('fas');
    heart3.classList.add('fas');
  } else if (num == 2) {
    heart1.classList.remove('far');
    heart2.classList.remove('far');
    heart3.classList.remove('fas');

    heart1.classList.add('fas');
    heart2.classList.add('fas');
    heart3.classList.add('far');
  } else if (num == 1) {
    heart1.classList.remove('far');
    heart2.classList.remove('fas');
    heart3.classList.remove('fas');

    heart1.classList.add('fas');
    heart2.classList.add('far');
    heart3.classList.add('far');
  } else if (num < 1) {
    heart1.classList.remove('fas');
    heart2.classList.remove('fas');
    heart3.classList.remove('fas');

    heart1.classList.add('far');
    heart2.classList.add('far');
    heart3.classList.add('far');
  }
}


var Star = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Star.png';
}

var Heart = function (x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Heart.png';
}

//only shows on specific life and streak condition
Heart.prototype.render = function() {
    if (lives === 1 && streak === 10) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

Heart.prototype.update = function (dt) {
  if (player.x < this.x + 50 &&
      player.x > this.x - 50 &&
      player.y < this.y + 50 &&
      player.y > this.y - 50 &&
      lives === 1 &&
      streak === 10) {
        lives += 1;
        drawHearts(lives);
        this.x = -100;
        this.y = -100;
        setTimeout( () => {
        this.x = Math.random() * 400;
        this.y = 60 + Math.random() * 240;
      }, 1000)
      }
}

Star.prototype.render = function() {
  if (streak >= 10) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

Star.prototype.update = function (dt) {
  if (player.x < this.x + 50 &&
      player.x > this.x - 50 &&
      player.y < this.y + 50 &&
      player.y > this.y - 50) {
        score += 200;
        document.getElementById('scoretable').innerHTML = `Score: ${score}`;
        this.x = -100;
        this.y = -100;
        setTimeout( () => {
        this.x = Math.random() * 400;
        this.y = 60 + Math.random() * 240;
      }, 1000)
      }
}

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here, we've provided one for you to get started
    // this.x = x, where x will be set by some higher level function
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, now, lastTime) {
    // You should multiply any movement by the dt parameter which will ensure the game runs at the same speed for all computers.

    this.x = this.x + (this.speed * speedVariable * dt);
    if (this.x > 500) {
      this.x = -50;}

    if (player.x < this.x + 50 &&
        player.x + 50 > this.x &&
        player.y < this.y + 50 &&
        50 + player.y > this.y) {
        player.x = 200;
        player.y = 400;
        score -= 200;
        decreaseLife();
        streakZero();
        document.getElementById('scoretable').innerHTML = `Score: ${score}`;

        }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class.  This class requires an update(), render() and a handleInput() method.
var Player = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = playerImages[selectedPlayer];  //how to prompt to ask for which player to pick???
};

Player.prototype.update = function() {
  if (this.y < 0) {
    setTimeout(() => {
      this.x = 200;
      this.y = 400;
    }, 100);
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
  if (keyPress == 'left' && this.x > 0) {
        this.x -= 100;
    } else if (keyPress == 'right' && this.x < 305) {
        this.x += 100;
    } else if (keyPress == 'down' && this.y < 400) {
        this.y += 85;
    } else if (keyPress == 'up' && this.y > 0) {
        this.y -= 85;
        if (this.y < 50) {
          console.log('keypress is way to go');
          reachWater();
        }
    }
};

var Selector = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Selector.png';
}

Selector.prototype.update = function(x, y) {
  this.x = x;
  this.y = y;
};

Selector.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Selector.prototype.handleInput = function(keyPress) {
  if (keyPress == 'left' && this.x > 0) {
        this.x -= 100;
        selectedPlayer--;
    } else if (keyPress == 'right' && this.x < 305) {
        this.x += 100;
        selectedPlayer++;
    } else if (keyPress == 'enter') {
        selectPhase = false;
        initGame();
      }
    };

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called  player
var star = new Star(400 * Math.random(), 240 * Math.random() + 60);
var heart = new Heart(400 * Math.random(), 240 * Math.random() + 60);
var selector = new Selector(0, 0);

let player;
//add enemies to this Array
const initGame = function() {
  player = new Player(200, 400);
  enemy1 = new Enemy(1, 60, 50 + Math.random() * 70);
  enemy2 = new Enemy(1, 145, 50 + Math.random() * 70);
  enemy3 = new Enemy(-30, 230, 50 + Math.random() * 70);

  allEnemies.push(enemy1, enemy2, enemy3);
  allEnemies.forEach( () => this.update);
  }

// This listens for key presses and sends the keys to your Player.handleInput() method. You don't need to modify this.

//make a point to understand this
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    if (selectPhase) {
      selector.handleInput(allowedKeys[e.keyCode]);
    } else {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

// Prevent the window from scrolling on arrow key press
window.addEventListener('keydown', function(e) {
    // keycodes for the space bar and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
