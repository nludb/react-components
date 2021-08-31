import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LinkSuggest } from './LinkSuggest';

export default {
  title: 'Link Suggestion/Widget',
  component: LinkSuggest,
  argTypes: {
  },
} as ComponentMeta<typeof LinkSuggest>;

const Template: ComponentStory<typeof LinkSuggest> = (args) => <LinkSuggest {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
