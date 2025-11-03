import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// The require.context block has been removed to avoid the runtime TypeError.
// Modern Angular CLI handles test file discovery automatically via tsconfig.spec.json
// and the main entry point defined in angular.json.

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// The test file discovery code (const context = require.context(...)) is removed.
// When this file finishes executing, the Karma runner will look at the
// files included in tsconfig.spec.json (all your *.spec.ts files) and run them.
