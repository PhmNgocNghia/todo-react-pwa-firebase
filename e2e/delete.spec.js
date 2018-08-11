const puppeteer = require('puppeteer')
const testUtils = require('./test_utils')
const {promisify} = require('util')
const promisifyExec = promisify(require('child_process').exec)
var assert = require('chai').assert
let browser = null
let page = null

describe('Delete todo', function() {
  this.timeout(9999999)
  this.retries(4)

  before(async() => {
    try {
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
      await testUtils.getRef().push({
        name: 'Todo_will_be_deleted'
      })
      await page.waitFor(1000)
    }  catch (err) {
      throw err
    }
  })

  after(()=>{
    browser.close()
  })

  it('should delete todo from UI and Firebase in online mode', async function () {
    try {
      await page.click(`.btn-delete`)
      await page.waitFor(500)
      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_deleted")').length === 0) {
          return ''
        } else {
          throw 'Not delete todo from UI'
        }
      })
      assert.isEmpty(err, err)
      await testUtils.todoMustNotExistFirebase('Todo_will_be_deleted', 'Not delete todo from firebase')
    } catch (err) {
      throw err
    }
  })

  it('should delete todo from UI in offline mode and sync back to firebase when online', async () => {
    try {
      if (process.platform === "win32") {
        await promisifyExec('ipconfig /release')
        await page.click(`.btn-delete.btn.btn-link.pb-1`)
        await page.waitFor(1000)
        await promisifyExec('ipconfig /renew')
        let err = await page.evaluate(() => {
          if ($('.todo_name:contains("Todo_will_be_deleted")').length === 0) {
            return ''
          } else {
            throw 'Not delete todo from UI'
          }
        })
        assert.isEmpty(err, err)
        await testUtils.setTimeout(3000)
        await testUtils.todoMustNotExistFirebase('Todo_will_be_deleted', 'Not delete todo from firebase')
      }
    } catch (err) {
      await promisifyExec('ipconfig /renew')
      throw err
    }
  })

  it('should delete todo from UI in offline mode and sync back to firebase when refresh browser and online', async () => {
    try {
      if (process.platform === "win32") {
        await promisifyExec('ipconfig /release')
        await page.click(`.btn-delete.btn.btn-link.pb-1`)
        await page.waitFor(1000)
        await page.reload()
        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
        await promisifyExec('ipconfig /renew')
        await testUtils.setTimeout(2200)
        let err = await page.evaluate(() => {
          if ($('.todo_name:contains("Todo_will_be_deleted")').length === 0) {
            return ''
          } else {
            throw 'Not delete todo from UI'
          }
        })
        assert.isEmpty(err, err)
        await testUtils.todoMustNotExistFirebase('Todo_will_be_deleted', 'Not delete todo from firebase')
      }
    } catch (err) {
      await promisifyExec('ipconfig /renew')
      throw err
    }
  })

  it('should delete todo (realtime - change feed)', async () => {
    try {
      await testUtils.getRef().remove()
      await testUtils.setTimeout(1000)

      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_deleted")').length === 0) {
          return ''
        } else {
          throw 'Not delete todo from UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })
  it('should delete todo (realtime - refresh browser - change feed)', async () => {
    try {
      await page.goto('about:blank')

      await testUtils.getRef().remove()

      await page.goto('http://localhost:3000')
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
      await testUtils.setTimeout(2200)

      let err = await page.evaluate(() => {
        if ($('.todo_name:contains("Todo_will_be_deleted")').length === 0) {
          return ''
        } else {
          throw 'Not delete todo from UI'
        }
      })
      assert.isEmpty(err, err)
    } catch (error) {
      throw error
    }
  })
})