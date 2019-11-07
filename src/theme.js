
export const LEFT = 'l';
export const RIGHT = 'r';

export const colors = {
    darkGrey: '#282c34',
    whiteTransparency: 'rgba(255, 255, 255, 0.5)',
    blueTransparency: 'rgba(55, 125, 255, 0.7)',

};

export const borderRadius = 4;

export const getBorderRadius = position =>
    position === LEFT
        ? `${borderRadius}px 0 0 ${borderRadius}px`
        : position === RIGHT
            ? `0 ${borderRadius}px ${borderRadius}px 0`
            : borderRadius;
