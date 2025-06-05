// Game state
const gameState = {
    inventory: [],
    discoveredClues: [],
    puzzlesSolved: 0,
    doorCode: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4-digit code
    storyProgress: 0,
    usedItems: [],
    endingsDiscovered: [],
    terminalHistory: []
};

// Room items with enhanced descriptions and interactions
const roomItems = [
    {
        id: 'desk',
        name: 'Lab Desk',
        description: 'A stainless steel desk littered with research notes and strange equipment.',
        imageDesc: 'The workspace of someone obsessed - papers covered in frantic scribbles surround a high-powered microscope. A small drawer catches your eye, its lock gleaming under the dim light.',
        interactions: [
            {
                action: 'Search the desk',
                result: 'Your fingers brush against something metallic beneath a stack of papers - a small brass key. Underneath it, a torn piece of paper shows the words: "Subject 314: le poisson steve".',
                callback: () => {
                    addToInventory('small-key');
                    addToInventory('subject-note');
                    updateRoomItem('desk', 'The desk has been thoroughly searched. Only the microscope remains undisturbed.');
                    addStoryReveal("A hastily scrawled note reads: 'The transformation sequence must follow lunar phases - new moon first, then the knight's journey.'");
                }
            },
            {
                action: 'Use microscope',
                result: 'Adjusting the focus reveals a slide with human cells... but they\'re changing. Morphing. A label on the slide reads "PHOENIX PROTOCOL - PHASE 3". Beneath the slide holder, tiny engravings catch the light: "The truth is hidden in plain sight".',
                callback: () => {
                    addClue('truth-hidden');
                    addClue('phoenix-protocol');
                    updateRoomItem('desk', 'The microscope still shows those disturbing cells. What were they trying to accomplish here?');
                    addStoryReveal("The cells under the microscope seem to be regenerating at an impossible rate, then suddenly disintegrating in a cycle of rebirth and destruction.");
                }
            }
        ]
    },
    {
        id: 'cabinet',
        name: 'Supply Cabinet',
        description: 'A heavy steel cabinet with warning labels peeling at the edges.',
        imageDesc: 'Three drawers bear faded labels: "Volatiles", "Restricted", and "Failed Trials". The top drawer has a small but sturdy padlock.',
        interactions: [
            {
                action: 'Open top drawer',
                result: 'The padlock resists your attempts. It would need a key...',
                requiredItem: 'small-key',
                successResult: 'The brass key turns smoothly. Inside lies a crossword puzzle clipped from a newspaper, but someone has written over it. The answers form words: "Eureka", "Serum", "Immortal", and "Price". The word "Eureka" is circled repeatedly.',
                callback: () => {
                    addToInventory('crossword');
                    gameState.usedItems.push('small-key');
                    updateRoomItem('cabinet', 'The top drawer hangs open, its contents revealed.');
                    addStoryReveal("A newspaper date is visible on the crossword: exactly one year ago today. Beneath the puzzle, someone has written 'The answer was always in Archimedes' cry.'");
                }
            },
            {
                action: 'Open middle drawer',
                result: 'The drawer slides open with a hiss of pressurized air. Rows of ominous vials sit in cushioned slots. One bottle, larger than the rest, bears a skull and crossbones with the label: "DANGER: CATALYST - DO NOT MIX WITH PHASE 3 COMPONENTS".',
                callback: () => {
                    addToInventory('danger-bottle');
                    updateRoomItem('cabinet', 'The middle drawer remains open, its dangerous contents exposed.');
                    addStoryReveal("A warning label on the bottle's underside reads: 'Combination with lunar-triggered sequences causes catastrophic cellular degeneration.'");
                }
            },
            {
                action: 'Open bottom drawer',
                result: 'The drawer won\'t budge. It seems welded shut... or perhaps sealed from the inside.',
                requiredItem: 'crowbar',
                successResult: 'With considerable effort, the drawer screeches open. Inside is nothing but dust and a single scrap of paper that reads: "The real failure was thinking we could control it." A crowbar clatters to the floor from where it was wedged.',
                callback: () => {
                    addToInventory('crowbar');
                    updateRoomItem('cabinet', 'All three drawers now stand open, revealing the cabinet\'s dark secrets.');
                    addStoryReveal("The back of the scrap paper shows a chemical structure labeled 'Phoenix Molecular Binding Agent' with a large red X through it.");
                }
            }
        ]
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        description: 'A floor-to-ceiling case of scientific tomes, their spines cracked with age.',
        imageDesc: 'Dust motes dance in the air as you approach. Among dry academic volumes, one book practically glows - "Advanced Cryptography: Secrets of the Alchemists" by Dr. V. Alchem.',
        interactions: [
            {
                action: 'Browse books',
                result: 'Your fingers stop on the cryptography book. As you pull it down, pages fall open to a marked passage: "The true cipher lies not in complexity, but in the key\'s relationship to the lock." A pressed four-leaf clover serves as a bookmark.',
                callback: () => {
                    addToInventory('crypto-book');
                    updateRoomItem('bookshelf', 'The gap in the shelves seems to draw your attention.');
                    addStoryReveal("The book's margin notes describe an encryption method using celestial bodies as symbols, with a warning: 'The sequence must be followed precisely or all is lost.'");
                }
            },
            {
                action: 'Check behind books',
                result: 'Shifting volumes reveals a wall safe with an unusual keypad - it displays scrambled letters instead of numbers. A small label reads: "Subject 314 holds the key".',
                callback: () => {
                    updateRoomItem('bookshelf', 'The safe lurks behind the books, its letter keypad visible.');
                    addRoomItem({
                        id: 'safe',
                        name: 'Letter Combination Safe',
                        description: 'A secure safe with a letter-based keypad.',
                        imageDesc: 'The safe\'s surface is cold to the touch. The keypad shows scrambled letters that can be rearranged. Above it, the label "Subject 314" glows faintly.',
                        interactions: [
                            {
                                action: 'Examine safe',
                                result: 'The safe has 12 buttons displaying scrambled letters. A small screen above shows: "Enter the hidden message from Subject 314".',
                                callback: () => {}
                            },
                            {
                                action: 'Try to open safe',
                                result: 'The safe beeps - it requires a specific word or phrase to be entered using the scrambled letters.',
                                requiredItem: 'subject-note',
                                successResult: 'Using the note "Subject 314: le poisson steve", you realize it\'s an anagram. Rearranging the letters forms "the poison vessels" - the safe accepts this phrase and opens with a hiss. Inside rests a USB drive labeled "Project Phoenix - Final Notes".',
                                callback: () => {
                                    addToInventory('usb-drive');
                                    addClue('safe-combination');
                                    updateRoomItem('safe', 'The safe stands open, its contents taken.');
                                    addStoryReveal("A faint scent of lavender wafts from the safe's interior - the same smell you noticed when first waking up.");
                                }
                            }
                        ]
                    });
                }
            }
        ]
    },
    {
        id: 'computer',
        name: 'Computer Terminal',
        description: 'An obsolete computer setup that somehow still hums with power.',
        imageDesc: 'The CRT monitor\'s glow paints everything an eerie green. A sticky note on the keyboard reads "Password hint: Solve the lab crossword (check drawer)" The username "DR.ALCHEM" is already entered.',
        interactions: [
            
                // In the computer terminal interactions:
{
    action: 'Turn on computer',
    result: 'The ancient hard drive whirs to life, displaying: "Project Phoenix Mainframe - Access Restricted". The login screen shows a crossword puzzle instead of the usual password field.',
    callback: () => {
        updateRoomItem('computer', 'The terminal displays a crossword puzzle that must be solved to gain access.');
        showCrosswordPuzzle();
    }
},
{
    action: 'Insert USB drive',
    result: 'The drive slots in smoothly. The screen updates: "Recognized Project Phoenix storage device. Decrypting...". The crossword puzzle now shows some letters filled in to help you.',
    requiredItem: 'usb-drive',
    successResult: 'The USB contains crossword hints. Some letters are now pre-filled to help solve the puzzle.',
    callback: () => {
        addClue('crossword-hints');
        gameState.usedItems.push('usb-drive');
        showCrosswordPuzzle(true);
    }
}
            
        ]
    },

    {
        id: 'door',
        name: 'Exit Door',
        description: 'Your only way out, sealed tight with industrial locks.',
        imageDesc: 'Reinforced steel with a biometric scanner and keypad. A small red light pulses like a heartbeat. A nearly invisible seam suggests the door is airtight when sealed.',
        interactions: [
            {
                action: 'Examine door',
                result: 'Running your fingers along the frame reveals a hidden compartment containing a folded note. It reads: "Code changes with the lunar cycle. Current sequence: Subject number (3-1-4) multiplied by catalyst constant (2.5, round down)."',
                callback: () => {
                    addToInventory('door-note');
                    updateRoomItem('door', 'The door remains impassive, but you\'ve learned its secret.');
                    addStoryReveal("The note continues: 'In case of containment breach, remember - the serum cannot leave this room. Destroy everything.'");
                }
            },
            {
                action: 'Enter code',
                result: 'The keypad glows expectantly. Each press emits a soft beep.',
                callback: () => showDoorCodeInput()
            }
        ]
    },
    {
        id: 'chemical-chart',
        name: 'Chemical Chart',
        description: 'A massive periodic table with disturbing annotations.',
        imageDesc: 'Someone has marked certain elements with increasing urgency - O, P, S, and Se are circled in what looks like blood. Beneath them, the letters form "OPSSE", with an arrow rearranging them to spell "POSSE". A Latin dictionary lies open to "posse: to be able, to have power".',
        interactions: [
            {
                action: 'Examine chart',
                result: 'The elements O (8), P (15), S (16), and Se (34) bear handwritten notes: "Essential to stabilization sequence". The word "POSSESS" is written vertically beside them, each letter assigned to an element.',
                callback: () => {
                    addClue('elements-combined');
                    updateRoomItem('chemical-chart', 'The chart seems to hold the key to something fundamental about this place.');
                    addStoryReveal("A tiny footnote reads: 'The subject must possess all four elements in perfect balance, or the transformation will consume them.'");
                }
            }
        ]
    },
    {
        id: 'whiteboard',
        name: 'Whiteboard',
        description: 'Covered in frantic equations and disturbing diagrams.',
        imageDesc: 'Complex chemical formulae cover most of the surface, but one corner holds a crude drawing - a human figure transforming into a bird-like creature, then crumbling to dust. Dates and numbers are scribbled everywhere, with "314" appearing repeatedly.',
        interactions: [
            {
                action: 'Study equations',
                result: 'The science is beyond you, but the recurring numbers stand out: 3-1-4 appears in multiple contexts. A small doodle shows a key with these numbers engraved on its bow.',
                callback: () => {
                    addClue('key-numbers');
                    updateRoomItem('whiteboard', 'The equations tell a story of trial and terrifying error.');
                    addStoryReveal("In the whiteboard's corner, almost erased: 'Subject 314 showed promise for 314 minutes before deterioration. The perfect number becomes the cursed number.'");
                }
            }
        ]
    }
];

