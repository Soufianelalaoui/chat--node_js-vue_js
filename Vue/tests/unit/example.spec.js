import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Register from '../src/views/Register.vue'

it ('should render correctly', () => {

  let wrapper = shallowMount(Register);

  expect(wrapper.find('.heading').text()).to.contain('S\'enregistrer');
});
