import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProjects } from './featured-projects.component';

describe('FeaturedProjects', () => {
  let component: FeaturedProjects;
  let fixture: ComponentFixture<FeaturedProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedProjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