// Initialize the game
function initGame() {
    renderRoomItems();
    updateStory();
    
    // Start with ambient terminal effect
    simulateTerminalBoot();
}

// Simulate computer boot sequence
function simulateTerminalBoot() {
    const roomDesc = document.getElementById('room-description');
    const originalContent = roomDesc.innerHTML;
    
    let bootSequence = [
        "Initializing environment...",
        "Loading memory modules...",
        "ERROR: Memory corruption detected",
        "Running diagnostic...",
        "Subject neural patterns: unstable",
        "Phoenix Protocol: ACTIVE",
        "System ready"
    ];
    
    roomDesc.innerHTML = '<div id="terminal-output"></div>';
    const terminal = document.getElementById('terminal-output');
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < bootSequence.length) {
            terminal.innerHTML += bootSequence[i] + '<br>';
            terminal.scrollTop = terminal.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                roomDesc.innerHTML = originalContent;
            }, 2000);
        }
    }, 800);
}

// Render all room items
function renderRoomItems() {
    const container = document.getElementById('room-items');
    container.innerHTML = '';
    
    roomItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'room-item';
        if (!gameState.discoveredClues.includes(item.id + '-seen')) {
            itemElement.classList.add('item-highlight');
            addClue(item.id + '-seen');
        }
        itemElement.innerHTML = `<strong>${item.name}</strong><br>${item.description}`;
        itemElement.onclick = () => showItemOptions(item);
        container.appendChild(itemElement);
    });
}

