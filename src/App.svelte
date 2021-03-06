<script>
	/* Rules:
	- One colour poured at a time.
	- Like colours merge.
	- Can only pour like colours onto each other.
	- Empty tubes can receive any colour.
	- Sometimes a tube can only take some of the liquid being poured in because it's too full.
	- The game is won when all tubes are either empty or only contain one colour and each colour is only in one tube.
	*/

	import GitHubCorner from './GitHubCorner.svelte';
	import GenerateLevel from './level-generator';

	let tubes;
	let initialTubeState;
	let encodedInitialTubeState;

	let tubeCapacity = 4;
	let maximumDifficulty = 6;

	let selectedTubeIndex = -1;
	let gameInProgress = false;
	let gameIsWon = false;

	var searchParams = new URLSearchParams(window.location.search);

	let setupGame = () => {
		initialTubeState = searchParams.get('game-code');

		if (initialTubeState) {
			restoreGame(initialTubeState);
		} else {
			startNewGame(5);
		}
	};

	let startNewGame = (numberOfTubes) => {
		tubes = GenerateLevel(numberOfTubes, tubeCapacity);
		encodedInitialTubeState = btoa(JSON.stringify(tubes));
		initialTubeState = JSON.parse(JSON.stringify(tubes));

		searchParams.set('game-code', encodedInitialTubeState);
		var newRelativePathQuery =
			window.location.pathname + '?' + searchParams.toString();
		history.pushState(null, '', newRelativePathQuery);

		checkIfGameIsWon();
	};

	let restoreGame = (stateString) => {
		tubes = JSON.parse(atob(stateString));

		checkIfGameIsWon();
	};

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

	let resetTubes = () => {
		tubes = JSON.parse(JSON.stringify(initialTubeState));

		checkIfGameIsWon();
	};

	setupGame();
</script>

<GitHubCorner />
<main>
	<h1>Tube Sorter</h1>
	<p>Pour the liquid between the tubes until each colour is in its own tube</p>

	<div class="tube-rack">
		{#if gameIsWon}
			<div class="success-banner" aria-hidden={!gameIsWon}>
				<h2>You won!</h2>
			</div>
		{/if}
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
	<p>Hit a dead end?</p>
	<button class="reset-game" on:click={resetTubes}>Reset this game</button>

	<h2>New Game?</h2>
	<p>Select the number of tubes you want to sort</p>
	<div class="new-game-button-list">
		{#each Array(maximumDifficulty) as _, i}
			{#if i > 1}
				<button class="new-game-button" on:click={() => startNewGame(i + 1)}
					>{i + 1}</button
				>
			{/if}
		{/each}
	</div>
	<footer>
		<p>
			Made with ♥ by <a href="https://twitter.com/RapidOwl" target="_blank"
				>@RapidOwl</a
			>
		</p>
		<p>Cookie policy: This site does not use cookies</p>
	</footer>
	<!-- <pre style="white-space: pre-wrap;">
		{JSON.stringify(tubes)}
	</pre> -->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 375px;
		margin: 0 auto;
		color: #fff;
		/* border: 1px palevioletred solid; */
	}

	h1 {
		text-transform: uppercase;
		font-size: 2em;
		font-weight: bold;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}

		h1 {
			font-size: 4em;
		}
	}

	a {
		color: white;
		text-decoration: underline;
	}

	button {
		cursor: pointer;
	}

	.tube-rack {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
	}

	.success-banner {
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.success-banner > h2 {
		font-size: 3rem;
		line-height: 3rem;
		background: #fdffb4;
		color: #000;
		padding: 5px 40px 15px;
		border-radius: 3rem;
		box-shadow: 0px 0px 12px 5px #2f4f4f;
	}

	/* .tube-rack-separator {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: nowrap;
	} */

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
		transition: transform 0.05s ease-in-out;
	}

	.test-tube.selected {
		box-shadow: 0 0 5px white;
		transform: translateY(-10px);
		transition: transform 0.15s ease-in-out;
	}

	.liquid {
		width: 50px;
		height: 50px;
		line-height: 50px;
		font-weight: bold;
		background-color: #ffffff;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E");
	}

	.reset-game,
	.reset-game:active {
		height: 50px;
		border-radius: 50px;
		background-color: #a7e8c8;
		font-weight: bold;
		padding: 0 20px;
		border: 0;
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
</style>
