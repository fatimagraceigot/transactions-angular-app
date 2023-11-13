import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const getElementByDataTestAttribute = (
  fixture: ComponentFixture<any>,
  dataTestName: string
): DebugElement => {
  return fixture.debugElement.query(By.css(`[data-test="${dataTestName}"]`));
};