// Add a new item to the room
function addRoomItem(item) {
    if (!roomItems.some(existingItem => existingItem.id === item.id)) {
        roomItems.push(item);
        renderRoomItems();
    }
}

// Update an existing room item
function updateRoomItem(itemId, newDescription) {
    const item = roomItems.find(i => i.id === itemId);
    if (item) {
        item.description = newDescription;
        renderRoomItems();
    }
}

// Show interaction options for an item
function showItemOptions(item) {
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = `
        <h3>${item.name}</h3>
        <p><em>${item.imageDesc}</em></p>
        ${item.interactions.map(interaction => {
            const hasRequiredItem = !interaction.requiredItem || gameState.inventory.includes(interaction.requiredItem);
            const usedItem = gameState.usedItems.includes(interaction.requiredItem);
            
            if (interaction.requiredItem && usedItem) {
                return `<button disabled>${interaction.action} (already used)</button>`;
            } else if (hasRequiredItem) {
                return `<button onclick="handleInteraction('${item.id}', ${item.interactions.indexOf(interaction)})">${interaction.action}</button>`;
            } else {
                return `<button onclick="alert('You need ${interaction.requiredItem.replace('-', ' ')} to do that.')">${interaction.action} (requires ${interaction.requiredItem.replace('-', ' ')})</button>`;
            }
        }).join('<br>')}
    `;
    puzzleContainer.style.display = 'block';
}

