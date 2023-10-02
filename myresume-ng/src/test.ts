// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js'

import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing'

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any
declare const require: any; // Declare require to be able to use it for dynamically loading spec files

// Prevent Karma from running prematurely.
__karma__.loaded = function () { }

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
)

// Then we find all the tests.
const context = (require as any).context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start()

