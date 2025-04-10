import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
let hasStick = false;
for (const player of world.getAllPlayers()) {
    if (player.getItemInHand().id === "minecraft:stick") {
        hasStick = true;
        break;
    }
}

const form = new ActionFormData();
form.title("Minigames");
form.body("Choose the games");
form.button("Spleef", "textures/items/diamond_shovel");
form.button("Murder Mystery", "textures/items/iron_sword");
form.button("Bedwars", "textures/minigames/bedwars.png");
for (const player of world.getAllPlayers()) {
    if (player.getItemInHand().id === "minecraft:stick") { // Check again to ensure the player still has a stick in their hand before showing form
        form.show(player).then((response) => {
            if (response.canceled) {
                player.sendMessage("Canceled due to " + response.cancelationReason);
            } else {
                // Handle the selected game here, for example:
                switch (response.selection) {
                    case 0:
                        player.sendMessage("You have selected Spleef");
                        break;
                    case 1:
                        player.sendMessage("You have selected Murder Mystery");
                        break;
                    case 2:
                        player.sendMessage("You have selected Bedwars");
                        break;
                }
            }
        }); // show player the form
    }
}