import { world,
         system,
         Player,
         Block,
         BlockComponent
         } from "@minecraft/server"

import {ActionFormData,
        ModalFormData
         } from "@minecraft/server-ui"

//import "./flashcard.js";
//import "./sidebar_class.js";
import './monkey_bananas.js';

let ingameSeconds = 0
//Runs every second
//function secondsTick(){
//    let playerName = world.getPlayers()[0].isOnGround
//    const players = world.getPlayers()
//    if (system.currentTick % 20 === 0) {
//        world.sendMessage("Seconds Passed: " + ingameSeconds + "," + playerName)
//        ingameSeconds += 1
//        }
//    
//    system.run(secondsTick)
//}

//system.run(secondsTick)
//Creates a form
//const form = new ActionFormData()
//  .title("Months")
//  .body("Choose your favorite month!")
//  .button("January")
//  .button("February")
//  .button("March")
//  .button({rawtext:[{'translate':'my.name'}]})   //<--- Check to see if classic {rawtext thingie} works
//  .button("May")
//
////Executes form on startup
//  let player = world.getPlayers()[0]
//  if (player) {
//      form.show(player).then((response) => {
//          if (response.selection === 3) {
//              player.runCommand("say I like April too!");
//          }
//      })
//  }


let form = new ModalFormData();
let effectList = [
    { name: "Regeneration", id: "minecraft:regeneration" },
    { name: "Resistance", id: "minecraft:resistance" },
    { name: "Fire Resistance", id: "minecraft:fire_resistance" },
    { name: "Poison", id: "minecraft:poison" },
];
form.title("Effect Generator");
form.textField("Target", "Target of Effect");
form.dropdown(
    "Effect Type",
    effectList.map((effect) => effect.name)
);
form.slider("Effect Level", 0, 255, 1);
form.toggle("Hide Effect Particle", true);
//for (const player of world.getAllPlayers()) {
//    form.show(player).then((response) => {
//        if (response.canceled) {
//            player.sendMessage("Canceled due to " + response.cancelationReason);
//        } else {
//            const [targetName, dropdownValue, effectLevel, hideParticles] =
//                response.formValues;
//            if (
//                typeof dropdownValue !== "string" ||
//                typeof dropdownValue !== "number" ||
//                typeof effectLevel !== "number" ||
//                typeof hideParticles !== "boolean"
//            )
//                return player.sendMessage("Cannot process form result.");
//            const target = world
//                .getAllPlayers()
//                .find((player) => player.name === targetName);
//            if (!(target instanceof Player))
//                return player.sendMessage("Target does not exist.");
//            target.addEffect(effectList[dropdownValue].id, 50, {
//                amplifier: effectLevel,
//                showParticles: !hideParticles,
//            });
//        }
//    });
//}


//Applies knockback on startup **WORKS**
//  for (const player of world.getAllPlayers()) {
//    player.applyKnockback(1, 1, 1, 1)
//}



//Gives speed when player is sprinting **WORKS**
//  function superSpeed(){
//    let playerSprinting = world.getPlayers()[0].isSprinting
//    if (playerSprinting){
//        player.runCommand("/effect @s speed 1 5 true")
//    }
//    system.run(superSpeed)
//  }
//
//    system.run(superSpeed)



//Knockback when eating apple **WORKS**
world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    if (!player || !player.getRotation) return;
    if (event.itemStack.typeId === "minecraft:mace") {
        event.source.applyKnockback(0, 1, 0, 1)
        world.sendMessage("Welcome to the server, " + event.itemStack.typeId + "!")
    
    // Get the player's current rotation
    const rotation = player.getRotation();
    const pitch = rotation.x;
    const yaw = rotation.y;
    // Calculate the knockback direction
    const knockbackStrength = 2; // Adjust this value as needed
    const knockbackUpwardStrength = 1.5; // Adjust this value as needed

    // Convert yaw and pitch to radians
    const yawRadians = (yaw + 90) * (Math.PI / 180);
    const pitchRadians = pitch * (Math.PI / 180);

    // Calculate the knockback vector
    const knockbackX = easeOutQuart(Math.cos(yawRadians) * Math.cos(pitchRadians) * knockbackStrength);
    const knockbackY = Math.sin(pitchRadians) * knockbackUpwardStrength;
    const knockbackZ = easeOutQuart(Math.sin(yawRadians) * Math.cos(pitchRadians) * knockbackStrength);
    player.sendMessage(`Knockback: X: ${knockbackX}, Y: ${knockbackY}, Z: ${knockbackZ}`);
    // Apply the knockback to the player
    player.applyKnockback(knockbackX, knockbackY, knockbackZ, knockbackUpwardStrength)
}});
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}
world.beforeEvents.playerBreakBlock.subscribe(event => {
    const player = world.getAllPlayers()
    const block = event.block.type.id;
    const blockClearName = block.replace("minecraft:", "");
    const firstLetter = Array.from(blockClearName)[0];
    const playerName = capitalizeFirstLetter(player[0].nameTag)
    if (firstLetter === "a" || firstLetter === "e" || firstLetter === "i" || firstLetter === "o" || firstLetter === "u") {
        world.sendMessage("Player " + playerName  + " broke an " + blockClearName + " block.");
    } else {
        world.sendMessage("Player " + playerName  + " broke a " + blockClearName + " block.");
    }
    for (let i = 0; i<player.length; i++){
        world.sendMessage("Players on right now: " + player[i].nameTag)
    }
    getFlashcardCount()
});

//Function to return name with only the first name capitalized
function capitalizeFirstLetter(name){
    if (!name) return name;
    name = name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1)
}


//Does x when projectile hits block
world.afterEvents.projectileHitBlock.subscribe((eventData) => {
    const projectile = eventData.projectile;
    world.sendMessage("Projectile Hit Block")
    world.sendMessage(`${projectile.typeId}`)
    if (projectile && projectile.typeId === "minecraft:arrow") {
        projectile.runCommandAsync("summon lightning_bolt ~ ~ ~");
    }
});


//Does x when projectile hits entity
world.afterEvents.projectileHitEntity.subscribe((eventData) => {
  const projectile = eventData.projectile;
  world.sendMessage("Projectile Hit Entity")
  if (projectile && projectile.typeId === "minecraft:arrow") {
      projectile.dimension.spawnEntity("lightning_bolt",projectile.location);
  }
});