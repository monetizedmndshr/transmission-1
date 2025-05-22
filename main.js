const audio = new Audio('typing.wav');
audio.volume = 0.2;

const terminalOutput = document.getElementById('terminal-output');
const container = document.getElementById('terminal-container');
const actionButton = document.getElementById('action-button');

const initialMessages = [
    "INITIALIZING CONNECTION...",
    "SECURE LINK ESTABLISHED.",
    "SOURCE: US-E.",
    "...",
    "TRANSMISSION:",
    "",
    "WE ARE SEARCHING FOR THOSE WHO SEE PATTERNS OTHERS IGNORE.",
    "THE FEW WHO QUESTION EVERYTHING.",
    "",
    "EACH DAY, A CLUE WILL BE TRANSMITTED.",
    "EACH CLUE, A FRAGMENT OF THE KEY.",
    "",
    "ONLY ONE WILL PIECE IT TOGETHER.",
    "ONLY ONE WILL UNLOCK THE VAULT.",
    "",
    "YOU ARE BEING WATCHED.",
    "MANY WILL TRY. MOST WILL FAIL.",
    "",
    "GOOD LUCK.",
    "- MM",
    "",
    ">_"
  ];
  

// Typing state
let lineIndex = 0;
let charIndex = 0;

function typeCharacter() {
  if (lineIndex < initialMessages.length) {
    const currentLine = initialMessages[lineIndex];
    const lastLine = terminalOutput.lastChild;

    // Create new line if needed
    if (!lastLine || !lastLine.classList.contains('typing')) {
      const newLine = document.createElement('div');
      newLine.className = 'typing';
      terminalOutput.appendChild(newLine);
    }

    const line = terminalOutput.lastChild;
    line.textContent += currentLine[charIndex] || "";

    container.scrollTop = container.scrollHeight;

    audio.currentTime = 0;
    audio.play();

    charIndex++;

    if (charIndex < currentLine.length) {
      setTimeout(typeCharacter, 25); // Typing speed per character
    } else {
      line.classList.remove('typing');
      charIndex = 0;
      lineIndex++;
      setTimeout(typeCharacter, 250); // Delay between lines
    }
  } else {
    actionButton.disabled = false;
  }
}


typeCharacter();

function updateProgress(currentClue, totalClues) {
    const percent = Math.round((currentClue / totalClues) * 100);
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');
  
    progressBar.style.width = percent + '%';
    progressLabel.textContent = `${percent}% COMPLETE`;
  }
  
  let clueIndex = 0;
const totalClues = 10;


terminalOutput.classList.add('glitch-flash');
setTimeout(() => terminalOutput.classList.remove('glitch-flash'), 300);


// Simulate next transmission on click
actionButton.addEventListener('click', () => {
    const sequence = [
      "",
      "Receiving next transmission...",
      ">>> ERROR: Signal disrupted.",
      ">>> Attempting reconnection...",
      ">_"
    ];
  
    clueIndex++;
    updateProgress(clueIndex, totalClues);
  
    sequence.forEach((line, index) => {
      setTimeout(() => {
        const newLine = document.createElement('div');
        newLine.textContent = line;
        terminalOutput.appendChild(newLine);
        container.scrollTop = container.scrollHeight;
        audio.currentTime = 0;
        audio.play();
      }, index * 700);
    });
  });
  