import mockData from './mock_data'

export default class mockFirebase {
  constructor (isResolved) {
    this.isResolved = isResolved
    this.push =
    this .update =
    this.remove = () => {
      return new Promise((resolve, reject) => {
        if (this.isResolved) {
          resolve({
            key: 'test'
          })
        } else {
          reject({
            code: mockData.error.code,
            message: mockData.error.message
          })
        }
      })
    }
  }

  ref () {
    return this
  }
}