// Handle item interaction
function handleInteraction(itemId, interactionIndex) {
    const item = roomItems.find(i => i.id === itemId);
    const interaction = item.interactions[interactionIndex];
    
    const result = interaction.requiredItem && gameState.inventory.includes(interaction.requiredItem) 
        ? interaction.successResult 
        : interaction.result;
    
    // Create a more immersive alert
    const puzzleContainer = document.getElementById('puzzle-container');
    const oldContent = puzzleContainer.innerHTML;
    puzzleContainer.innerHTML = `
        <h3>${item.name}</h3>
        <div id="interaction-result" style="padding: 10px; background: #2a2a2a; border-radius: 5px; margin: 10px 0;">
            ${result}
        </div>
        <button onclick="document.getElementById('puzzle-container').innerHTML = \`${oldContent.replace(/`/g, '\\`')}\`">Back</button>
    `;
    
    if (interaction.callback) {
        interaction.callback();
    }
    
    if (interaction.requiredItem && gameState.inventory.includes(interaction.requiredItem)) {
        gameState.usedItems.push(interaction.requiredItem);
    }
    
    updateInventory();
    updateStory();
}

// Add item to inventory
function addToInventory(itemId) {
    if (!gameState.inventory.includes(itemId)) {
        gameState.inventory.push(itemId);
        updateInventory();
        
        // Special effects for certain items
        if (itemId === 'usb-drive') {
            addStoryReveal("The USB drive feels unnaturally warm to the touch, as if something inside is still active.");
        } else if (itemId === 'danger-bottle') {
            addStoryReveal("The bottle's contents slosh thickly, like syrup. Through the dark glass, you swear you see something move.");
        }
    }
}

// Update inventory display
function updateInventory() {
    const inventoryContainer = document.getElementById('inventory-items');
    inventoryContainer.innerHTML = '';
    
    gameState.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.textContent = item.replace('-', ' ');
        inventoryContainer.appendChild(itemElement);
    });
}

// Add discovered clue
function addClue(clueId) {
    if (!gameState.discoveredClues.includes(clueId)) {
        gameState.discoveredClues.push(clueId);
        gameState.puzzlesSolved++;
    }
}

// Add story reveal text
function addStoryReveal(text) {
    const roomDesc = document.getElementById('room-description');
    const revealElement = document.createElement('div');
    revealElement.className = 'story-reveal';
    revealElement.innerHTML = text;
    roomDesc.appendChild(revealElement);
}

