// Shot tracking script
let shotCount = 0;
let puttCount = 0;
let penaltyCount = 0; // Add variable for penalty strokes
let shots = [];
let actionHistory = []; // Track all actions chronologically

document.addEventListener('DOMContentLoaded', function() {
    // Initialize from localStorage if available
    loadHoleData();
    
    // Add click event to the hole view container
    const holeView = document.getElementById('fullHoleView');
    if (holeView) {
        holeView.addEventListener('click', recordShot);
    }
    
    // Update display
    updateDisplay();
});

function recordShot(event) {
    // Get hole container
    const container = document.getElementById('fullHoleView');
    
    // Calculate position relative to the container
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Determine which zone was clicked
    const zone = getZoneAtPosition(event.target);
    
    // Increment shot counter
    shotCount++;
    
    // Create a new shot object
    const shot = {
        number: shotCount,
        x: x,
        y: y,
        zone: zone,
        xPercent: (x / rect.width) * 100,
        yPercent: (y / rect.height) * 100,
        type: 'shot' // Identify this as a regular shot
    };
    
    // Add to shots array
    shots.push(shot);
    
    // Add to action history
    actionHistory.push({
        type: 'shot',
        shotIndex: shots.length - 1
    });
    
    // Add visual marker
    addShotMarker(shot);
    
    // Update the display
    updateDisplay();
    
    // Save data
    saveHoleData();
}

function addShotMarker(shot) {
    const container = document.getElementById('fullHoleView');
    
    // Create marker element
    const marker = document.createElement('div');
    marker.className = 'shot-marker';
    marker.textContent = shot.number; // Add shot number inside marker
    
    // Set position
    marker.style.left = shot.x + 'px';
    marker.style.top = shot.y + 'px';
    
    // Add data attributes for potential future use
    marker.dataset.shotNumber = shot.number;
    marker.dataset.zone = shot.zone;
    
    // Add to container
    container.appendChild(marker);
}

function getZoneAtPosition(element) {
    // If element is a zone, return its name
    if (element && element.classList.contains('zone')) {
        return element.dataset.zoneName || 'Unknown';
    }
    
    return 'Unknown';
}

function removeLastShot() {
    // Check if we have any actions to undo
    if (actionHistory.length > 0) {
        // Get the last action
        const lastAction = actionHistory.pop();
        
        if (lastAction.type === 'shot') {
            // Remove the last shot from the array
            shots.splice(lastAction.shotIndex, 1);
            shotCount--;
            
            // Remove the last visual marker
            const markers = document.querySelectorAll('.shot-marker');
            if (markers.length > 0) {
                markers[markers.length - 1].remove();
            }
        } else if (lastAction.type === 'penalty') {
            // Decrement penalty count
            penaltyCount--;
            
            // Show a brief confirmation
            const confirmationMessage = document.getElementById('penaltyConfirmation');
            if (confirmationMessage) {
                confirmationMessage.textContent = "Penalty stroke removed";
                confirmationMessage.style.display = "block";
                
                // Hide after 2 seconds
                setTimeout(() => {
                    confirmationMessage.style.display = "none";
                }, 2000);
            }
        } else if (lastAction.type === 'putt') {
            // Decrement putt count
            puttCount--;
        }
        
        // Update display
        updateDisplay();
        
        // Save updated data
        saveHoleData();
    }
}

// New function to add a penalty stroke
function addPenaltyStroke() {
    // Increment penalty count
    penaltyCount++;
    
    // Add to action history
    actionHistory.push({
        type: 'penalty'
    });
    
    // Update display
    updateDisplay();
    
    // Save updated data
    saveHoleData();
    
    // Show a brief confirmation
    const confirmationMessage = document.getElementById('penaltyConfirmation');
    if (confirmationMessage) {
        confirmationMessage.textContent = "Penalty stroke added";
        confirmationMessage.style.display = "block";
        
        // Hide after 2 seconds
        setTimeout(() => {
            confirmationMessage.style.display = "none";
        }, 2000);
    }
}

function adjustPutts(amount) {
    // Adjust putt count, ensuring it doesn't go below 0
    if (puttCount + amount >= 0) {
        puttCount += amount;
        
        // Add to action history
        actionHistory.push({
            type: 'putt',
            amount: amount
        });
        
        // Update display
        updateDisplay();
        
        // Save updated data
        saveHoleData();
    }
}

