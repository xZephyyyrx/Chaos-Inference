export default class MenuScreens {
  static menuTypes = Object.freeze({
    MAIN: "main",
    SOUND: "sound",
    TUTORIAL: "tutorial",
    STORY: "story",
    PAUSE: "pause",
    LEVEL: "level",
    OPTIONS: "options",
    WIN: "win",
  });

  static allScreens = {
    soundOptions: {
      type: MenuScreens.menuTypes.SOUND,
      options: ["Yes", "No"],
      text: ["Enable Sound?", "Press the 'z' key to confirm"],
    },

    titleScreen: {
      type: MenuScreens.menuTypes.MAIN,
      options: [
        "Start Game",
        "Level Select",
        "View Tutorial",
        "View Story",
        "Options",
        "Credits",
      ],
      text: "Chaos Inference",
    },

    levelSelect: {
      type: MenuScreens.menuTypes.LEVEL,
      options: [["Return to", "Title Screen"]],
      text: "",
    },

    optionsScreen: {
      type: MenuScreens.menuTypes.OPTIONS,
      options: [
        "Enable Sound",
        "Adjust Volume",
        "Slider Object",
        "Confirm",
        "Cancel",
        ["Return to", "Title Screen"],
      ],
      text: "",
    },

    pauseScreen: {
      type: MenuScreens.menuTypes.PAUSE,
      options: ["Yes", "No"],
      text: "Return to Title Screen?",
    },

    tutorial1: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", ["Return to", "Title Screen"]],
      text: ["Press the left or right arrow ", "keys to move."],
    },

    tutorial2: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: 'Press the "z" key to jump.',
    },

    tutorial3: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: ['Press the "z" key while against', "a wall to walljump."],
    },

    tutorial4: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "Press the ESC key to pause the",
        "game. You can return to the",
        "title screen from the pause",
        "menu.",
      ],
    },

    tutorial5: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: ["Avoid touching red hazards, they", "will kill you."],
    },

    tutorial6: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "Collecting yellow tokens will",
        "disable some hazards.",
        "You do not need to collect all",
        "tokens to complete a level.",
      ],
    },

    tutorial7: {
      type: MenuScreens.menuTypes.TUTORIAL,
      options: ["Previous Page", ["Return to", "Title Screen"]],
      text: ["Reach the green goal to complete", "the level."],
    },

    story1: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", ["Return to", "Title Screen"]],
      text: [
        "With the rise of AI tools,",
        "learning to prompt well has",
        "become an important skill for",
        "both workers and students alike.",
      ],
    },

    story2: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "AI systems don't read words in",
        "the way that we do. They break",
        "each sentence down into chunks",
        "known as 'tokens'.",
      ],
    },

    story3: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "Because AI doesn't read the same",
        "way we do, it can easily miss",
        "important context that might be",
        "obvious to you.",
      ],
    },

    story4: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "It is therefore important that",
        "you provide plenty of context",
        "when writing an AI prompt.",
      ],
    },

    story5: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "This is especially important for",
        "students as failure to prompt",
        "well can have devastating",
        "effects on their learning.",
      ],
    },

    story6: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "In this game you play as a young",
        "context engineer named Hazel who",
        "is tasked with fixing a prompt",
        "gone wrong.",
      ],
    },

    story7: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "The Rulers of the city of Avaria",
        "failed to provide context to ",
        "their prompt and now the city's",
        "security systems have gone ",
        "rogue.",
      ],
    },

    story8: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Next Page", "Previous Page", ["Return to", "Title Screen"]],
      text: [
        "By collecting 'tokens' Hazel",
        "can update the bad prompt,",
        "providing much needed context",
        "on who the system should target.",
      ],
    },

    story9: {
      type: MenuScreens.menuTypes.STORY,
      options: ["Previous Page", ["Return to", "Title Screen"]],
      text: [
        "Will she be able to fix the",
        "system in time? Or will it",
        "continue attacking the wrong",
        "people until the city is no",
        "more?",
      ],
    },

    gameOptions: {
      type: MenuScreens.menuTypes.OPTIONS,
      options: [["Return to", "Title Screen"]],
      text: ["Options"],
    },

    winScreen: {
      type: MenuScreens.menuTypes.WIN,
      options: ["Continue to next Level", "Return to Title Screen"],
      text: ["Level Complete!"],
    },
  };
}
