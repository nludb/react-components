import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonList } from './ButtonList';
import { Button } from '../Button/Button';

export default {
  title: 'Link Suggestion/ButtonList',
  component: ButtonList,
} as ComponentMeta<typeof ButtonList>;

const Template: ComponentStory<typeof ButtonList> = (args) => <ButtonList {...args}>
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
  <Button label="Test Button" />
</ButtonList>

export const Default = Template.bind({});
