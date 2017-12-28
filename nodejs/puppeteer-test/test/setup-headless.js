import expect from 'expect';
import puppeteer from 'puppeteer';
import _ from 'lodash';
const debug = require('debug')('uitest');

const { HEADLESS, HEADLESS_DELAY, LOG = true, NODE_ENV = 'development' } = process.env;

// True to see the browser
const headless = HEADLESS === 'false' ? false : true;

// Add a delay to be ble to see the steps in the browser
const headlessDelay = headless ? null : parseInt(HEADLESS_DELAY || 5);

const testEnvironments = {
  development: 'http://dev.videoland.com:3000',
  test: 'https://test.videoland.com',
  acceptance: 'https://acc.videoland.com',
  production: 'https://www.videoland.com'
};

const credentials = {
  development: {
    unsubscribed: {
      username: '****',
      password: '****'
    },
    subscribed: {
      username: '****',
      password: '****'
    }
  },
  production: {
    unsubscribed: {
      username: '****',
      password: '****'
    },
    subscribed: {
      username: '****',
      password: '****'
    }
  }
};

credentials.test = credentials.development;
credentials.acceptance = credentials.production;

const baseUrl = NODE_ENV in testEnvironments ? testEnvironments[NODE_ENV] : testEnvironments['development'];

const urls = {
  login: '/login'
};

global.expect = expect;
global.puppeteer = puppeteer;
global.puppeteerOptions = {
  launch: { headless, slowMo: headlessDelay },
  showLog: LOG === 'true' ? true : false
};

global.getUrl = path => {
  return `${baseUrl}${urls[path]}`;
};

global.getCredentials = type => {
  return _.get(credentials, `${NODE_ENV}.${type}`, {});
};

global.loginUser = async ({ page, credentials }) => {
  await page.goto(getUrl('login'));
  await page.screenshot({ path: 'example1.png' });
  await page.type('input[type="text"]', credentials.username);
  await page.type('input[type="password"]', credentials.password);
  await page.click('input[type="submit"]');
  await page.waitForNavigation();
};

debug(`Site: ${baseUrl}`);
debug(`Environment: ${NODE_ENV}`);
debug(`Headless: ${headless}`);
