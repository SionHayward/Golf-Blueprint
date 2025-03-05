// Shot tracking script
let shotCount = 0;
let puttCount = 0;
let shots = [];

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
        yPercent: (y / rect.height) * 100
    };
    
    // Add to shots array
    shots.push(shot);
    
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
    if (shotCount > 0) {
        // Remove the last shot from the array
        shots.pop();
        shotCount--;
        
        // Remove the last visual marker
        const markers = document.querySelectorAll('.shot-marker');
        if (markers.length > 0) {
            markers[markers.length - 1].remove();
        }
        
        // Update display
        updateDisplay();
        
        // Save updated data
        saveHoleData();
    }
}

function adjustPutts(amount) {
    // Adjust putt count, ensuring it doesn't go below 0
    puttCount = Math.max(0, puttCount + amount);
    
    // Update display
    updateDisplay();
    
    // Save updated data
    saveHoleData();
}

function updateDisplay() {
    // Update shot counter
    document.getElementById('shotCount').textContent = shotCount;
    
    // Update putt counter
    document.getElementById('puttCount').textContent = puttCount;
    
    // Update total
    document.getElementById('totalShots').textContent = shotCount + puttCount;
}

function submitScore() {
    // Calculate final score
    const totalScore = shotCount + puttCount;
    
    // Get hole number from the URL or page content
    const holeNumber = getHoleNumber();
    
    // Construct hole data object with all information
    const holeData = {
        holeNumber: holeNumber,
        holeScore: totalScore,
        shotCount: shotCount,
        puttCount: puttCount,
        shots: shots
    };
    
    // Save to localStorage
    saveScoreToLocalStorage(holeNumber, holeData);
    
    // Show confirmation
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = `Score of ${totalScore} saved for Hole ${holeNumber}!`;
    
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
        
        // Restore shots array
        shots = holeData.shots || [];
        
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
        holeScore: shotCount + puttCount,
        shots: shots
    };
    
    // Save to localStorage
    saveScoreToLocalStorage(holeNumber, holeData);
}