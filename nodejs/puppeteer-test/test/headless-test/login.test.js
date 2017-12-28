/*global getUrl, puppeteer, puppeteerOptions, getCredentials, loginUser*/

import _ from 'lodash';

describe('Headless login', async () => {
  let browser = null;
  let page = null;
  const availableSocials = ['Facebook', 'Google', 'Linkedin'];
  const unsubscribedCredentials = getCredentials('unsubscribed');
  const subscribedCredentials = getCredentials('subscribed');

  before(async () => {
    browser = await puppeteer.launch(puppeteerOptions.launch);

    page = await browser.newPage();

    if (puppeteerOptions.showLog) page.on('console', ConsoleMessage => console.log(ConsoleMessage.text));
    await page.goto(getUrl('login'));
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto(getUrl('login'));
  });

  it('should show the login title', async () => {
    const title = await page.evaluate(el => el.innerHTML, await page.$('h1'));
    expect(title).toBe('Inloggen');
  });

  it('should show the social login', async () => {
    const socials = await page.$$eval('.social-login-component span', elements =>
      Array.from(elements, el => el.innerHTML)
    );
    expect(socials).toInclude(availableSocials[0]);
    expect(socials).toInclude(availableSocials[1]);
    expect(socials).toInclude(availableSocials[2]);
  });

  it('should login and redirect to the default rateplan', async () => {
    await loginUser({ page, credentials: unsubscribedCredentials });
    const cookies = await page.cookies();
    expect(page.url()).toContain('/onboarding/payment/activate-subscription/2-weken-videoland');
    expect(_.find(cookies, cookie => cookie.name === 'vlId')).toExist();
  });

  it.skip('should logout', async () => {
    await loginUser({ page, credentials: subscribedCredentials });
  });

  it.skip('should login and select a profile', async () => {
    await loginUser({ page, credentials: subscribedCredentials });
  });
});
