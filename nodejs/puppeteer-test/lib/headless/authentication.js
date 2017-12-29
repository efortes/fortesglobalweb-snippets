/*global environment, testConfig */
import _ from 'lodash';

const { baseUrl, testUrls, credentials } = testConfig;

export const getCredentials = type => {
  return _.get(credentials, `${environment}.${type}`, {});
};

export const selectProfile = async ({ page }) => {
  await page.waitForSelector('.profile-initial-container .vl-button__desc');
  await page.click('.profile-initial-container:first-of-type');
};

export const getUrl = path => {
  const redirect = testUrls[path];
  if (/http|https/.test(redirect)) return redirect;
  return `${baseUrl}${redirect}`;
};

export const logout = async ({ page }) => {
  await page.goto(getUrl('logout'));
  await page.waitFor(500);
};

export const setCookieWall = async ({ page }) => {
  await page.setCookie({
    name: 'rtlcookieconsent',
    value: '2',
    domain: '.videoland.com'
  });
};

export const loginUser = async ({ page, credentials }) => {
  await page.goto(getUrl('login'));
  await page.type('input[type="text"]', credentials.username);
  await page.type('input[type="password"]', credentials.password);
  await page.click('input[type="submit"]');
};
