<script>
	/* Rules:
	- One colour poured at a time.
	- Like colours merge.
	- Can only pour like colours onto each other.
	- Empty tubes can receive any colour.
	- Sometimes a tube can only take some of the liquid being poured in because it's too full.
	- The game is won when all tubes are either empty or only contain one colour and each colour is only in one tube.
	*/

	// TODO Persist tube state to localStorage and button for new game
	// Only create new game automatically if localStorage is empty

	import GenerateLevel from './level-generator';

	let tubeCapacity = 4;
	let maximumDifficulty = 6;

	// TODO Encode each level, put it in the querystring and make it shareable!

	// TODO Rewind

	// TODO Keyboard navigation!

	// TODO Let the user set the size of the level (max of six) and store in localStorage
	let tubes = GenerateLevel(6, tubeCapacity);

	let selectedTubeIndex = -1;
	let gameInProgress = false;
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
			while (isValidMove(selectedTubeIndex, index)) {
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

			gameInProgress = true;

			checkIfGameIsWon();
		}
	};

	let isValidMove = (sourceIndex, destinationIndex) => {
		if (
			tubes[destinationIndex].liquids.length === 0 &&
			tubes[sourceIndex].liquids.length === 0
		)
			return false;

		return (
			(tubes[destinationIndex].liquids[0] === tubes[sourceIndex].liquids[0] &&
				tubes[destinationIndex].liquids.length < tubeCapacity) ||
			tubes[destinationIndex].liquids.length === 0
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
	<h1>Tube Sorter</h1>
	<p>Pour the liquid between the tubes until each colour is in its own tube</p>
	{#if gameIsWon}
		<h2>🎉🎉🎉 You won! 🎉🎉🎉</h2>
	{/if}

	<div class="tube-rack">
		{#each tubes as tube, i}
			<div
				class="test-tube{tube.selected ? ' selected' : ''}"
				on:click={() => tubeClicked(i)}
			>
				{#each tube.liquids as liquid, j}
					<div class="liquid" style="background-color: {liquid}" />
				{/each}
			</div>
		{/each}
	</div>
	<p>
		Disclaimer: Levels are randomly generated and the level may not be possible
		to complete!
	</p>

	<h2>New Game?</h2>
	<p>Select the number of tubes you want to sort</p>
	<div class="new-game-button-list">
		{#each Array(maximumDifficulty) as _, i}
			{#if i > 1}
				<button
					class="new-game-button"
					on:click={() => {
						tubes = GenerateLevel(i + 1, tubeCapacity);
					}}>{i + 1}</button
				>
			{/if}
		{/each}
	</div>
	<footer>Made with ♥ by <a href="https://twitter.com/RapidOwl" target="_blank">@RapidOwl</a></footer>
	<!-- <pre style="white-space: pre-wrap;">
		{JSON.stringify(tubes)}
	</pre> -->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		color: #fff;
	}

	h1 {
		text-transform: uppercase;
		font-size: 4em;
		font-weight: bold;
	}

	a {
		color: white;
		text-decoration: underline;
	}

	.tube-rack {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.test-tube {
		margin: 12px;
		padding: 0;
		min-width: 50px;
		height: 250px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border: 2px solid black;
		border-radius: 0 0 26px 26px;
		overflow: hidden;
	}

	.test-tube.selected {
		box-shadow: 0 0 5px white;
	}

	.liquid {
		width: 50px;
		height: 50px;
		line-height: 50px;
		font-weight: bold;
		background-color: #ffffff;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E");
	}

	.new-game-button {
		width: 50px;
		height: 50px;
		margin: 0 5px;
		border-radius: 50%;
		font-size: 1.2em;
		line-height: 1.2em;
		font-weight: bold;
		border: 0;
	}

	.new-game-button:nth-child(1) {
		background-color: #fdffb4;
	}

	.new-game-button:nth-child(2) {
		background-color: #f7c2d6;
	}

	.new-game-button:nth-child(3) {
		background-color: #c3effc;
	}

	.new-game-button:nth-child(4) {
		background-color: #e0bbe4;
	}

	footer {
		margin-top: 50px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
