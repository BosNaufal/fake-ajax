# Fake Ajax
Tiny Javascript library to make Fake Ajax Request like a Real API Request. It also has a progress demonstration, give it some delay and progress before it serves the Data. You can combine it with [fake file uploading](https://github.com/BosNaufal/react-file-base64)

I will make some web clone for the DEMO. So, just wait for it! or just try it now!

## Install
You can import [Fake Ajax](./src/js/index.js) to your project file process it with your preprocessor.

You can install it via NPM
```bash
npm install fake-ajax
```


## Usage
```javascript

import Fake from 'fake-ajax';

// the primary API is just like Jquery ajax, but not as cool as it.
Fake.ajax({
  url: "/try/",
  method: "POST",
  data: { text: "THIS IS JUST A FAKE!", new: "BUT IT WILL MAKE YOU HAPPY!" },
  duration: 1000,
  progress: (percent) => { console.log(percent) },
  done: (data) => { console.log(data) },
})


// you can also make a shortcut like this
// But the duraton will be random number
Fake.get('/try/',
  (data) => { console.log(data) },
  (progress) => { console.log(progress)
})


// You can put 'add/' parameter when you need to post an array Data
Fake.post('/todos/add/',
  { text: "This is the todo list" },
  (data) => { console.log(data) },
  (progress) => { console.log(progress)
})


// Look that thing!
Fake.get('/todos/',
  (data) => { console.log(data) },
  (progress) => { console.log(progress)
})


// Also, you can do an update by request with PATCH method
// 1 it means array member with '0' index
Fake.patch('/todos/1',
  { text: "I change this thing!" },
  (data) => { console.log(data) },
  (progress) => { console.log(progress) }
)

// Look the changes!
Fake.get('/todos/1',
  (data) => { console.log(data) },
  (progress) => { console.log(progress)
})


// You won't your data exist? Delete it!
Fake.delete('/todos/1',
  (data) => { console.log(data) },
  (progress) => { console.log(progress) }
)


// get all DATA!
Fake.get('/',
  (data) => { console.log(data) },
  (progress) => { console.log(progress)
})


// Clean it up!
Fake.delete('/todos/',
  (data) => { console.log(data) },
  (progress) => { console.log(progress) }
)

// ===========================================
// JUST TRY IT! THEN SEND ME AN ISSUE! :D
// =======================================

```

## API
##### url (string)
The routing url where you will process your data.

| URL | For |
| --- | -------- |
| / | **Root**, Will get all data in the storage. The Storage itself is just a plain Object |
| /someIndex/ | **index**, Will get the data in the storage by it index. Like read an object like this ```internStorage.someIndex``` |
| /someIndex/numberIndex | **numberIndex**, The *numberIndex* will used as an indicator to get the array data. For example we have a ```/todos/``` data, when we add a number like ```/todos/1``` it will process the ```todos[0]```
| /someIndex/namedIndex/value | **namedIndex**, is just for looking some data with certain candidate. it playing well with array. For example we want to find user list by name ```/user/name/naufal```. it will find the member of the array which have a object property ```name``` and the value is ```"naufal"```.
| /someIndex/add | **add**, parameter is just working for "POST" method. it will produce an array data.


##### method (string)
The Request Methods

| Method | Explanation |
| --- | -------- |
| GET | Read |
| POST | Write or Replace |
| PATCH | Update or Assign |
| DELETE | Delete |

##### data (object)
The object will passed to the POST or PATCH method.

##### duration (number)
Milisecond Duration for the delay before serve the data. The Default is random number between 1000 - 3000 Milisecond.

##### progress (function)
The Callback function on the progress event

##### done (function)
The callback function when the process is done

##### Writing
```javascript
// Fake Ajax
Fake.ajax({
  url: "/try/",
  method: "POST", // Uppercase
  data: { }, // Object
  duration: 1000, // Number
  progress: (percent) => { }, // The data for progress bar
  done: (data) => { }, // The Requested Data
})

// Static Methods
Fake.get(url, done, progress)
Fake.post(url, data, done, progress)
Fake.patch(url, data, done, progress)
Fake.delete(url, done, progress)
```

## Thank You for Making this useful~
AND PLEASE DON'T BE FAKE :D

## Let's talk about some projects with me
Just Contact Me At:
- Email: [bosnaufalemail@gmail.com](mailto:bosnaufalemail@gmail.com)
- Skype Id: bosnaufal254
- twitter: [@BosNaufal](https://twitter.com/BosNaufal)

## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2016 - forever Naufal Rabbani
