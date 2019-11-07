
export const LEFT = 'l';
export const RIGHT = 'r';

export const colors = {
    darkGrey: '#282c34',
    whiteTransparency: 'rgba(255, 255, 255, 0.5)',
    blueTransparency: 'rgba(55, 125, 255, 0.7)',
    cardFront: 'white',
    cardFrontSelected: 'rgba(150, 150, 200, 0.9)',
    cardTextSelected: 'rgba(0, 0, 200, 0.9)',
    cardFrontClickable: 'rgba(200, 200, 250, 0.9)',
    cardTextClickable: 'rgba(50, 50, 250, 0.9)',
};

export const borderRadius = 4;

export const getBorderRadius = position =>
    position === LEFT
        ? `${borderRadius}px 0 0 ${borderRadius}px`
        : position === RIGHT
            ? `0 ${borderRadius}px ${borderRadius}px 0`
            : borderRadius;
