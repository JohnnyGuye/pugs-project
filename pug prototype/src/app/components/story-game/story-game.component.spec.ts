import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryGameComponent } from './story-game.component';

describe('StoryGameComponent', () => {
  let component: StoryGameComponent;
  let fixture: ComponentFixture<StoryGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
