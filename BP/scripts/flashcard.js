import { world, system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";


//Questions and Answers are referenced inside this file, not the .lang file

let ingameSeconds = 10;

// Assuming you have a translations object or a way to resolve keys
const translations = {
    "flashcard.1.question": "What's the capital of Japan?",
    "flashcard.1.answer": "Tokyo",
    "flashcard.2.question": "What is the chemical symbol for gold?",
    "flashcard.2.answer": "Au",
    "flashcard.3.question": "Who developed the theory of general relativity? (Last Name)",
    "flashcard.3.answer": "Einstein",
    "flashcard.4.question": "Which organ is responsible for pumping blood throughout the body?",
    "flashcard.4.answer": "Heart",
    "flashcard.5.question": "What is the largest desert in the world?",
    "flashcard.5.answer": "Sahara",
    "flashcard.6.question": "What is the process by which plants make their food using sunlight?",
    "flashcard.6.answer": "Photosynthesis",
    "flashcard.7.question": "What is the boiling point of water at standard atmospheric pressure? (Celsius)",
    "flashcard.7.answer": "100",
    "flashcard.8.question": "What is the powerhouse of the cell?",
    "flashcard.8.answer": "Mitochondria",
    "flashcard.9.question": "What force keeps planets in orbit around the sun?",
    "flashcard.9.answer": "Gravity",
    "flashcard.10.question": "What is the main gas found in the Earth's atmosphere?",
    "flashcard.10.answer": "Nitrogen"
};

// Function to get translated text
function getTranslatedText(key) {
    return translations[key] || key;
}

// Function to get the number of flashcards
function getFlashcardCount() {
    return 10;
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
                amplifier: 1,
            });
            player.sendMessage("You closed the flashcard. Hunger debuff applied.");
        } else {
            const userAnswer = response.formValues[0];
            const correctAnswer = getTranslatedText(answerKey);
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                player.sendMessage("Correct answer!");
                player.addEffect('speed', 200, {
                    amplifier: 2,
                });
            } else {
                player.addEffect('slowness', 200, {
                    amplifier: 2,
                });
                player.sendMessage("Incorrect answer. Slowness debuff applied. The correct answer is: " + correctAnswer);
            }
        }
    });
}

// Function to trigger flashcard every 30 seconds
function thirtySecondsTick() {
    const players = world.getPlayers();
    if (players.length > 0) {
        if (ingameSeconds >= 30) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            const flashcardCount = getFlashcardCount();
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