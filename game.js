var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
let highScore;

// Gets the highScore if one exists
if (localStorage.getItem("highScore")) {
    highScore = Number(localStorage.getItem("highScore"));
} else {
    highScore = 0;
}

// Show/update high score on page load
document.addEventListener("DOMContentLoaded", function() {
    var highScoreElement = document.getElementById("high-score");
    if (highScoreElement) {
        highScoreElement.textContent = "High Score: " + highScore;
    }
});

// EventListener for key press
$(document).keypress(function() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

// EventListener for button click
$(".btn").click(function() {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
    // Set userClickedPattern to empty for next level
    userClickedPattern = [];

    // Increase the level
    level++;
    $("#level-title").text("Level " + level);

    // Choose random colour
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Animate a flicker
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    // Play corresponding colour sound
    playSound(randomChosenColour);
}

// Checks user's answer against game answer
function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]){
        // If answer is correct go to next sequence
        if (userClickedPattern.length == gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        // Plays wrong sound and turns body red when answer is wrong
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        $("#level-title").text("Game Over, Press Any Key to Restart");
        
        updateHighScore();
        startOver();
    }
}

// Update the high score
function updateHighScore() {
    if (level > highScore) {
        highScore = level;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("high-score").textContent = "High Score: " + highScore;
}

// Start the game over
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

// Plays corresponding sound based on colour name
function playSound(name) {
    var audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

// Animate shadow when button gets pressed
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}