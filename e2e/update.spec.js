const puppeteer = require('puppeteer')
const testUtils = require('./test_utils')
const {promisify} = require('util')
const promisifyExec = promisify(require('child_process').exec)
var assert = require('chai').assert
let browser = null
let page = null

describe('Update todo', function() {
  this.timeout(9999999)
  this.retries(4)

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

  beforeEach(async () => {
    try {
      await testUtils.clearDummyData()
      await testUtils.addDummyTodo('Todo_will_be_updated')
      await testUtils.setTimeout(1000)
    }  catch (err) {
      throw err
    }
  })

  it('should update todo to UI and to Firebase in online mode', async () => {
    try {
      await page.click(`.btn-update`)
      await page.type('.todo_item_input', '_OK')
      await page.click('.btn-change')
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_updated_OK")').length > 0) {
          return ''
        } else {
          throw 'Not update todo from UI'
        }
      })
      assert.isEmpty(err, err)
      await testUtils.todoMustExistFirebase('Todo_will_be_updated_OK', 'Not update todo from firebase')
    } catch (error) {
      throw error
    }
  })

  it('should update todo to UI and to Firebase in online mode and sync back to firebase when online', async () => {
    try {
      await promisifyExec("ipconfig /release")
      await page.click(`.btn-update`)
      await page.type('.todo_item_input', '_OK')
      await page.click('.btn-change')
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_updated_OK")').length > 0) {
          return ''
        } else {
          throw 'Not update todo from UI'
        }
      })
      assert.isEmpty(err, err)
      await promisifyExec("ipconfig /renew")
      await testUtils.setTimeout(2200)
      await testUtils.todoMustExistFirebase('Todo_will_be_updated_OK', 'Not update todo from firebase')
    } catch (error) {
      await promisifyExec("ipconfig /renew")
      throw error
    }
  })

  it('should update todo to UI and to Firebase in online mode  and sync back to firebase when refresh browser and online', async () => {
    try {
      await promisifyExec("ipconfig /release")
      await page.click(`.btn-update`)
      await page.type('.todo_item_input', '_OK')
      await page.click('.btn-change')
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_updated_OK")').length > 0) {
          return ''
        } else {
          throw 'Not update todo from UI'
        }
      })
      assert.isEmpty(err, err)
      await page.reload()
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await promisifyExec("ipconfig /renew")
      await testUtils.setTimeout(2200)
      await testUtils.todoMustExistFirebase('Todo_will_be_updated_OK', 'Not update todo from firebase')
    } catch (error) {
      await promisifyExec("ipconfig /renew")
      throw error
    }
  })

  it('should update todo (realtime - change feed)', async () => {
    try {
      await testUtils.getDummyTodoRef().update({
        name: 'Todo_will_be_updated_OK'
      })
      await testUtils.setTimeout(1000)

      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_updated_OK")').length > 0) {
          return ''
        } else {
          throw 'Not update todo from UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })
  it('should update todo (realtime - refresh browser - change feed)', async () => {
    try {
      await page.goto('about:blank')

      await testUtils.getDummyTodoRef().update({
        name: 'Todo_will_be_updated_OK'
      })

      await page.goto('http://localhost:3000')
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await testUtils.setTimeout(3000)

      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_updated_OK")').length > 0) {
          return ''
        } else {
          throw 'Not update todo from UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })

})