const puppeteer = require('puppeteer')
const testUtils = require('./test_utils')
const {promisify} = require('util')
const promisifyExec = promisify(require('child_process').exec)
var assert = require('chai').assert
let browser = null
let page = null

describe('Router', function () {
  this.timeout(99999)
  this.retries(4)

  before(async() => {
    try {
      await testUtils.clearDummyData()
      browser = await puppeteer.launch({
        headless: true
      })
      page = await browser.newPage()
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
      await page.waitFor('#btn_signin_dummy')
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await page.evaluate(() => { document.getElementById('btn_signin_dummy').classList.remove("d-none") })
    } catch (err) {
      throw err
    }
  })

  after(()=>{
    browser.close()
  })

  it('should redirect to todo route after auth succesfully', async () => {
    try {
      await page.click('#btn_signin_dummy')
      await page.waitFor('#todo_route_heading')
    } catch (err) {
      throw err
    }
  })

  it('should redirect to auth route after sign out succesfully', async () => {
    try {
      await page.click('#btn_signin_dummy')
      await page.waitFor('#todo_route_heading')
      await page.click('#btn-signout')
      await page.waitFor('#auth_route_heading')
    } catch (err) {
      throw err
    }
  })

  it('should show spinner when offline to online', async () => {
    try {
      await page.click('#btn_signin_dummy')
      await page.waitFor('#todo_route_heading')
      await testUtils.setTimeout(2000)
      await promisifyExec('ipconfig /release')
      await promisifyExec('ipconfig /renew')
      await page.waitFor('#loading-text')
    } catch (err) {
      throw err
    }
  })
})

