import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Response Suggestion/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Accept = Template.bind({});
Accept.args = {
  type: 'accept',
};

export const Edit = Template.bind({});
Edit.args = {
  type: 'edit',
};
