# The Golf Blueprint

A data-driven golf course management tool providing analytics-based insights for The Kendleshire Golf Club.

## Project Overview

The Golf Blueprint transforms how amateur golfers approach course management at The Kendleshire Golf Club. By collecting and analysing shot data from multiple players, the system provides visual heatmaps and strategic recommendations to help golfers make better decisions, avoid trouble areas, and ultimately lower their scores.

Research found 80% of amateur golfers have average or worse understanding of course management, despite this being a crucial factor in performance improvement. This tool bridges that knowledge gap through accessible data visualisation.

## Features

- **Interactive Hole Visualisations**: Detailed SVG recreations of all 18 holes at The Kendleshire
- **Shot Data Collection System**: Simple interface for recording precise shot locations
- **Heatmap Analytics**: Color-coded visualisations showing optimal target areas and zones to avoid
- **User Profiles**: Track personal progress and round history
- **Zone-Specific Insights**: Statistical breakdown of performance in different course areas

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Architecture**: Client-Server following MVC pattern
- **Development Methodology**: Agile (Kanban)
- **Design Tools**: Inkscape for SVG creation
- **Data Source**: Google Earth satellite imagery for initial hole mapping

## Usage

1. Create an account or log in
2. Select "Record Round" to begin tracking shots
3. For each hole, click on the map to indicate where your shots landed
4. Enter additional information (putts, penalties)
5. Submit your data to contribute to the analytics
6. Visit the "Hole Analysis" section to view heatmaps and strategy recommendations

7. ## Development

The system was developed through the following process:

1. Primary research with 86 golfers at The Kendleshire to validate concept
2. Requirements specification using MoSCoW prioritisation
3. SVG recreation of all 18 holes using Google Earth imagery and Inkscape
4. Database design with normalised schema for efficient data storage
5. Frontend implementation focusing on intuitive user experience
6. Algorithm development for shot tracking and heatmap visualisation
7. Comprehensive testing across core functionality

## Testing

The system underwent extensive testing with 31 test cases across four key components:
- User Authentication
- Profile Access
- Hole/Shot Analysis
- Round Recording

100% of must-have requirements were successfully implemented.

## Future Plans

- Mobile application development for on-course shot recording
- Integration with official handicap systems
- Expansion to multiple golf courses
- Enhanced analytics including weather condition variables
- Personalised improvement recommendations
- Public Release

## Author

Sion Hayward - Software Engineering for Business, University of the West of England

*Note: This project was developed as part of a Software Development Project (UFCFFF-30-3) at the University of the West of England.*
