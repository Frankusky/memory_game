"use strict";
(() => {
	/**************************************GAME LOGIC SECTION***************************************/
	/*Preloads images so it will appear inmediately when user clicks on it*/
	for (let i = 0; i < 8; i++) {
		let pandaImage = new Image()
		pandaImage.src = "assets/img/"+(i+1)+".gif";
	}
	
	
	let memoryCardPositions = [[], [], [], []], /*Stores the pair random numbers for each card*/
		firstCard = {}; /*Stores the first clicked card for each pair of cards*/
	
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
	let cleanPickedCards = 0,
		matchedPair = false;
	
	/*When user clicks a card event*/
	$(".card").click(function () {
		let thisCard = $(this),
			cardHorizontalPosition= thisCard.index(),
			cardVerticalPostion = thisCard.parent().index(),
			value = memoryCardPositions[cardVerticalPostion][cardHorizontalPosition];
		if($(".pickedCard").length>1) {
			clearTimeout(cleanPickedCards)
			if(!matchedPair) $(".pickedCard").css("background-image","")
			$(".pickedCard").removeClass("pickedCard");
			firstCard = {};
		}
		if(!thisCard.hasClass("pickedCard")){
			thisCard.css("background-image","url(assets/img/"+value+".gif)");
			thisCard.addClass("pickedCard");
			/*First click for each pair*/
			if(!firstCard.value){
				firstCard.value = value;
				firstCard.dom = thisCard;
			}else{/*Second click for each pair*/
				if(firstCard.value === value){/*is a pair*/
					matchedPair = true;
					$(".pickedCard").removeClass("pickedCard");
					firstCard = {}
				}else{
					matchedPair = false;
					cleanPickedCards = setTimeout(function(){
						$(".pickedCard").css("background-image","")
						$(".pickedCard").removeClass("pickedCard");
						firstCard = {};
					},500)
				}
				
			}
		}
	});
	/*When users click new game button*/
	$("#new_game").click(function(){
		memoryCardPositions = [[], [], [], []];
		firstCard = {};
		$(".card").css("background-image","");
		poblateRandomCardsPosition();
	});
})()
