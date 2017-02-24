# Crypto Profile

Profile files with the power of encryption

## Installation

```
npm install cryptoprofile
```

## Usage
Crypto Profile accept two way of initialization, interactive (for CLI apps) and has simple module.

If you would use in interactive mode be aware that the code would ask for password, if not a default password needs to be provide.

### Initialization

**Interactive**
```
const profile = new require('cryptoprofile')('myAppName')
```
If the file _~/.myAppName_ doesn't exists would be create, the user would be ask for a password.

**Not Interactive**
```
const profile = new require('cryptoprofile')('myAppName', {interactive: false, password: 'someRandPassword'})
```

---

### Consuming
The consuming part stay the same for both, only two methods are deliver behind the class `get` and `set`.

**Get**
```
profile.get('myValue', (value)=>{
  console.log('This is the store value', value)
})
```

**Set**
```
profile.set('myValue', 'mySpecialValueThatIsBeingSet')
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* **1.0.0** - *First Release*

## Credits

* **Mauro Mandracchia** - *Author* - [Ideabile](https://github.com/Ideabile)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
