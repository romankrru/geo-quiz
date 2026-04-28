import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    text: 'rgb(66 71 79)',
    heading: 'rgb(25 28 29)',
    primary: 'rgb(0 53 95)',
    success: 'rgb(58 104 67)',
    error: 'rgb(186 26 26)',
    warning: 'rgb(95 70 0)',
  },
});
