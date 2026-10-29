import { AbstractGlobalState } from './abstract-global-state';

describe('AbstractGlobalState', () => {
  it('should create an instance', () => {
    const directive = new AbstractGlobalState();
    expect(directive).toBeTruthy();
  });
});
