
export const LEFT = 'l';
export const RIGHT = 'r';

export const playersTheme = [
    {
        mainColor: 'blue',
        secondaryColor: 'lightblue',
        selectedTextColor: 'lightblue',
    },
    {
        mainColor: 'lime',
        secondaryColor: 'green',
        selectedTextColor: 'green',
    },
    {
        mainColor: 'red',
        secondaryColor: 'lightpink',
        selectedTextColor: 'lightpink',
    },
    {
        mainColor: 'yellow',
        secondaryColor: 'rgba(255, 255, 255, 0.5)',
        selectedTextColor: 'lightcoral',
    },
    {
        mainColor: 'purple',
        secondaryColor: 'rgba(255, 255, 255, 0.5)',
        selectedTextColor: 'lightcoral',
    },
];

export const cardPositionTheme = [
    {
        transform: 'rotateZ(-30deg) translateY(64px)',
    },
    {
        transform: 'rotateZ(-18deg) translateX(6px) translateY(24px)',
    },
    {
        transform: 'rotateZ(-6deg)',
    },
    {
        transform: 'rotateZ(6deg) translateX(-10px)',
    },
    {
        transform: 'rotateZ(18deg) translateX(-16px) translateY(24px)',
    },
    {
        transform: 'rotateZ(30deg) translateX(-6px) translateY(64px)',
    },
];

export const colors = {
    darkGrey: '#282c34',
    whiteTransparency: 'rgba(255, 255, 255, 0.5)',
    blueTransparency: 'rgba(55, 125, 255, 0.7)',
    cardFront: 'white',
    cardBack: 'darkslategray',
    cardBackText: 'gainsboro',
    cardFrontSelected: 'rgba(150, 150, 200, 0.9)',
    cardTextSelected: 'rgba(0, 0, 200, 0.9)',
    cardFrontClickable: 'rgba(200, 200, 250, 0.9)',
    cardTextClickable: 'rgba(50, 50, 250, 0.9)',
    cardTextStartOne: 'cornflowerblue',
    cardTextStart100: 'lightsalmon',
    goesUpColor: 'cornflowerblue',
    goesDownColor: 'lightsalmon',
    won: 'aqua',
    lost: 'red',
};

export const borderRadius = 4;

export const getBorderRadius = position =>
    position === LEFT
        ? `${borderRadius}px 0 0 ${borderRadius}px`
        : position === RIGHT
            ? `0 ${borderRadius}px ${borderRadius}px 0`
            : borderRadius;
