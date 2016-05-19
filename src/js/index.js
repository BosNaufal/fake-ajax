/*! Copyright (c) 2016 Naufal Rabbani (https://github.com/BosNaufal)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Fake AJAX - Version 0.0.1
* URI: https://github.com/BosNaufal
*
*/


(() => {

  // Private variable for internal storage
  let internStorage = {}

  /**
    Make a Progress like function before serve the requested data
  */
  let makeProgress = (duration, progress, done) => {
    let startTime = Date.now()
    let cur = 0 // current
    let to = 100 // The number should be

    function check() {
      if (cur != to) {

        (cur + (to / 60)) > to ? cur = to : cur += (to / 60);

        if(progress) progress(cur) // callback

        setTimeout(function() {
          return check();
        }, duration / 60); // 60 FPS

      } else {
        if(done) done()
      }
    }

    return check()
  }


  /**
    Get Random Duration if the duration is not being set
  */
  let getRandomDuration = () => {
    return (Math.floor(Math.random() * 4)) * 1000
  }


  class Fake {

    constructor(args) {
      if(args){
        let {
          url, data,
          done, progress,
          duration
        } = args

        this.url = url
        this.data = data
        this.done = done
        this.progress = progress
        this.duration = duration
      }

      this.getInternStorage()
    }


    /**
      Get the localStorage data then put it on private variable
    */
    getInternStorage(){
      if(localStorage.fakeRequest) internStorage = JSON.parse(localStorage.fakeRequest)
    }


    /**
      Set the localStorage data then put it on private variable
    */
    setLocalStorage(){
      localStorage.fakeRequest = JSON.stringify(internStorage)
    }


    /**
      Destructuring The URI

      @param {Function} cb(noParams, rootIndex, param, value)
      @return {Function}
    */
    destructuringURI(cb){
      let { url } = this

      if( url.length == 1 ) return cb(true)

      else {
        // Find the second Slash
        let secondSlash = url.indexOf('/',1)
        let rootIndex = url.substr(1, secondSlash - 1)

        if (!rootIndex) return console.warn("[Fake Request]: Please check Your URI. It might be you're missing to write the next slash");

        // If "/rootIndex/" only
        if(url.length == secondSlash + 1) return cb(false, rootIndex)


        else {
          // Find the thirdSlash
          let thirdSlash = url.indexOf('/',secondSlash + 1)
          let thirdSlashNotFound = thirdSlash == -1

          // If "/rootURI/index(number)"
          if(thirdSlashNotFound) {

            // Get the Array Index
            let arrIndex = url.substr(secondSlash + 1)

            // Convert to Integer
            arrIndex = parseFloat(arrIndex)

            // Check is it after second Slash is a number?
            let isNaN = Number.isNaN(arrIndex)

            // If the index is NaN
            if(isNaN) return console.warn('[Fake Request]: Please give the next parameter or next slash');


            return cb(false, rootIndex, arrIndex)
          }

          else {
            // Get the Parameters
            let param = url.substr(secondSlash + 1, thirdSlash - secondSlash - 1)
            let value = url.substr(thirdSlash + 1)

            return cb(false, rootIndex, param, value)
          }


        }

      }
    }


    /**
      Set the localstorage data according to URI Request and
      the Given Object
      @return {Mixed}
    */
    set() {
      let { data, done } = this
      let cb = done

      if(!data) return console.warn("[Fake Request]: The data parameter should be defined");

      return this.destructuringURI((noParams, rootIndex, param, value) => {

        // If no Params
        if(noParams) return console.warn("[Fake Request]: You can not request to mutate all data at once");

        if(!param && !value) {
          // If the internStorage is not empty or has been filled before.
          if (typeof internStorage[rootIndex] == 'object') return console.warn("[Fake Request]: Data is not empty, Please use PATCH method instead of POST.");

          // Update the internStorage
          internStorage[rootIndex] = data
          this.setLocalStorage()

          return cb ? cb(internStorage[rootIndex]) : internStorage[rootIndex]
        }

        // If the parameter is "add/"
        else if(param == 'add' && !value) {
          // Make Sure it is an array
          if(internStorage[rootIndex] == undefined) internStorage[rootIndex] = []

          // Push a new object
          internStorage[rootIndex].push(data)

          // Update the internStorage
          this.setLocalStorage()

          return cb ? cb(internStorage[rootIndex]) : internStorage[rootIndex]
        }

        else return console.warn("[Fake Request]: You might need to using PATCH method instead of POST");

      })
    }



    /**
      Get the localstorage data according to URI Request

      @return {Mixed}
    */
    take() {
      let { done } = this
      let cb = done

      return this.destructuringURI((noParams, rootIndex, param, value) => {

        // If no Paramater "/"
        if(noParams) return cb ? cb(internStorage) : internStorage

        else {

          if (!rootIndex) return console.warn("[Fake Request]: Please check your URI. It might be you're missing to write the next slash");

          if(!internStorage[rootIndex]) return console.warn("[Fake Request]: Data not found");

          // If "/rootIndex/" only
          if(!param && !value) return cb ? cb(internStorage[rootIndex]) : internStorage[rootIndex]

          else{
            // If "/rootURI/index(number)"
            if(typeof param === 'number') {

              // in URI 1 while in Array 0
              let theObject = internStorage[rootIndex][param - 1]

              // If can't find the object
              if(!theObject) return console.warn("[Fake Request]: Can not get any data or the field is empty.");

              // If theObject is exist
              return cb ? cb(theObject) : theObject
            }

            // if "/rootURI/index(named)/value"
            else {
              // Find and get it!
              let found = internStorage[rootIndex].find(item => item[param] == value )
              if(found) return cb ? cb(found) : found

              // If data is not found
              else return console.warn("[Fake Request]: The data is not found, please check your param and value");
            }
          }

        }

      })

    }



    /**
      Patch the localstorage data according to URI Request and
      the Given Object
      @return {Mixed}
    */
    patching(){
      let { data, done } = this
      let cb = done

      if(!data) return console.warn("[Fake Request]: The data parameter should be defined");

      return this.destructuringURI((noParams, rootIndex, param, value) => {

        if(noParams) return console.warn("[Fake Request]: You can not request to mutate all data at once");

        // If no RootIndex
        if(!internStorage[rootIndex]) return console.warn("[Fake Request]: Data not found");


        // If RootIndex only
        if(!param && !value){
          // ASSIGN! Yeey!
          let keys = Object.keys(internStorage[rootIndex])
          let newObjectKeys = Object.keys(data)
          for (let index in keys) {
            for (let indexNew in newObjectKeys) {
              let internStorageKey = keys[index]
              let newObjectKey = newObjectKeys[indexNew]
              if(internStorageKey === newObjectKey) internStorage[rootIndex][internStorageKey] = data[newObjectKey]
              else internStorage[rootIndex][newObjectKey] = data[newObjectKey]
            }
          }

          // Update the localStorage
          this.setLocalStorage()

          return cb ? cb(internStorage[rootIndex]) : internStorage[rootIndex]
        }


        // If exist param but no value
        else {

          // If "/rootURI/index(number)"
          if(typeof param == "number") {
            let target = internStorage[rootIndex][param - 1]

            // If the target is length
            if(target){

              // Set the Data
              internStorage[rootIndex][param - 1] = data

              // Update the localStorage
              this.setLocalStorage()

              return cb ? cb(internStorage[rootIndex][param - 1]) : internStorage[rootIndex][param - 1]
            }

            else return console.warn("[Fake Request]: The Data is not found");
          }

          // If "/rootURI/index(named)"
          else {

            // Find and get it!
            let found = internStorage[rootIndex].find(item => item[param] == value )
            if(found) {
              let index = internStorage[rootIndex].indexOf(found);

              // Set the Data
              internStorage[rootIndex][index] = data

              // Update the localStorage
              this.setLocalStorage()

              return cb ? cb(internStorage[rootIndex][index]) : internStorage[rootIndex][index]
            }

            // If data is not found
            else return console.warn("[Fake Request]: The data is not found, please check your param and value");
          }
        }

      })
    }


    /**
      Delete the localstorage data according to URI Request
      @return {Mixed}
    */
    deleting(){
      let { done } = this
      let cb = done

      return this.destructuringURI((noParams, rootIndex, param, value) => {

        if(noParams) return console.warn("[Fake Request]: You can not request to mutate all data at once");

        // If Data in Root index isn't length
        if(!internStorage[rootIndex]) return console.warn("[Fake Request]: Data not found");

        else if(!param && !value){
          // Delete the target
          delete internStorage[rootIndex]

          // Update the internStorage
          this.setLocalStorage()

          return cb ? cb(true) : true
        }

        else {

          // Find the Target
          let target;
          if (typeof param == "number") target = internStorage[rootIndex][param - 1]
          else target = internStorage[rootIndex].find(item => item[param] == value )

          let index = internStorage[rootIndex].indexOf(target);

          // If the target is length
          if(target) {

            // Delete the Target
            internStorage[rootIndex].splice(index,1)

            // Update the internStorage
            this.setLocalStorage()

            return cb ? cb(true) : true
          }

          // If data is not found
          else return console.warn("[Fake Request]: The data is not found, please check your param and value");
        }

      })
    }


    static ajax(args) {
      let { method, duration, progress } = args

      // Make new Instance
      let fake = new Fake(args)

      if(method == "GET"){
        return makeProgress(duration ? duration : getRandomDuration(), (percent) => progress ? progress(percent) : false, () => fake.take() )
      }
      else if(method == "POST") {
        return makeProgress(duration ? duration : getRandomDuration(), (percent) => progress ? progress(percent) : false, () => fake.set() )
      }
      else if(method == "PATCH") {
        return makeProgress(duration ? duration : getRandomDuration(), (percent) => progress ? progress(percent) : false, () => fake.patching() )
      }
      else if(method == "DELETE") {
        return makeProgress(duration ? duration : getRandomDuration(), (percent) => progress ? progress(percent) : false, () => fake.deleting() )
      }
      else return makeProgress(duration ? duration : getRandomDuration(), (percent) => progress ? progress(percent) : false, () => fake.take() )
    }

    static post(url, data, done, progress) {
      let fake = new Fake({ url, data, done, progress })
      return makeProgress(getRandomDuration(), (percent) => fake.progress ? fake.progress(percent) : false, () => fake.set() )
    }

    static get(url, done, progress) {
      let fake = new Fake({ url, done, progress })
      return makeProgress(getRandomDuration(), (percent) => fake.progress ? fake.progress(percent) : false, () => fake.take() )
    }

    static patch(url, data, done, progress) {
      let fake = new Fake({ url, data, done, progress })
      return makeProgress(getRandomDuration(), (percent) => fake.progress ? fake.progress(percent) : false, () => fake.patching() )
    }

    static delete(url, done, progress) {
      let fake = new Fake({ url, done, progress })
      return makeProgress(getRandomDuration(), (percent) => fake.progress ? fake.progress(percent) : false, () => fake.deleting() )
    }

  }

  module.exports = Fake;

})()
