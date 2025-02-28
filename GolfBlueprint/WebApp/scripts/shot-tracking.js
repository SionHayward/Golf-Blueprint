let shots = [];
let shotCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    const fullHoleView = document.getElementById('fullHoleView');
    
    if (fullHoleView) {
        // Load any existing data for this hole
        loadExistingData();
        
        // Set up click handler
        fullHoleView.addEventListener('click', function(event) {
            // Determine which zone was clicked
            const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
            let zoneName = 'Out of play';
            
            if (clickedElement.classList.contains('zone')) {
                zoneName = clickedElement.dataset.zoneName;
            }

            // Get coordinates relative to container
            const rect = fullHoleView.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Create shot marker
            const shotMarker = document.createElement('div');
            shotMarker.className = 'shot-marker';
            shotMarker.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="6" fill="white" stroke="black"/>
                </svg>
            `;

            shotMarker.style.left = `${x}px`;
            shotMarker.style.top = `${y}px`;
            fullHoleView.appendChild(shotMarker);

            // Add shot to array and update count
            shots.push({
                marker: shotMarker,
                data: {
                    zone: zoneName,
                    x: x / rect.width * 100,
                    y: y / rect.height * 100
                }
            });
            shotCount++;
            updateShotDisplay();
            
            console.log('Shot placed:', shots[shots.length - 1].data);
        });

        // Zone Hover
        const labelDisplay = document.createElement('div');
        labelDisplay.id = 'zoneNameDisplay';
        labelDisplay.classList.add('zone-name-display');

        fullHoleView.appendChild(labelDisplay);

        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
            zone.addEventListener('mouseenter', () => {
                const zoneName = zone.dataset.zoneName;
                labelDisplay.textContent = zoneName;
                labelDisplay.style.display = 'block';
            });

            zone.addEventListener('mouseleave', () => {
                labelDisplay.style.display = 'none';
            });
        });
    } else {
        console.error('fullHoleView element not found');
    }
});

function loadExistingData() {
    const currentHole = parseInt(document.querySelector('.hole-title').textContent.split(' ')[1]);
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    
    console.log('Current Hole:', currentHole);
    console.log('Round Data:', roundData);
    
    // Calculate total score from completed holes
    let roundTotal = 0;
    for (let i = 1; i < currentHole; i++) {
        if (roundData[`hole${i}`]) {
            console.log(`Adding score from hole ${i}:`, roundData[`hole${i}`].holeScore);
            roundTotal += roundData[`hole${i}`].holeScore;
        }
    }
    
    console.log('Round Total calculated:', roundTotal);

    // Create running total display
    const scoreContainer = document.querySelector('.score-container');
    const runningTotalDiv = document.createElement('div');
    runningTotalDiv.className = 'running-total';
    
    if (currentHole === 1) {
        runningTotalDiv.innerHTML = `<p>Starting Round</p>`;
    } else {
        const previousHole = currentHole - 1;
        runningTotalDiv.innerHTML = `
            <p>Round Total: ${roundTotal} (through hole ${previousHole})</p>
        `;
    }
    scoreContainer.appendChild(runningTotalDiv);

    // Load current hole data if it exists
    if (roundData[`hole${currentHole}`]) {
        const holeData = roundData[`hole${currentHole}`];
        console.log('Loading hole data:', holeData);
        
        // Restore shots
        if (holeData.shots && holeData.shots.length > 0) {
            holeData.shots.forEach(shotData => {
                const fullHoleView = document.getElementById('fullHoleView');
                
                const shotMarker = document.createElement('div');
                shotMarker.className = 'shot-marker';
                shotMarker.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" fill="white" stroke="black"/>
                    </svg>
                `;

                shotMarker.style.left = `${shotData.x}%`;
                shotMarker.style.top = `${shotData.y}%`;
                fullHoleView.appendChild(shotMarker);

                shots.push({
                    marker: shotMarker,
                    data: shotData
                });
            });
            
            shotCount = holeData.regularShots;
            document.getElementById('puttCount').textContent = holeData.putts || 0;
            updateShotDisplay();
        }
    }
}

function adjustPutts(change) {
    const puttSpan = document.getElementById('puttCount');
    let currentPutts = parseInt(puttSpan.textContent) || 0;
    currentPutts = Math.max(0, currentPutts + change); // Prevent negative putts
    puttSpan.textContent = currentPutts;
    updateHoleScore();
}

function removeLastShot() {
    if (shots.length > 0) {
        const lastShot = shots.pop();
        lastShot.marker.remove();
        shotCount--;
        updateShotDisplay();
    }
}

function updateShotDisplay() {
    document.getElementById('shotCount').textContent = shotCount;
    updateHoleScore();
}

function updateHoleScore() {
    const putts = parseInt(document.getElementById('puttCount').textContent) || 0;
    const holeScore = shotCount + putts;
    document.getElementById('totalShots').textContent = holeScore;
}

function submitScore() {
    const putts = parseInt(document.getElementById('puttCount').textContent) || 0;
    const holeScore = shotCount + putts;
    
    const currentHole = parseInt(document.querySelector('.hole-title').textContent.split(' ')[1]);
    const nextHole = currentHole + 1;
    
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    
    // Save to database - ADD THIS LINE
    saveRoundToDatabase();
    
    // Get existing round data
    let roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    
    // Save current hole data
    roundData[`hole${currentHole}`] = {
        regularShots: shotCount,
        putts: putts,
        holeScore: holeScore,
        shots: shots.map(shot => shot.data)
    };

    // Calculate round total including current hole
    let roundTotal = 0;
    for (let i = 1; i <= currentHole; i++) {
        if (roundData[`hole${i}`]) {
            roundTotal += roundData[`hole${i}`].holeScore;
        }
    }

    // Save to localStorage
    localStorage.setItem('currentRound', JSON.stringify(roundData));
    
    // Show confirmation message
    document.getElementById('confirmationMessage').textContent = 
        `Hole ${currentHole} Score: ${holeScore} (${shotCount} shots + ${putts} putts). Round Total: ${roundTotal}`;
    
    setTimeout(() => {
        if (currentHole === 18) {
            window.location.href = '../round-summary.html';
        } else {
            window.location.href = `hole${nextHole}.html`;
        }
    }, 2000);
}

function calculateRoundTotal() {
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    let total = 0;
    
    for (let i = 1; i <= 18; i++) {
        if (roundData[`hole${i}`]) {
            total += roundData[`hole${i}`].holeScore;
        }
    }
    
    return total;
}

function isHoleComplete(holeNumber) {
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    return !!roundData[`hole${holeNumber}`];
}

function getHoleScore(holeNumber) {
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    return roundData[`hole${holeNumber}`]?.holeScore || 0;
}

function saveRoundToDatabase() {
    // Get existing round data from localStorage
    const roundData = JSON.parse(localStorage.getItem('currentRound') || '{}');
    
    // Show saving message
    document.getElementById('confirmationMessage').textContent = 'Saving to database...';
    
    // Send data to server
    fetch('http://localhost:3000/api/save-round', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            holes: roundData
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('confirmationMessage').textContent = 
                'Round saved to database successfully!';
            console.log('Round saved to database with ID:', data.roundId);
        } else {
            document.getElementById('confirmationMessage').textContent = 
                'Error saving to database. Data saved locally.';
            console.error('Database save error:', data.error);
        }
    })
    .catch(error => {
        document.getElementById('confirmationMessage').textContent = 
            'Error saving to database. Data saved locally.';
        console.error('Failed to save to database:', error);
    });
}