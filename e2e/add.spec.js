const puppeteer = require('puppeteer')
const testUtils = require('./test_utils')
const {promisify} = require('util')
const promisifyExec = promisify(require('child_process').exec)
var assert = require('chai').assert
let browser = null
let page = null

describe('Add todo', function() {
  this.timeout(9999999)

  before(async() => {
    try {
      await testUtils.clearDummyData()
      browser = await puppeteer.launch({
        headless: true
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

  after(()=>{
    browser.close()
  })

  it('should add todo to UI and to Firebase in online mode', async ()=> {
    try {
      await page.type('#todo_form_input', 'online_todo')
      await page.click(`#todo_form_btn`)
      await page.click(`.todo_name`)
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("online_todo")').length > 0) {
          return ''
        } else {
          throw 'Not add todo to UI'
        }
      })
      assert.isEmpty(err, err)
      testUtils.findTodoByName('online_todo')
    } catch (err) {
      throw err
    }
  })

  it('should add todo to UI in offline mode and sync back to firebase when online', async () => {
    try {
      await page.type('#todo_form_input', 'offline_todo')
      await page.waitFor("#todo_form_btn")
      await promisifyExec("ipconfig /release")
      await page.click(`#todo_form_btn`)
      await page.click(`.todo_name`)
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("offline_todo")').length > 0) {
          return ''
        } else {
          throw 'Not add todo to UI'
        }
      })
      assert.isEmpty(err, err)
      await promisifyExec("ipconfig /renew")
      testUtils.findTodoByName('offline_todo')
    } catch (err) {
      await promisifyExec("ipconfig /renew")
      throw err
    }
  })

  it('should add todo to UI in offline mode then sync back to firebase when refresh browser and went online', async () => {
    try {
      await page.type('#todo_form_input', 'offline_todo_2')
      await promisifyExec("ipconfig /release")
      await page.click(`#todo_form_btn`)
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("offline_todo_2")').length > 0) {
          return ''
        } else {
          throw 'Not add todo to UI'
        }
      })
      assert.isEmpty(err, err)
      await page.reload()
      await promisifyExec("ipconfig /renew")
      testUtils.findTodoByName('offline_todo_2')
    } catch (err) {
      await promisifyExec("ipconfig /renew")
      throw err
    }
  })

  it('should add todo (realtime - change feed)', async () => {
    try {
      await testUtils.getRef().push({
        name: 'server_side_added_todo',
        complete: false
      })
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await page.waitFor(`.todo_name`)
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("server_side_added_todo")').length > 0) {
          return ''
        } else {
          throw 'Not add todo to UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })
  it('should add todo (realtime - refresh browser - change feed)', async () => {
    try {
      await page.goto('about:blank')

      await testUtils.getRef().push({
        name: 'server_side_added_todo_2',
        complete: false
      })

      await page.goto('http://localhost:3000')
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await page.waitFor(`.todo_name`)

      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("server_side_added_todo_2")').length > 0) {
          return ''
        } else {
          throw 'Not add todo to UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })
})