function updateDisplay() {
    // Update shot counter
    document.getElementById('shotCount').textContent = shotCount;
    
    // Update putt counter
    document.getElementById('puttCount').textContent = puttCount;
    
    // Update penalty counter if element exists
    if (document.getElementById('penaltyCount')) {
        document.getElementById('penaltyCount').textContent = penaltyCount;
    }
    
    // Update total - now includes penalty strokes
    document.getElementById('totalShots').textContent = shotCount + puttCount + penaltyCount;
}

function submitScore() {
    // Calculate final score - now includes penalty strokes
    const totalScore = shotCount + puttCount + penaltyCount;
    
    // Get hole number from the URL or page content
    const holeNumber = getHoleNumber();
    
    // Construct hole data object with all information
    const holeData = {
        holeNumber: holeNumber,
        holeScore: totalScore,
        shotCount: shotCount,
        puttCount: puttCount,
        penaltyCount: penaltyCount, // Add penalty count to the data
        shots: shots,
        actionHistory: actionHistory // Save action history
    };
    
    // Save to localStorage
    saveScoreToLocalStorage(holeNumber, holeData);
    
    // Show confirmation
    const confirmationMessage = document.getElementById('confirmationMessage');
    if (confirmationMessage) {
        confirmationMessage.textContent = `Score of ${totalScore} saved for Hole ${holeNumber}!`;
    } else {
        // If no confirmation element exists, create a temporary one
        const tempConfirmation = document.createElement('div');
        tempConfirmation.textContent = `Score of ${totalScore} saved for Hole ${holeNumber}!`;
        tempConfirmation.style.position = 'fixed';
        tempConfirmation.style.top = '50%';
        tempConfirmation.style.left = '50%';
        tempConfirmation.style.transform = 'translate(-50%, -50%)';
        tempConfirmation.style.padding = '20px';
        tempConfirmation.style.backgroundColor = '#4CAF50';
        tempConfirmation.style.color = 'white';
        tempConfirmation.style.borderRadius = '5px';
        tempConfirmation.style.zIndex = '1000';
        document.body.appendChild(tempConfirmation);
        
        // Remove after timeout
        setTimeout(() => {
            document.body.removeChild(tempConfirmation);
        }, 1400);
    }
    
    // Determine next hole number
    const nextHole = holeNumber < 18 ? holeNumber + 1 : 0;
    
    // Navigate to next hole or summary page
    setTimeout(function() {
        if (nextHole > 0) {
            window.location.href = `hole${nextHole}.html`;
        } else {
            window.location.href = '../round-summary.html';
        }
    }, 1500);
}

function getHoleNumber() {
    // Extract from URL pattern like "hole1.html"
    const urlMatch = window.location.pathname.match(/hole(\d+)\.html/);
    if (urlMatch && urlMatch[1]) {
        return parseInt(urlMatch[1]);
    }
    
    // If URL doesn't match, try to find it in the page title
    const titleElement = document.querySelector('.hole-title');
    if (titleElement) {
        const titleMatch = titleElement.textContent.match(/Hole\s+(\d+)/i);
        if (titleMatch && titleMatch[1]) {
            return parseInt(titleMatch[1]);
        }
    }
    
    // Default to 1 if we can't determine it
    return 1;
}

function saveScoreToLocalStorage(holeNumber, holeData) {
    // Get current round data from localStorage
    let roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    
    // Add this hole's data
    roundData[`hole${holeNumber}`] = holeData;
    
    // Save back to localStorage
    localStorage.setItem('currentRound', JSON.stringify(roundData));
}

function loadHoleData() {
    // Get hole number
    const holeNumber = getHoleNumber();
    
    // Get current round data from localStorage
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    
    // Check if we have data for this hole
    const holeKey = `hole${holeNumber}`;
    if (roundData[holeKey]) {
        const holeData = roundData[holeKey];
        
        // Restore counts
        shotCount = holeData.shotCount || 0;
        puttCount = holeData.puttCount || 0;
        penaltyCount = holeData.penaltyCount || 0; // Restore penalty count
        
        // Restore shots array
        shots = holeData.shots || [];
        
        // Restore action history
        actionHistory = holeData.actionHistory || [];
        
        // Restore visual markers
        shots.forEach(addShotMarker);
    }
}

function saveHoleData() {
    // Get hole number
    const holeNumber = getHoleNumber();
    
    // Create hole data
    const holeData = {
        holeNumber: holeNumber,
        shotCount: shotCount,
        puttCount: puttCount,
        penaltyCount: penaltyCount, // Save penalty count
        holeScore: shotCount + puttCount + penaltyCount, // Include penalties in score
        shots: shots,
        actionHistory: actionHistory // Save action history
    };
    
    // Save to localStorage
    saveScoreToLocalStorage(holeNumber, holeData);
}