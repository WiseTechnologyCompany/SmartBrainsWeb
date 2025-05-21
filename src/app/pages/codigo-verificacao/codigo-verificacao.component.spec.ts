import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoVerificacaoComponent } from './codigo-verificacao.component';

describe('CodigoVerificacaoComponent', () => {
  let component: CodigoVerificacaoComponent;
  let fixture: ComponentFixture<CodigoVerificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoVerificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoVerificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
