const terminalOutput = document.getElementById('terminal-output');
const container = document.getElementById('terminal-container');
const actionButton = document.getElementById('action-button');
const progressLabel = document.getElementById('progress-label');
const progressBar = document.getElementById('progress-bar');

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

// Typing animation
let lineIndex = 0;
let charIndex = 0;

function typeCharacter() {
  if (lineIndex < initialMessages.length) {
    const currentLine = initialMessages[lineIndex];
    const lastLine = terminalOutput.lastChild;

    if (!lastLine || !lastLine.classList.contains('typing')) {
      const newLine = document.createElement('div');
      newLine.className = 'typing';
      terminalOutput.appendChild(newLine);
    }

    const line = terminalOutput.lastChild;
    line.textContent += currentLine[charIndex] || "";

    container.scrollTop = container.scrollHeight;
  
    charIndex++;

    if (charIndex < currentLine.length) {
      setTimeout(typeCharacter, 25);
    } else {
      line.classList.remove('typing');
      charIndex = 0;
      lineIndex++;
      setTimeout(typeCharacter, 250);
    }
  } else {
    actionButton.disabled = false;
  }
}

typeCharacter();

// 🔄 Fetch live progress from JSON file
function fetchProgress() {
  fetch('progress.json')
    .then(res => res.json())
    .then(data => {
      const currentClue = Number(data.wordsSolved);
      const totalClues = Number(data.totalWords);
      const percent = Math.round((currentClue / totalClues) * 100);

      progressBar.style.width = percent + '%';
      progressLabel.textContent = `${percent}% COMPLETE`;
    })
    .catch(err => {
      console.error('Error loading progress.json:', err);
    });
}

fetchProgress();
setInterval(fetchProgress, 30000); // every 30 seconds

// ⚡ Glitch entrance
terminalOutput.classList.add('glitch-flash');
setTimeout(() => terminalOutput.classList.remove('glitch-flash'), 300);

// 🔘 Continue button behavior
actionButton.addEventListener('click', () => {
  const sequence = [
    "",
    "Receiving next transmission...",
    ">>> ERROR: Signal disrupted.",
    ">>> Attempting reconnection...",
    ">_"
  ];

  sequence.forEach((line, index) => {
    setTimeout(() => {
      const newLine = document.createElement('div');
      newLine.textContent = line;
      terminalOutput.appendChild(newLine);
      container.scrollTop = container.scrollHeight;
    }, index * 700);
  });
});