// Update story based on progress
function updateStory() {
    const roomDesc = document.getElementById('room-description');
    
    // Base description remains
    let baseDescription = `
        <p>Your head throbs as consciousness returns. The sterile scent of ethanol mixes with something more acrid - ozone? Burning? Your vision clears to reveal a dim laboratory, illuminated only by the flickering glow of dying fluorescent lights.</p>
        <p>The cold metal table beneath you explains the stiffness in your limbs. How long were you out? The last thing you remember is... nothing. Just darkness.</p>
        <p>A digital keypad by the reinforced door mocks you with its glowing red display: "LOCKED - ENTER 4-DIGIT CODE". The air feels thick with secrets and the weight of forgotten experiments.</p>
    `;
    
    // Progressive story reveals
    let additionalText = '';
    
    if (gameState.puzzlesSolved >= 7 && !gameState.endingsDiscovered.includes('full')) {
        additionalText = `
            <div class="story-reveal">
                <p>The pieces come together horrifyingly - this was Dr. Alchem's secret lab where he worked on "Project Phoenix", an attempt to create immortality through cellular regeneration. The notes mention "Subject 314" - could that be you?</p>
                <p>The final note by the door is clear: "If you're reading this, the experiment failed. The serum causes perfect regeneration followed by complete cellular breakdown after precisely 314 minutes. Destroy everything."</p>
                <p>Your skin prickles. How long have you been awake?</p>
            </div>
        `;
        gameState.endingsDiscovered.push('full');
    } else if (gameState.puzzlesSolved >= 5 && !gameState.endingsDiscovered.includes('partial')) {
        additionalText = `
            <div class="story-reveal">
                <p>More notes suggest the lab was abandoned in a hurry. "Project Phoenix" wasn't just research - it was human trials. The last entry in the computer log reads: "Subject 314 showed perfect cellular regeneration for 314 minutes... then the degeneration began. We cannot stop it."</p>
                <p>A chill runs down your spine. Who was Subject 314?</p>
            </div>
        `;
        gameState.endingsDiscovered.push('partial');
    } else if (gameState.puzzlesSolved >= 3 && !gameState.endingsDiscovered.includes('hint')) {
        additionalText = `
            <div class="story-reveal">
                <p>As you piece together clues, a disturbing picture emerges. This lab was working on some kind of biological transformation. Notes mention "cellular regeneration", "phoenix metaphor", and "the 314 sequence".</p>
                <p>A calendar on the wall is circled on today's date... from one year ago.</p>
            </div>
        `;
        gameState.endingsDiscovered.push('hint');
    }
    
    roomDesc.innerHTML = baseDescription + additionalText;
}

// Show password puzzle
function showPasswordPuzzle() {
    const puzzleContainer = document.getElementById('puzzle-container');
    
    if (gameState.discoveredClues.includes('computer-password')) {
        puzzleContainer.innerHTML = `
            <h3>Computer Login</h3>
            <p>The password is "EUREKA".</p>
            <button onclick="loginToComputer()">Login</button>
        `;
    } else {
        puzzleContainer.innerHTML = `
            <h3>Computer Login</h3>
            <p>Username: DR.ALCHEM</p>
            <p>Password: <input type="password" id="computer-password-input"></p>
            <button onclick="checkComputerPassword()">Login</button>
            <p class="hint">Hint: The crossword puzzle mentions "Archimedes' cry". The USB drive might have more information.</p>
        `;
    }
    
    puzzleContainer.style.display = 'block';
}

// Check computer password
function checkComputerPassword() {
    const input = document.getElementById('computer-password-input').value.toUpperCase();
    
    if (input === 'EUREKA') {
        const puzzleContainer = document.getElementById('puzzle-container');
        puzzleContainer.innerHTML = `
            <h3>Computer Login</h3>
            <div class="success">
                <p>Login successful!</p>
                <p>The screen displays:</p>
                <div style="background: #000; color: #0f0; padding: 10px; font-family: monospace;">
                    PROJECT PHOENIX - FINAL NOTES<br><br>
                    Subject 314 results:<br>
                    - Full cellular regeneration achieved<br>
                    - Memory loss side effect confirmed<br>
                    - Degeneration begins at 314 minutes<br>
                    - No reversal possible<br><br>
                    EMERGENCY OVERRIDE CODE: ${gameState.doorCode}<br>
                    Use only if primary systems fail.<br>
                    Remember - the serum must not leave this room.
                </div>
                <button onclick="document.getElementById('puzzle-container').style.display='none'">Close</button>
            </div>
        `;
        addClue('door-code-revealed');
        addClue('phoenix-details');
    } else {
        alert('ACCESS DENIED\nIncorrect password!\n' + 
              (gameState.discoveredClues.includes('crossword') ? 
               'Hint: Check the crossword puzzle' : 
               'Hint: Look for clues around the lab'));
    }
}

