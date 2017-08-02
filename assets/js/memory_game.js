"use strict";
(() => {
	/**************************************GAME LOGIC SECTION***************************************/
	/*Preloads images so it will appear inmediately when user clicks on it*/
	for (let i = 0; i < 8; i++) {
		let pandaImage = new Image()
		pandaImage.src = "assets/img/" + (i + 1) + ".gif";
	}

	let memoryCardPositions = [[], [], [], []],//Stores the pair random numbers for each card
		firstCard = {}; //Stores the first clicked card for each pair of cards

	/*Checks if the random number dont have been used or dont have a pair*/
	let isValidNumber = (number) => {
		let cardNumberREgExp = new RegExp(number, "g");
		let numberMatches = memoryCardPositions.toString().match(cardNumberREgExp);
		return numberMatches === null ? true : numberMatches.length < 2
	}

	/*Generates the random numbers for each card*/
	let poblateRandomCardsPosition = () => {
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				let insertNumber = true;
				while (insertNumber) {
					let cardNumber = Math.floor(Math.random() * (8)) + 1;
					if (isValidNumber(cardNumber)) {
						memoryCardPositions[x].push(cardNumber);
						insertNumber = false;
					}
				}
			}
		}
	}
	poblateRandomCardsPosition();

	/*******************************************************UI SECTION************************************/
	let cleanPickedCardsTimer = 0,
		matchedPair = false,
		runTimer = true,
		timer = 0,
		seconds = 0,
		moves = 0;

	let checkMovesAmmount = () =>{
		moves++;
		$("#movesAmount").text(moves);
		if (moves === 11 || moves === 15) { //after 10 or 14 (not inclusive) moves, remove 1 star
			$("#starsAmount").fadeOut(function () {
				this.innerHTML = this.innerHTML.slice(0, -1);
			}).fadeIn();
		}
	}
	
	/**/
	let executeElapsedTime = () =>{
		runTimer = false;
		timer = setInterval(() => {
			seconds++;
			$("#timer").html(seconds + " sec");
		}, 1000)
	}

	/*When user clicks a card event*/
	$(".card").click(function () {
		if (runTimer) {
			executeElapsedTime();
		}
		let thisCard = $(this),
			cardHorizontalPosition = thisCard.index(),
			cardVerticalPostion = thisCard.parent().index(),
			value = memoryCardPositions[cardVerticalPostion][cardHorizontalPosition];
		/*Instant hide card in case the timer haven't been executed*/
		if ($(".pickedCard").length > 1) {
			clearTimeout(cleanPickedCardsTimer)
			if (!matchedPair) $(".pickedCard").css("background-image", "")
			$(".pickedCard").removeClass("pickedCard");
			firstCard = {};
		}
		if (!thisCard.hasClass("pickedCard") && thisCard.css("background-image").indexOf("cardBack") !== -1) {
			thisCard.css("background-image", "url(assets/img/" + value + ".gif)");
			thisCard.addClass("pickedCard");
			/*First click for each pair*/
			if (!firstCard.value) {
				firstCard.value = value;
				firstCard.dom = thisCard;
			} else { /*Second click for each pair*/
				checkMovesAmmount();
				if (firstCard.value === value) { /*is a pair*/
					matchedPair = true;
					thisCard.addClass("pairFounded");//adding flags to know how much pair of cards has been found
					firstCard.dom.addClass("pairFounded");
					$(".pickedCard").removeClass("pickedCard");
					firstCard = {}
					/*Game completed*/
					if ($(".pairFounded").length === 16) {
						$("#modal, #winMessage").fadeIn();
						let earnedStars = $("#starsAmount").text();
						$("#stats").html("Total Time: "+seconds+" seconds<br>Total Moves: " + moves + "<br>Stars: " + earnedStars)
					}
				} else {
					matchedPair = false;
					/*Timer to auto hide cards*/
					cleanPickedCardsTimer = setTimeout(function () {
						$(".pickedCard").css("background-image", "")
						$(".pickedCard").removeClass("pickedCard");
						firstCard = {};
					}, 1000)
				}
			}
		}
	});
	/*When users click new game button reset all values to their default value*/
	$(".new_game").click(function () {
		$("#modal").fadeOut();
		$("#startMessage").css("display", "none");
		$(".card").css("background-image", "");
		$("#starsAmount").html("★★★");
		$("#movesAmount").html("0");
		$("#timer").html(0);
		$(".pairFounded").removeClass("pairFounded");
		clearInterval(timer);
		firstCard = {};
		memoryCardPositions = [[], [], [], []];
		runTimer = true;
		seconds = 0;
		moves = 0;
		poblateRandomCardsPosition();
	});
})()
