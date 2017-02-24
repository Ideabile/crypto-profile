const CryptoProfile = require('./../index')
const fs = require('fs')

describe('CryptoProfile function', ()=>{
  it('should be a function', ()=>{
    expect(typeof CryptoProfile).toBe('function')
  })

  it('should throw an exception if name is not supply', ()=>{
    expect(CryptoProfile).toThrow()
  })
})

describe('CryptoProfile with save in tmp the file', ()=>{

  let profile
  beforeEach(()=>{
    profile = new CryptoProfile('someRandomProfileName', {password: 'someRandomPassword', interactive: false})
  })

  afterEach(()=>{
    if(fs.existsSync(profile.configFile)) fs.unlinkSync(profile.configFile)
    if(fs.existsSync(profile.tmpConfigFilePass)) fs.unlinkSync(profile.tmpConfigFilePass)
  })

  it('should create a configFile', ()=>{
    expect(fs.existsSync(profile.configFile)).toBe(true)
  })

  it('should create a temp file for saving the password', ()=>{
    expect(fs.existsSync(profile.tmpConfigFilePass)).toBe(true)
  })

})
