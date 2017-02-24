const cryptlib = require('cryptlib')
const tmp = require('tmp')
const inquirer = require('inquirer')
const fs = require('fs')
const os = require('os')
const jsonfile = require('jsonfile')
const sync = require('sync')

function CryptoProfile( name, options ){

  if(typeof name === 'object'){
    options = name;
    name = false;
  }

  this.configName = name || options.name || false;

  if(!this.configName) throw new Error('We need a name for the config to be declared')

  let tmpDir = os.tmpdir()
  let homeDir = os.homedir()
  let passFileName = cryptlib.getHashSha256(this.configName, 8)

  let defaultOptions = {
    saveTmpPass: true,
    password: false,
    interactive: true
  }

  this.options = Object.assign(defaultOptions, options || {})
  if(this.options.password){
    this.options.password = cryptlib.getHashSha256(this.options.password, 32)
  }

  if(!this.options.password && !this.options.interactive) throw new Error('If is not interactive please provide the password for the encryption')

  this.configFile = `${homeDir}/.${this.configName}`
  this.tmpConfigFilePass = `${tmpDir}/${passFileName}`

  if(!fs.existsSync(this.configFile)) this.createConfigFile()

  this.set = (prop, value, cb) => {
    let env = {}
    env[prop] = value
    this.get(false, (data)=>{
      this.save(Object.assign(data, env), cb)
    })
  }

  this.get = (prop, cb) => {
    this.getPassword((pass)=>{
      let key = this.getKey()
      let data = JSON.parse(cryptlib.decrypt(jsonfile.readFileSync(this.configFile).data, key, pass), true)
      if(cb) cb(prop ? data[prop] : data)
    })
  }
}

CryptoProfile.prototype.save = function( obj, cb ){
  let key = this.getKey()
  this.getPassword((pass)=>{
    jsonfile.writeFileSync(this.configFile, { key: key, data: cryptlib.encrypt( JSON.stringify(obj) , key, pass) })
    if(cb) cb()
  })
}

CryptoProfile.prototype.getKey = function(){
  if(!fs.existsSync(this.configFile)) return cryptlib.generateRandomIV(16)
  return jsonfile.readFileSync(this.configFile).key
}

CryptoProfile.prototype.createConfigFile = function(){
  if(this.options.interactive){
    console.log([
      'We didn\'t find any configuration file for ' + this.configName,
      'We gonna create one soon...'
    ].join('\n'))
  }
  let randKey = this.getKey()
  this.getPassword((pass) =>{
    jsonfile.writeFileSync(this.configFile, {key: randKey, data: cryptlib.encrypt('{}', randKey, pass)})
  })
}

CryptoProfile.prototype.askPassword = function( cb ){
  inquirer.prompt([{
    type: 'password',
    name: 'password',
    message: 'Insert your password'
  }]).then((answers)=>{
    if(cb) cb(cryptlib.getHashSha256(answers.password, 32))
  }).catch((err)=>{
    console.log(err);
  })
}

CryptoProfile.prototype.saveTmpPass = function( pass ){
  fs.writeFileSync( this.tmpConfigFilePass, pass )
}

CryptoProfile.prototype.getPassword = function(cb){
  if(this.options.password){
    if(this.options.saveTmpPass) this.saveTmpPass(this.options.password)
    return cb(this.options.password)
  }

  if( fs.existsSync(this.tmpConfigFilePass) ){
    return cb(fs.readFileSync(this.tmpConfigFilePass, 'utf8').toString())
  }

  this.askPassword((pass)=>{
    if(this.options.saveTmpPass) this.saveTmpPass(pass)
    cb(pass)
  })
}

module.exports = CryptoProfile
