import { style } from '@vanilla-extract/css';
import { vars } from '@shared/theme';

export const correctAnswer = style({
  backgroundColor: vars.color.success,
  color: 'white',
});

export const wrongAnswer = style({
  backgroundColor: vars.color.error,
  color: 'white',
});
