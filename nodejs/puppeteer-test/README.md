#### UI test
We use [Puppeteer](https://github.com/GoogleChrome/puppeteer)  as API for the headless Chrome browser for the UI tests.
To run the UI tests start the application in http mode ( `npm run dev -- --env.protocol=http` ).
The UI tests can be started with the cmd: `npm run test:ui`.
##### config
**HEADLESS**: false to see the browser uit steps.

**LOG**: true to display the browser console logs.

**HEADLESS_DELAY**: Default to 5 when `HEADLESS` is disabled.

**DEBUG**: Use `DEBUG="uitest"` to debug the tests, For puppeteer debug values use `DEBUG="puppeteer:*"` or visit the puppeteer documentation.

Example: `DEBUG="uitest" HEADLESS=false HEADLESS_DELAY=5 npm run test:ui`