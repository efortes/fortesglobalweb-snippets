/*global testConfig, environment */

import expect from 'expect';
import puppeteer from 'puppeteer';
const debug = require('debug')('uitest');

const { HEADLESS, HEADLESS_DELAY, LOG = true, NODE_ENV = 'development' } = process.env;

// True to see the browser
const headless = HEADLESS === 'false' ? false : true;

const testEnvironments = {
  development: 'https://dev.videoland.com:3000',
  test: 'https://test.videoland.com',
  acceptance: 'https://acc.videoland.com',
  production: 'https://www.videoland.com'
};

global.environment = NODE_ENV;
global.expect = expect;
global.puppeteer = puppeteer;
global.testConfig = {
  // Add a delay to be able to see the steps in the browser
  launch: { headless, slowMo: headless ? null : parseInt(HEADLESS_DELAY || 5) },
  showLog: LOG === 'true' ? true : false,
  testUrls: {
    chooseProfile: '/profielkeuze',
    login: '/login',
    logout: 'https://www.videoland.com/onboarding/sso/logout' // TODO dynamic change. Dev and Test will not work
  },
  baseUrl: NODE_ENV in testEnvironments ? testEnvironments[NODE_ENV] : testEnvironments['development'],
  credentials: {
    development: {
      unsubscribed: {
        username: '****@gmail.com',
        password: '*****'
      },
      subscribed: {
        username: '*****@gmail.com',
        password: '*****'
      }
    },
    production: {
      unsubscribed: {
        username: '****@gmail.com',
        password: '*****'
      },
      subscribed: {
        username: '*****@gmail.com',
        password: '*****'
      }
    }
  }
};

// TODO create configs for test and acceptance
testConfig.test = testConfig.development;
testConfig.acceptance = testConfig.production;

debug(`Site: ${testConfig.baseUrl}`);
debug(`Environment: ${environment}`);
debug(`Headless: ${headless}`);