// Crossword puzzle data
const crosswordData = {
    solution: [
        ['S', 'E', 'R', 'U', 'M'],
        ['V', 'I', 'A', 'L', 'S'],
        ['D', 'N', 'A', 'T', 'E'],
        ['G', 'E', 'N', 'E', 'S'],
        ['M', 'O', 'L', 'E', 'C']
    ],
    across: {
        1: { clue: "Experimental liquid given to subjects", row: 0, col: 0, length: 5 },
        4: { clue: "Genetic material (abbr.)", row: 2, col: 0, length: 3 },
        5: { clue: "Units of heredity", row: 3, col: 0, length: 5 },
        6: { clue: "____ule (smallest unit of a compound)", row: 4, col: 0, length: 4 }
    },
    down: {
        1: { clue: "Glass containers for chemicals", row: 0, col: 1, length: 5 },
        2: { clue: "RNA's counterpart", row: 0, col: 2, length: 3 },
        3: { clue: "PH scale measures this", row: 0, col: 4, length: 3 }
    }
};

// Show the crossword puzzle
function showCrosswordPuzzle(withHints = false) {
    const puzzleContainer = document.getElementById('puzzle-container');
    
    // Build the crossword grid
    let gridHTML = '<div class="crossword-container">';
    gridHTML += '<h3>Laboratory Crossword</h3>';
    gridHTML += '<p>Solve the puzzle to reveal the password</p>';
    
    // Create the grid
    gridHTML += '<div class="crossword-grid">';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = withHints && (row === 0 || col === 0) ? crosswordData.solution[row][col] : '';
            const isLocked = withHints && (row === 0 || col === 0);
            
            // Add clue numbers
            let clueNumber = '';
            if ((row === 0 && col === 0) || (row === 0 && col === 1) || 
                (row === 0 && col === 2) || (row === 0 && col === 4) ||
                (row === 2 && col === 0) || (row === 3 && col === 0) ||
                (row === 4 && col === 0)) {
                const acrossClue = Object.entries(crosswordData.across).find(([num, data]) => 
                    data.row === row && data.col === col);
                const downClue = Object.entries(crosswordData.down).find(([num, data]) => 
                    data.row === row && data.col === col);
                
                if (acrossClue) clueNumber = acrossClue[0];
                else if (downClue) clueNumber = downClue[0];
            }
            
            gridHTML += `
                <div class="crossword-cell">
                    ${clueNumber ? `<span class="clue-number">${clueNumber}</span>` : ''}
                    <input type="text" maxlength="1" id="${cellId}" 
                           value="${cellValue}" 
                           ${isLocked ? 'readonly style="color:#8bc34a;"' : ''}
                           oninput="this.value = this.value.toUpperCase(); checkCrosswordCompletion()">
                </div>
            `;
        }
    }
    gridHTML += '</div>';
    
    // Add clues
    gridHTML += '<div class="crossword-clues">';
    gridHTML += '<div class="clue-list"><h4>Across</h4><ol>';
    for (const [num, clue] of Object.entries(crosswordData.across)) {
        gridHTML += `<li>${clue.clue}</li>`;
    }
    gridHTML += '</ol></div>';
    
    gridHTML += '<div class="clue-list"><h4>Down</h4><ol>';
    for (const [num, clue] of Object.entries(crosswordData.down)) {
        gridHTML += `<li>${clue.clue}</li>`;
    }
    gridHTML += '</ol></div>';
    gridHTML += '</div>';
    
    // Add success message area
    gridHTML += `
        <div id="crossword-success" class="crossword-success">
            Puzzle solved! The password is "SERUM" (from 1 Across)
        </div>
        <button onclick="document.getElementById('puzzle-container').style.display='none'">Close</button>
    `;
    
    gridHTML += '</div>';
    puzzleContainer.innerHTML = gridHTML;
    puzzleContainer.style.display = 'block';
    
    // If using hints, lock the first row and column
    if (withHints) {
        for (let i = 0; i < 5; i++) {
            document.getElementById(`cell-0-${i}`).readOnly = true;
            document.getElementById(`cell-${i}-0`).readOnly = true;
        }
    }
}

// Check if crossword is completed correctly
function checkCrosswordCompletion() {
    let allCorrect = true;
    
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell.readOnly && cell.value.toUpperCase() !== crosswordData.solution[row][col]) {
                allCorrect = false;
            }
        }
    }
    
    if (allCorrect) {
        const successDiv = document.getElementById('crossword-success');
        successDiv.style.display = 'block';
        addClue('computer-password');
        
        // Automatically log in after a short delay
        setTimeout(loginToComputer, 1500);
    }
}
    


