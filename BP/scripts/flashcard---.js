import { world, system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

let ingameSeconds = 10;

// Function to get translated text
function getTranslatedText(key) {
    return {
        translate: key,
    };
}

// Function to iterate through the correctanswer string and make everything lowercase
function lowerCaseString(correctAnswer) {
    let newString = "";
    for (let i = 0; i < correctAnswer.length; i++) {
        newString += correctAnswer[i].toLowerCase();
    }
    return newString;
}


// Function to get the number of flashcards
function getFlashcardCount() {
    let flashcardCountRead = `flashcard.count`;
    let flashcardCountInFunction = `%${flashcardCountRead}`;
    return flashcardCountInFunction;
}



// Function to show flashcard form
function showFlashcardForm(player, flashcardNumber) {
    const questionKey = `flashcard.${flashcardNumber}.question`;
    const answerKey = `flashcard.${flashcardNumber}.answer`;

    let form = new ModalFormData();
    form.title("Flashcard");
    form.textField(getTranslatedText(questionKey), "Your Answer", "");

    form.show(player).then((response) => {
        if (response.canceled) {
            player.addEffect('hunger', 200, {
                amplifier: 2,
            });;
            player.sendMessage("You closed the flashcard. Hunger debuff applied.");
        } else {
            const userAnswer = response.formValues[0];
            
            const correctAnswer = "%"+ answerKey;
            player.sendMessage(`Type of userAnswer: ${typeof userAnswer}`);
            player.sendMessage(`Type of correctAnswer: ${typeof correctAnswer}`);
            
            if (userAnswer.toLowerCase().trim() == correctAnswer.trim().toLowerCase()) {
                player.sendMessage("Correct answer!");
                player.addEffect('speed', 200, {
                    amplifier: 2,
                });
            } else {
                player.addEffect('slowness', 200, {
                    amplifier: 2,
                });
                player.sendMessage("Incorrect answer. Slowness debuff applied. The correct answer is: " + correctAnswer);
                player.sendMessage("Your answer: " + userAnswer);
            }
            player.sendMessage(`User Answer: ${userAnswer, userAnswer.split('').map(char => char.charCodeAt(0))}`);
            player.sendMessage(`Lang file answer: ${correctAnswer, correctAnswer.split('').map(char => char.charCodeAt(0))}`);
        }
    });
}

// Function to trigger flashcard every 30 seconds
function thirtySecondsTick() {
    const players = world.getPlayers();
    if (players.length > 0) {
        if (ingameSeconds >= 15) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            let flashcardCount = 10
            const flashcardNumber = Math.floor(Math.random() * flashcardCount) + 1;
            showFlashcardForm(randomPlayer, flashcardNumber);
            ingameSeconds = 0; // Reset the counter
        } else {
            ingameSeconds += 1;
        }
    }

    system.runTimeout(thirtySecondsTick, 20); // Run every second (20 ticks)
}

// Start the tick function
thirtySecondsTick();