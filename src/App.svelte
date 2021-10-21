<script>
	export let name;

	let tubeCapacity = 4;

	// Rules:
	// - One colour poured at a time.
	// - Like colours merge.
	// - Can only pour like colours onto each other.
	// - Empty tubes can receive any colour.
	// - Sometimes a tube can only take some of the liquid being poured in because it's too full.
	// - The game ends when all tubes are either empty or only contain one colour and each colour is only in one tube.

	// TODO Persist tube state to localStorage

	// TODO Rationalise focus state vs selected tube

	let tubes = [
		{ selected: false, liquids: ['red', 'green', 'red', 'red'] },
		{ selected: false, liquids: ['green', 'green', 'green', 'red'] },
		{ selected: false, liquids: ['yellow', 'yellow', 'yellow', 'yellow'] },
		{ selected: false, liquids: [] },
		{ selected: false, liquids: [] },
	];

	let selectedTubeIndex = -1;

	let gameIsWon = false;

	let tubeClicked = (index) => {
		if (tubes[index].selected) {
			// Deselect if selected
			tubes[index].selected = false;
			selectedTubeIndex = -1;
		} else if (selectedTubeIndex === -1) {
			// Select if non are selected
			tubes[index].selected = true;
			selectedTubeIndex = index;
		} else {
			// When the selected tube isn't the one we just clicked on, move all valid liquids to the next tube
			while (isValidMove(index)) {
				tubes[index].liquids = [
					tubes[selectedTubeIndex].liquids[0],
					...tubes[index].liquids,
				];
				tubes[selectedTubeIndex].liquids.shift();
			}

			for (var i = 0; i < tubes.length; i++) {
				tubes[i].selected = false;
			}

			selectedTubeIndex = -1;

			checkIfGameIsWon();
		}
	};

	let isValidMove = (index) => {
		return (
			(tubes[index].liquids[0] === tubes[selectedTubeIndex].liquids[0] &&
				tubes[index].liquids.length < tubeCapacity) ||
			tubes[index].liquids.length === 0
		);
	};

	let checkIfGameIsWon = () => {
		gameIsWon = tubes.every((tube) => {
			return (
				tube.liquids.length === 0 ||
				(tube.liquids.length === tubeCapacity &&
					tube.liquids.every((liquid) => {
						return tube.liquids[0] === liquid;
					}))
			);
		});
	};

	checkIfGameIsWon();
</script>

<main>
	<h1>Hello {name}!</h1>
	<h2>Game is won === {gameIsWon}</h2>
	<div class="tube-rack">
		{#each tubes as tube, i}
			<div
				class="test-tube{tube.selected ? ' selected' : ''}"
				on:click={() => tubeClicked(i)}
			>
				{#each tube.liquids as liquid, j}
					<div class="liquid" style="background-color: {liquid}">{j}</div>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.tube-rack {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.test-tube {
		margin: 12px;
		min-width: 50px;
		height: 250px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border: 1px solid black;
	}

	.test-tube.selected {
		box-shadow: 0 0 5px white;
	}

	.liquid {
		width: 50px;
		height: 50px;
		line-height: 50px;
		font-weight: bold;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
