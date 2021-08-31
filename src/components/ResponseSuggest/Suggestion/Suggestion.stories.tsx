import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Suggestion } from './Suggestion';

export default {
  title: 'Response Suggestion/Suggestion',
  component: Suggestion,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Suggestion>;

const Template: ComponentStory<typeof Suggestion> = (args) => <Suggestion {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  suggestion: 'Suggestion',
};
