const startGameBtn = document.getElementById('start-game');
const levelContainer = document.getElementById('level-container');
const startLevelBtn = document.getElementById('start-level');
const resultContainer = document.getElementById('result-container');
const reactionResult = document.getElementById('reaction-result');
const comment = document.getElementById('comment');
const gameContainer = document.getElementById('game-container');

let reactionTimes = [];
let isWaitingForClick = false;
let startTime;
let clickHandler;

function showLevel() {
  document.getElementById('title').classList.add('hidden');
  startGameBtn.classList.add('hidden');
  levelContainer.classList.remove('hidden');
}

function startLevel() {
  levelContainer.classList.add('hidden');
  document.body.style.backgroundColor = '#fbd1b7'; 
  reactionTimes = [];
  startReactionTest();
}

function startReactionTest() {
  let count = 0;
  const colors = ['#fbe4cf', '#b7fbd1', '#cfb7fb'];
  let usedColors = [];

  function runTest() {
    if (count >= 3) {
      showResults();
      return;
    }

    
    document.body.style.backgroundColor = '#fbd1b7';
    isWaitingForClick = false;
    
    
    if (clickHandler) {
      document.body.removeEventListener('click', clickHandler);
    }

    // Random delay between 1-3 seconds
    const delay = Math.random() * 2000 + 1000;

    // Wait for random delay then change color
    setTimeout(() => {
      // Select a random color that hasn't been used
      let availableColors = colors.filter(color => !usedColors.includes(color));
      if (availableColors.length === 0) {
        usedColors = []; // Reset used colors if all have been used
        availableColors = colors;
      }
      
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      const newColor = availableColors[randomIndex];
      usedColors.push(newColor);

      // Change background color and start timing
      document.body.style.backgroundColor = newColor;
      startTime = Date.now();
      isWaitingForClick = true;

      // Set up click handler
      clickHandler = function(event) {
        if (!isWaitingForClick) return;

        const reactionTime = Date.now() - startTime;
        reactionTimes.push(reactionTime);
        count++;
        
        // Remove this click handler
        document.body.removeEventListener('click', clickHandler);
        
        // Start next test after a short delay
        setTimeout(runTest, 500);
      };

      document.body.addEventListener('click', clickHandler);
    }, delay);
  }

  
  runTest();
}

function showResults() {
  document.body.style.backgroundColor = '#fbd1b7'; 
  const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  
  reactionResult.textContent = `Your reaction times: ${reactionTimes.map(time => time + 'ms').join(', ')}
                               Average reaction time: ${averageTime.toFixed(2)}ms`;
  
  if (averageTime < 200) {
    comment.textContent = 'Lightning fast reflexes!';
  } else if (averageTime < 300) {
    comment.textContent = 'Great reflexes!';
  } else if (averageTime < 400) {
    comment.textContent = 'Good reflexes!';
  } else {
    comment.textContent = 'Keep practicing!';
  }

  
  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.onclick = function() {
    resultContainer.classList.add('hidden');
    showLevel();
  };
  
  resultContainer.innerHTML = ''; 
  resultContainer.appendChild(reactionResult);
  resultContainer.appendChild(comment);
  resultContainer.appendChild(playAgainBtn);
  resultContainer.classList.remove('hidden');
}

startGameBtn.addEventListener('click', showLevel);
startLevelBtn.addEventListener('click', startLevel);