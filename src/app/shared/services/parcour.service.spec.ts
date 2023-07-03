import { TestBed } from '@angular/core/testing';

import { ParcourService } from './parcour.service';

describe('ParcourService', () => {
  let service: ParcourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
