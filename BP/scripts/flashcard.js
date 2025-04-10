import { world, system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

let playerTimers = new Map(); // Map to track timers for each player

// Global values
const flashcardTriggerInterval = 30; // Interval in seconds
const rewardType = "effect"; // Can be "effect" or "item"
const effectReward = ["speed", 2, 10]; // Format: ["type_of_effect", "amplifier_int", "duration_in_seconds"]
const itemReward = ["minecraft:diamond", 1]; // Format: ["type_of_item", "quantity"]

// Function to apply effect reward
function applyEffectReward(player) {
    const [effectType, amplifier, duration] = effectReward;
    player.addEffect(effectType, duration * 20, { amplifier }); // Duration in ticks (20 ticks = 1 second)
    player.sendMessage(`You received an effect: ${effectType} (Amplifier: ${amplifier}, Duration: ${duration}s)`);
}

// Function to give item reward
function giveItemReward(player) {
    const [itemType, quantity] = itemReward;
    const inventory = player.getComponent("minecraft:inventory").container;
    inventory.addItem({ item: itemType, amount: quantity });
    player.sendMessage(`You received ${quantity}x ${itemType}`);
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

                // Apply reward based on the reward type
                if (rewardType === "effect") {
                    applyEffectReward(player);
                } else if (rewardType === "item") {
                    giveItemReward(player);
                }
            } else {
                player.addEffect('slowness', 200, {
                    amplifier: 2,
                });
                player.sendMessage("Incorrect answer. Slowness debuff applied. The correct answer is: " + correctAnswer);
            }
        }

        // Start the countdown for this player after they respond or close the flashcard
        playerTimers.set(player.name, 0);
    });
}

// Function to trigger flashcards for all players
function flashcardTick() {
    const players = world.getPlayers();
    const flashcardCount = getFlashcardCount();

    players.forEach((player) => {
        const playerName = player.name;

        // Initialize timer for new players
        if (!playerTimers.has(playerName)) {
            playerTimers.set(playerName, flashcardTriggerInterval); // Use global interval
        }

        let timer = playerTimers.get(playerName);

        if (timer <= 0) {
            // Show a flashcard and reset the timer
            const flashcardNumber = Math.floor(Math.random() * flashcardCount) + 1;
            showFlashcardForm(player, flashcardNumber);
            playerTimers.delete(playerName); // Remove timer until the player responds
        } else {
            // Decrease the timer
            playerTimers.set(playerName, timer - 1);
        }
    });

    system.runTimeout(flashcardTick, 20); // Run every second (20 ticks)
}

// Start the tick function
flashcardTick();