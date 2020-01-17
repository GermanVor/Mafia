import React from 'react';
import ForTest from '../js/ForTest'

import { shallow, mount, render } from 'enzyme';
//*******************************************************************************************************
test('CheckboxWithLabel changes the text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(<ForTest labelOn="On" labelOff="Off" />);

  expect(checkbox.text()).toEqual('Off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');
});