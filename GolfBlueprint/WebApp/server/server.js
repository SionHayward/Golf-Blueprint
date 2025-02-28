// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ripdaniel',
  database: 'golf_blueprint'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Test database connection
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is connected to database' });
});

// Save a round
app.post('/api/save-round', (req, res) => {
  const roundData = req.body;
  console.log('Received round data:', roundData);
  
  // Find the default user's ID
  db.query('SELECT user_id FROM Users WHERE username = "default_user"', (err, users) => {
    if (err) {
      console.error('Error finding default user:', err);
      return res.status(500).json({ error: 'Failed to find default user' });
    }
    
    if (users.length === 0) {
      // Create default user if it doesn't exist
      db.query(
        'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
        ['default_user', 'default@example.com', 'placeholder'],
        (err, result) => {
          if (err) {
            console.error('Error creating default user:', err);
            return res.status(500).json({ error: 'Failed to create default user' });
          }
          
          const defaultUserId = result.insertId;
          insertRound(defaultUserId);
        }
      );
    } else {
      const defaultUserId = users[0].user_id;
      insertRound(defaultUserId);
    }
  });
  
  function insertRound(userId) {
    // Insert round info into database
    db.query(
      'INSERT INTO Rounds (user_id, date_played) VALUES (?, ?)',
      [userId, new Date()],
      (err, result) => {
        if (err) {
          console.error('Error saving round:', err);
          return res.status(500).json({ error: 'Failed to save round' });
        }
        
        const roundId = result.insertId;
        
        // Process each hole in the round
        const holes = roundData.holes || {};
        const holePromises = [];
        
        Object.keys(holes).forEach(holeKey => {
          const holeNumber = parseInt(holeKey.replace('hole', ''));
          const holeData = holes[holeKey];
          
          // Find or create the hole
          const holePromise = new Promise((resolve, reject) => {
            db.query(
              'SELECT hole_id FROM Holes WHERE hole_number = ?',
              [holeNumber],
              (err, holes) => {
                if (err) return reject(err);
                
                let getHoleId;
                if (holes.length === 0) {
                  // Create hole if it doesn't exist
                  getHoleId = new Promise((resolve, reject) => {
                    db.query(
                      'INSERT INTO Holes (hole_number, par, distance_yards) VALUES (?, ?, ?)',
                      [holeNumber, 4, 400], // Default values
                      (err, result) => {
                        if (err) return reject(err);
                        resolve(result.insertId);
                      }
                    );
                  });
                } else {
                  getHoleId = Promise.resolve(holes[0].hole_id);
                }
                
                getHoleId.then(holeId => {
                  // Save hole score
                  db.query(
                    'INSERT INTO RoundHoles (round_id, hole_id, score, putts) VALUES (?, ?, ?, ?)',
                    [roundId, holeId, holeData.holeScore, holeData.putts],
                    (err, result) => {
                      if (err) return reject(err);
                      
                      const roundHoleId = result.insertId;
                      
                      // Save shots if available
                      if (holeData.shots && holeData.shots.length > 0) {
                        const shotPromises = [];
                        
                        holeData.shots.forEach((shot, index) => {
                          // First check if we need to create a zone for this shot
                          const processShotZone = new Promise((resolve, reject) => {
                            // Try to find existing zone with this name for this hole
                            db.query(
                              'SELECT zone_id FROM Zones WHERE hole_id = ? AND zone_name = ?',
                              [holeId, shot.zone || 'Default Zone'],
                              (err, zones) => {
                                if (err) return reject(err);
                                
                                if (zones.length === 0) {
                                  // Create a new zone
                                  db.query(
                                    'INSERT INTO Zones (hole_id, zone_name) VALUES (?, ?)',
                                    [holeId, shot.zone || 'Default Zone'],
                                    (err, result) => {
                                      if (err) return reject(err);
                                      resolve(result.insertId);
                                    }
                                  );
                                } else {
                                  resolve(zones[0].zone_id);
                                }
                              }
                            );
                          });
                          
                          // Use the zone to create the shot
                          const shotPromise = processShotZone.then(zoneId => {
                            return new Promise((resolve, reject) => {
                              db.query(
                                'INSERT INTO Shots (round_hole_id, shot_number, zone_id) VALUES (?, ?, ?)',
                                [roundHoleId, index + 1, zoneId],
                                (err, result) => {
                                  if (err) return reject(err);
                                  resolve(result.insertId);
                                }
                              );
                            });
                          });
                          
                          shotPromises.push(shotPromise);
                        });
                        
                        Promise.all(shotPromises)
                          .then(() => resolve())
                          .catch(err => reject(err));
                      } else {
                        resolve();
                      }
                    }
                  );
                })
                .catch(err => reject(err));
              }
            );
          });
          
          holePromises.push(holePromise);
        });
        
        Promise.all(holePromises)
          .then(() => {
            res.json({ 
              success: true, 
              roundId: roundId,
              message: 'Round saved successfully' 
            });
          })
          .catch(err => {
            console.error('Error saving hole data:', err);
            res.status(500).json({ error: 'Failed to save hole data' });
          });
      }
    );
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});