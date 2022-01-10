# Template

Implements Service Node messaging and parses horizontal and vertical angle information to indicate when a predefined region is selected. Useful for determining speaker position with beamforming microphones.

## Usage

`git clone https://github.com/catchtechnologies/angle-parser.git`
`cd angle-parser`  
`npm install`  
`node main.js --debug true --calculateDelay 1000 --publishChangesOnly true --region1MinEl 0 --region1MaxEl 45 --region1MinAz 0 --region1MaxAz 170 --region2MinEl 46 --region2MaxEl 90 --region2MinAz 171 --region2MaxAz 359`
