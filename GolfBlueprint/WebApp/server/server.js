// server.js
const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for Promise API
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For password hashing

const app = express();
const PORT = 3000;

// Database connection pool (created first, before routes)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ripdaniel',
  database: 'golf_blueprint',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to hash passwords
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

// Helper function to validate password
function validatePassword(password, storedHash, storedSalt) {
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ message: 'Server is connected to database', test: rows[0].test });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// REGISTER endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  
  try {
    // Check if user already exists
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (users.length > 0) {
      const existingUser = users[0];
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already in use' });
      } else {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }
    
    // Hash the password
    const { salt, hash } = hashPassword(password);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO Users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)',
      [username, email, hash, salt]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user_id: result.insertId
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// LOGIN endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Validate password
    if (validatePassword(password, user.password_hash, user.salt)) {
      // Return user info (excluding password)
      res.json({
        user_id: user.user_id,
        username: user.username,
        email: user.email
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SUBMIT ROUND endpoint
app.post('/api/submit-round', async (req, res) => {
  const roundData = req.body;
  console.log('Received complete round data:', roundData);
  
  // Validate the data
  if (!roundData || !roundData.holes || Object.keys(roundData.holes).length === 0) {
    return res.status(400).json({ error: 'Invalid round data. No holes found.' });
  }
  
  // Start a transaction to ensure data integrity
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    console.log('Starting transaction to save round');
    
    // 1. Insert the Round
    console.log('Inserting round with user_id:', roundData.userId || 1, 'date_played:', new Date(roundData.datePlayed || Date.now()));
    const [roundResult] = await connection.execute(
      'INSERT INTO Rounds (user_id, course_id, date_played) VALUES (?, ?, ?)',
      [roundData.userId || 1, roundData.courseId || 1, new Date(roundData.datePlayed || Date.now())]
    );
    
    const roundId = roundResult.insertId;
    console.log('Created round with ID:', roundId);
    
    // 2. Process each hole
    for (const holeKey in roundData.holes) {
      const holeNumber = parseInt(holeKey.replace('hole', ''));
      const holeData = roundData.holes[holeKey];
      
      console.log(`Processing hole ${holeNumber} with score: ${holeData.holeScore}, putts: ${holeData.putts}`);
      
      // Get hole_id
      const [holes] = await connection.execute(
        'SELECT hole_id FROM Holes WHERE hole_number = ? AND course_id = ?',
        [holeNumber, roundData.courseId || 1]
      );
      
      if (holes.length === 0) {
        throw new Error(`Hole ${holeNumber} not found in the database`);
      }
      
      const holeId = holes[0].hole_id;
      console.log(`Found hole_id: ${holeId} for hole number ${holeNumber}`);
      
      // Insert RoundHole
      const [roundHoleResult] = await connection.execute(
        'INSERT INTO RoundHoles (round_id, hole_id, score, putts) VALUES (?, ?, ?, ?)',
        [roundId, holeId, holeData.holeScore, holeData.putts || 0]
      );
      
      const roundHoleId = roundHoleResult.insertId;
      console.log(`Created round_hole with ID: ${roundHoleId}`);
      
      // Process shots if available
      if (holeData.shots && holeData.shots.length > 0) {
        console.log(`Processing ${holeData.shots.length} shots for hole ${holeNumber}`);
        
        for (let i = 0; i < holeData.shots.length; i++) {
          const shot = holeData.shots[i];
          console.log(`Shot ${i+1} zone: "${shot.zone}"`);
          
          // Determine zone type based on the zone name
          let zoneType = 'Other';
          const zoneName = shot.zone || 'Out of play';
          
          if (zoneName.toLowerCase().includes('fairway')) zoneType = 'Fairway';
          else if (zoneName.toLowerCase().includes('rough')) zoneType = 'Rough';
          else if (zoneName.toLowerCase().includes('green')) zoneType = 'Green';
          else if (zoneName.toLowerCase().includes('bunker') || zoneName.toLowerCase().includes('sand')) zoneType = 'Bunker';
          else if (zoneName.toLowerCase().includes('water') || zoneName.toLowerCase().includes('lake')) zoneType = 'Water';
          else if (zoneName.toLowerCase().includes('tree')) zoneType = 'Trees';
          else if (zoneName.toLowerCase().includes('out of bounds') || zoneName.toLowerCase().includes('ob')) zoneType = 'Out of Bounds';
          else if (zoneName.toLowerCase().includes('tee')) zoneType = 'Tee';
          
          // Find or create zone
          let zoneId;
          
          const [zones] = await connection.execute(
            'SELECT zone_id FROM Zones WHERE hole_id = ? AND zone_name = ?',
            [holeId, zoneName]
          );
          
          if (zones.length === 0) {
            // Create a new zone
            console.log(`Creating new zone: "${zoneName}" of type: ${zoneType}`);
            const [zoneResult] = await connection.execute(
              'INSERT INTO Zones (hole_id, zone_name, zone_type) VALUES (?, ?, ?)',
              [holeId, zoneName, zoneType]
            );
            zoneId = zoneResult.insertId;
          } else {
            zoneId = zones[0].zone_id;
            console.log(`Using existing zone_id: ${zoneId} for zone: "${zoneName}"`);
          }
          
          // Insert shot
          try {
            console.log(`Inserting shot with coordinates: x=${shot.x}, y=${shot.y}`);
            await connection.execute(
              'INSERT INTO Shots (round_hole_id, shot_number, zone_id, x_coordinate, y_coordinate) VALUES (?, ?, ?, ?, ?)',
              [roundHoleId, i + 1, zoneId, shot.x || null, shot.y || null]
            );
          } catch (shotError) {
            console.error('Error inserting shot:', shotError);
            throw new Error(`Failed to insert shot ${i+1} for hole ${holeNumber}: ${shotError.message}`);
          }
        }
      } else {
        console.log(`No shots data available for hole ${holeNumber}`);
      }
    }
    
    // Commit the transaction
    await connection.commit();
    console.log('Transaction committed successfully');
    
    // Return success response
    res.json({
      success: true,
      roundId: roundId,
      message: 'Round saved successfully'
    });
    
  } catch (error) {
    // If any error occurs, roll back the transaction
    console.error('Error in transaction:', error);
    
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back due to error');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }
    
    res.status(500).json({ error: error.message || 'Failed to save round' });
  } finally {
    // Release the connection
    if (connection) {
      try {
        connection.release();
        console.log('Database connection released');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
});

app.get('/api/hole-stats', async (req, res) => {
  const { hole, shot, datePeriod } = req.query;
  
  if (!hole) {
    return res.status(400).json({ error: 'Hole number is required' });
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Build the query based on filters
    let dateFilter = '';
    if (datePeriod === 'this-year') {
      dateFilter = 'AND YEAR(r.date_played) = YEAR(CURDATE())';
    } else if (datePeriod === 'last-5' || datePeriod === 'last-10') {
      const limit = datePeriod === 'last-5' ? 5 : 10;
      dateFilter = `AND r.round_id IN (SELECT round_id FROM Rounds ORDER BY date_played DESC LIMIT ${limit})`;
    }
    
    let shotFilter = '';
    if (shot && shot !== 'all') {
      shotFilter = `AND s.shot_number = ${parseInt(shot)}`;
    }
    
    // Main query to get zone statistics
    const query = `
      SELECT 
        z.zone_name,
        AVG(rh.score) AS average_score,
        COUNT(DISTINCT s.shot_id) AS shot_count,
        MIN(rh.score) AS best_score,
        MAX(rh.score) AS worst_score,
        z.zone_type
      FROM Shots s
      JOIN Zones z ON s.zone_id = z.zone_id
      JOIN RoundHoles rh ON s.round_hole_id = rh.round_hole_id
      JOIN Holes h ON rh.hole_id = h.hole_id
      JOIN Rounds r ON rh.round_id = r.round_id
      WHERE h.hole_number = ?
      ${shotFilter}
      ${dateFilter}
      GROUP BY z.zone_name, z.zone_type
      ORDER BY average_score ASC
    `;
    
    const [results] = await connection.execute(query, [parseInt(hole)]);
    
    // Get coordinates from shot data for visualization
    const coordQuery = `
      SELECT 
        z.zone_name,
        AVG(s.x_coordinate) AS avg_x,
        AVG(s.y_coordinate) AS avg_y,
        COUNT(s.shot_id) AS shot_count
      FROM Shots s
      JOIN Zones z ON s.zone_id = z.zone_id
      JOIN RoundHoles rh ON s.round_hole_id = rh.round_hole_id
      JOIN Holes h ON rh.hole_id = h.hole_id
      WHERE h.hole_number = ?
      ${shotFilter}
      ${dateFilter}
      GROUP BY z.zone_name
    `;
    
    const [coordResults] = await connection.execute(coordQuery, [parseInt(hole)]);
    
    // Calculate par for the hole
    const [parResult] = await connection.execute(
      'SELECT par FROM Holes WHERE hole_number = ? AND course_id = 1',
      [parseInt(hole)]
    );
    
    const par = parResult[0]?.par || 4;
    
    // Combine statistics with coordinates
    const combinedResults = results.map(stat => {
      const coords = coordResults.find(c => c.zone_name === stat.zone_name);
      
      // Determine if this zone is good, bad, or neutral
      let status = 'neutral';
      if (stat.average_score <= par) {
        status = 'good';
      } else if (stat.average_score >= par + 1) {
        status = 'bad';
      }
      
      return {
        zone: stat.zone_name,
        zoneType: stat.zone_type,
        avgScore: parseFloat(stat.average_score),
        count: parseInt(stat.shot_count),
        bestScore: parseInt(stat.best_score),
        worstScore: parseInt(stat.worst_score),
        x: coords?.avg_x ? parseFloat(coords.avg_x) : 50,
        y: coords?.avg_y ? parseFloat(coords.avg_y) : 50,
        status: status
      };
    });
    
    res.json({
      holeNumber: parseInt(hole),
      par: par,
      zones: combinedResults
    });
    
  } catch (error) {
    console.error('Error fetching hole statistics:', error);
    res.status(500).json({ error: 'Failed to fetch hole statistics' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Serve static files (AFTER defining all API routes)
app.use(express.static('/Users/sionhayward/Documents/GitHub/Golf-Blueprint/GolfBlueprint/WebApp'));

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Test database connection on startup
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
});