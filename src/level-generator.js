export default function GenerateLevel(numberOfColours, tubeSize) {

	console.log('Generating level with ' + numberOfColours + ' colours!')

	// let coloursInPlay = ['red', 'blue', 'green', 'yellow', 'orange', 'purple']
	// 	.slice(0, numberOfColours);

	let coloursInPlay = ['#a7e8c8', '#f8b6a8', '#fdffb4', '#f7c2d6', '#c3effc', '#e0bbe4']
		.slice(0, numberOfColours);

	let coloursUsed = new Map();

	coloursInPlay.forEach((colour) => {
		coloursUsed.set(colour, 0);
	});

	let tubes = [];

	for (var i = 0; i < numberOfColours; i++) {
		var liquids = [];

		for (var j = 1; j <= tubeSize; j++) {

			var randomColour = coloursInPlay[getRandomInt(0, numberOfColours)];

			// Get another random number if this ones full.
			while (coloursUsed.get(randomColour) >= tubeSize) {
				randomColour = coloursInPlay[getRandomInt(0, numberOfColours)];
			}			

			liquids.push(randomColour);
			coloursUsed.set(randomColour, coloursUsed.get(randomColour) + 1);
		}

		tubes.push({ selected: false, liquids: liquids });
	}

	// Add the two empty tubes
	tubes.push({ selected: false, liquids: [] });
	tubes.push({ selected: false, liquids: [] });

	return tubes;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}