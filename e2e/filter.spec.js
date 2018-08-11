const puppeteer = require('puppeteer')
const testUtils = require('./test_utils')
const {promisify} = require('util')
const promisifyExec = promisify(require('child_process').exec)
var assert = require('chai').assert
let browser = null
let page = null

describe('Filter todo', function () {
  this.timeout(999999)
  this.retries(4)

  const tests = [
    {
      id: '#SHOW_ALL',
      selector: '.todo_name',
      length: 2
    }, {
      id: '#SHOW_COMPLETED',
      selector: '.todo_name:contains("Completed_Todo")',
      length: 1
    }, {
      id: '#SHOW_ACTIVE',
      selector: '.todo_name:contains("Active_Todo")',
      length: 1
    }
  ]

  before(async() => {
    try {
      await testUtils.clearDummyData()
      browser = await puppeteer.launch({
        headless: false
      })
      await testUtils.getRef().push({
        name: 'Completed_Todo',
        completed: true
      })
      await testUtils.getRef().push({
        name: 'Active_Todo',
        completed: false
      })
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
      await page.waitFor('#btn_signin_dummy')
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await page.evaluate(() => { document.getElementById('btn_signin_dummy').classList.remove("d-none") })
      await page.click('#btn_signin_dummy')
      await page.waitFor('#todo_route_heading')
    } catch (err) {
      throw err
    }
  })

  afterEach(async () => {
    await page.goto('http://localhost:3000')
    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
    await page.waitFor('#todo_route_heading')
    await page.waitFor(500)
  })

  after(()=>{
    browser.close()
  })

  tests.forEach(test=>{
    it(`correctly filter ${test.id} todo`, async () => {
      try {
        await page.waitFor(test.id)
        await page.click(test.id)
        await page.waitFor('.todo_name')
        let err = await page.evaluate((test)=>{
          if ($(test.selector).length === test.length) {
            return ''
          } else {
            throw 'Not filter all todo to UI'
          }
        }, test)
        assert.isEmpty(err, err)
      } catch (err) {
        throw err
      }
    })
  })

  it('should search todo by name', async function () {
    try {
      await page.waitFor('#todo_search_input')
      await page.type('#todo_search_input', 'Completed_Todo')
      await page.waitFor('.todo_name')
      await page.waitFor(1000)
      let err = await page.evaluate(()=>{
        if ($('.todo_name:contains("Completed_Todo")').length === 1) {
          return ''
        } else {
          throw 'Not filter search todo to UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (err) {
      throw err
    }
  })
})
