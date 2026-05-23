export default class MenuScreens {

    static menuTypes = Object.freeze({
        MAIN: 'main',
        SOUND: 'sound',
        TUTORIAL: 'tutorial',
        STORY: 'story'
    });

    static allScreens = {
        soundOptions: {
            type: MenuScreens.menuTypes.SOUND,
            options: [
                'Yes', 
                'No'
            ],
            text: 'Enable Sound?'
        },

        titleScreen: {
            type: MenuScreens.menuTypes.MAIN,
            options: [
                'Start Game',
                'View Tutorial',
                'View Story'
            ],
            text: 'Chaos Inference'
        },

        tutorial1: {
            type: MenuScreens.menuTypes.TUTORIAL,
            options: [
                'Next Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Press the left or right arrow ',
                'keys to move.'
            ]
        },

        tutorial2: {
            type: MenuScreens.menuTypes.TUTORIAL,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: 'Press the "z" key to jump.'
        },

        tutorial3: {
            type: MenuScreens.menuTypes.TUTORIAL,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Press the "z" key while against',
                'a wall to walljump.'
            ]
        },

        tutorial4: {
            type: MenuScreens.menuTypes.TUTORIAL,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Avoid touching hazards, they', 
                'will kill you.'
            ]
        },

        tutorial5: {
            type: MenuScreens.menuTypes.TUTORIAL,
            options: [
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Collecting tokens will disable',
                'some hazards.'
            ]
        },

        story1: {
            type: MenuScreens.menuTypes.STORY,
            options: [
                'Next Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'A powerful AI system is used to',
                'manage the city of Avaritia.',
                'Dissent is at an all-time low,',
                'productivity is up and the',
                'shareholders are very pleased.'
            ]
        },

        story2: {
            type: MenuScreens.menuTypes.STORY,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Recently however, one of the',
                'Rulers gave the AI a bad prompt',
                'causing the security system to',
                'malfunction.'
            ]
        },

        story3: {
            type: MenuScreens.menuTypes.STORY,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Hazel is a young context-',
                'engineer is tasked with',
                'recontextualizing the bad',
                'prompt.'
            ]
        },

        story4: {
            type: MenuScreens.menuTypes.STORY,
            options: [
                'Next Page',
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'To do so she must collect tokens',
                '- pieces of data which the AI',
                'can understand and which will',
                'give the bad prompt more',
                'context.'
            ]
        },

        story5: {
            type: MenuScreens.menuTypes.STORY,
            options: [
                'Previous Page',
                [
                    'Return to',
                    'Title Screen'
                ]
            ],
            text: [
                'Will she be able to fix the',
                'security malfunction? Or will',
                'it continue targeting the wrong',
                'people until the city is no',
                'more?'
            ]
        }
    }
}