function loginToComputer() {
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = `
        <h3>Computer Login</h3>
        <div class="success">
            <p>Login successful! (Password: SERUM)</p>
            <p>The screen displays:</p>
            <div style="background: #000; color: #0f0; padding: 10px; font-family: monospace;">
                PROJECT PHOENIX - FINAL NOTES<br><br>
                Subject 314 results:<br>
                - Full cellular regeneration achieved<br>
                - Memory loss side effect confirmed<br>
                - Degeneration begins at 314 minutes<br>
                - No reversal possible<br><br>
                EMERGENCY OVERRIDE CODE: ${gameState.doorCode}<br>
                Use only if primary systems fail.<br>
                Remember - the serum must not leave this room.
            </div>
            <button onclick="document.getElementById('puzzle-container').style.display='none'">Close</button>
        </div>
    `;
    addClue('door-code-revealed');
    addClue('phoenix-details');
}
// Show door code input
function showDoorCodeInput() {
    const puzzleContainer = document.getElementById('puzzle-container');
    
    let hint = '';
    if (gameState.discoveredClues.includes('door-code-revealed')) {
        hint = `<p class="success">The computer showed the code: ${gameState.doorCode}</p>`;
    } else if (gameState.discoveredClues.includes('key-numbers') && gameState.discoveredClues.includes('door-note')) {
        hint = `<p class="hint">The note says to multiply Subject number (3-1-4) by 2.5 and round down. 314 × 2.5 = 785 → ${gameState.doorCode}</p>`;
    } else {
        hint = '<p class="hint">The code might be in the computer files or derivable from notes around the room.</p>';
    }
    
    puzzleContainer.innerHTML = `
        <h3>Door Keypad</h3>
        <p>Enter 4-digit code:</p>
        <input type="number" id="door-code-input" min="1000" max="9999">
        <button onclick="checkDoorCode()">Submit</button>
        ${hint}
    `;
    
    puzzleContainer.style.display = 'block';
    puzzleContainer.style.display = 'block';
    
}

// Check door code
function checkDoorCode() {
    const input = document.getElementById('door-code-input').value;
    const puzzleContainer = document.getElementById('puzzle-container');
    
    if (input === gameState.doorCode) {
        // Determine which ending they get based on how much they discovered
        let endingText = '';
        let endingTitle = '';
        
        if (gameState.discoveredClues.includes('phoenix-details')) {
            endingTitle = 'FULL DISCOVERY ENDING';
            endingText = `
                <p>The door hisses open. As you step through, the lab's self-destruct sequence activates behind you - just as the final notes predicted.</p>
                <p>You realize with horror that you were Subject 314. The serum worked - you've been regenerating for a full year, stuck in a cycle of awakening and deterioration. The numbers 314 weren't random - they were your countdown.</p>
                <p>As you emerge into sunlight, your skin begins to tingle. The cycle begins anew...</p>
            `;
        } else if (gameState.puzzlesSolved >= 5) {
            endingTitle = 'PARTIAL ENDING';
            endingText = `
                <p>The door unlocks with a satisfying clunk. You've escaped!</p>
                <p>As you leave, you glance back at the lab. There's so much you didn't understand - the Phoenix Project, Subject 314, those strange cells under the microscope.</p>
                <p>Somewhere deep down, a voice whispers that you've forgotten something important... but the door seals shut behind you.</p>
            `;
        } else {
            endingTitle = 'ESCAPE ENDING';
            endingText = `
                <p>The door swings open! You rush out into freedom without looking back.</p>
                <p>You may have escaped the lab, but its mysteries remain unsolved. What was Project Phoenix? Who was Dr. Alchem? And most importantly... why can't you remember how you got there?</p>
            `;
        }
        
        puzzleContainer.innerHTML = `
            <h3 class="success">${endingTitle}</h3>
            <div class="story-reveal">
                ${endingText}
            </div>
            <p>You solved ${gameState.puzzlesSolved} of 7 possible puzzles.</p>
            <button onclick="location.reload()">Play Again</button>
        `;
    } else {
        alert('INCORRECT CODE\nAccess denied!');
    }
}

// Initialize the game when page loads
window.onload = initGame;