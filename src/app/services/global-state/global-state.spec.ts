import { TestBed } from '@angular/core/testing';

import { GlobalState } from './global-state';

describe('GlobalState', () => {
  let service: GlobalState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
