/*global puppeteer, testConfig, */

import _ from 'lodash';
import {
  getUrl,
  loginUser,
  logout,
  getCredentials,
  selectProfile,
  setCookieWall
} from '../../lib/headless/authentication';

describe('Headless login', async () => {
  let browser = null;
  let page = null;
  const availableSocials = ['Facebook', 'Google', 'Linkedin'];
  const unsubscribedCredentials = getCredentials('unsubscribed');
  const subscribedCredentials = getCredentials('subscribed');

  before(async () => {
    browser = await puppeteer.launch(testConfig.launch);
    page = await browser.newPage();
    setCookieWall({ page });
    if (testConfig.showLog) page.on('console', ConsoleMessage => console.log(ConsoleMessage.text));
  });

  after(async () => {
    await browser.close();
  });

  it('should show the login title', async () => {
    await page.goto(getUrl('login'));
    const title = await page.evaluate(el => el.innerHTML, await page.$('h1'));
    expect(title).toBe('Inloggen');
  });

  it('should show the social login', async () => {
    await page.goto(getUrl('login'));
    const socials = await page.$$eval('.social-login-component span', elements =>
      Array.from(elements, el => el.innerHTML)
    );
    expect(socials).toInclude(availableSocials[0]);
    expect(socials).toInclude(availableSocials[1]);
    expect(socials).toInclude(availableSocials[2]);
  });

  it('should login and redirect to the default rateplan', async () => {
    await loginUser({ page, credentials: unsubscribedCredentials });
    await page.waitForNavigation();
    const cookies = await page.cookies();
    expect(page.url()).toContain('/onboarding/payment/activate-subscription/2-weken-videoland');
    expect(_.find(cookies, cookie => cookie.name === 'vlId')).toExist();
  });

  it('should logout', async () => {
    await logout({ page });
    const cookies = await page.cookies();
    expect(_.find(cookies, cookie => cookie.name === 'vlId')).toNotExist();
  });

  it('should choose a profile', async () => {
    await loginUser({ page, credentials: subscribedCredentials });
    await selectProfile({ page });
    const totalNavLinks = await page.$$eval('.navigation__link', elements => elements.length);
    expect(totalNavLinks).toBe(6);
  });
});
