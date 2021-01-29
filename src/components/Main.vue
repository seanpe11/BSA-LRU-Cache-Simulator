<template>
  <div>
  <div v-show="!run" class="container rounded p-5" style="background-color:white">
    <p> This is a visual representation of the Block set associative least recently used cache replacement algorithm. Simply fill out the parameters below and watch it work! </p>
    <div class="row" style="text-align: right;">
        <div class="col">
            <div class="form-group">
              <label class='mr-2'>Number of Sets in the Cache:</label>
              <input type="number" v-model.number='cacheParams.cacheSize'/>
            </div>
            <div class="form-group">
              <label class='mr-2'>Number of Blocks per Set:</label>
              <input type="number" v-model.number='cacheParams.setSize'/>
            </div>
        </div>
        <div class="col" >
            <div class="form-group"><label class='mr-2'>Memory Access Time:</label><input type="number" v-model.number='cacheParams.memoryAccessTime'/></div>
            <div class="form-group"><label class='mr-2'>Cache Access Time:</label><input type="number" v-model.number='cacheParams.cacheAccessTime'/></div>
        </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
        <label class='mr-2'>Main memory input (in blocks, comma separated):</label>
        <textarea v-model='dataArrayInput' style="width:80%; height: 50px;"></textarea>
        </div>
      </div>
    </div>
    <div class="row" style="text-align:center;">
      <div class="col">
        <button v-on:click="bsa_lru" class="btn btn-success">Start</button>
      </div>
    </div>
  </div>
  <div v-show="run" class="container rounded p-5 mt-5" style="background-color:white">
      <div class="table-responsive">
        <table class="table">
          <thead>
              <tr>
                  <th>Set</th>
                  <th>Block</th>
                  <th>Data</th>
                  <th>Age</th>
              </tr>
          </thead>
          <tbody>
            <!-- FOR EACH SET -->
            <template v-for="setIndex of cacheParams.cacheSize">
              <tr v-for='blockIndex of cacheParams.setSize' :key='setIndex+blockIndex'>
                <td v-if="blockIndex == 1" :rowspan='cacheParams.setSize'>{{setIndex-1}}</td>
                <td>{{blockIndex-1}}</td>
                <td v-if="cacheData[setIndex-1][blockIndex-1].data==-1">Empty</td>
                <td v-else>{{cacheData[setIndex-1][blockIndex-1].data}}</td>
                <td>{{cacheData[setIndex-1][blockIndex-1].age}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="row mb-4">
            <!-- <div class="col">
                <p style="text-align: left;">
                  Showing step
                    <button v-show="currIndex > 0" v-on:click='stepDown' class="btn">-</button>
                    <button disabled v-show="currIndex == 0" class="btn">-</button>
                    <input min=0 :max='history.length-1' type="text" size="3" v-model='currIndex'/>
                    <button v-show="currIndex < history.length-1" v-on:click='stepUp' class="btn">+</button>
                    <button disabled v-show="currIndex == history.length-1" class="btn">+</button>
                    of {{history.length-1}}
                  </p>
            </div> -->
            <div class="col-6 text-left">
              <h3 class='mb-3'>Cache Input Parameters</h3>
              <p>Number of Sets: {{cacheParams.cacheSize}}</p>
              <p>Number of Blocks per Set: {{cacheParams.setSize}}</p>
              <p>Memory Access Time: {{cacheParams.memoryAccessTime}} timeunits</p>
              <p>Cache Access Time: {{cacheParams.cacheAccessTime}} timeunits</p>
              <p>Input Array {{dataArrayInput}}</p>
            </div>
            <div class="col-6 text-right">
              <h3 class='mb-3'>Cache Output</h3>
              <p>Cache Hit: {{cacheOutput.cacheHits}}</p>
              <p>Cache Miss: {{cacheOutput.cacheMiss}}</p>
              <p>Average Access Time: {{cacheOutput.avgAccessTime}} timeunits</p>
              <p>Total Access Time: {{cacheOutput.totalAccessTime}} timeunits</p>
            </div>
        </div>
        <div class="row d-print-none" style="text-align:center;">
          <div class="col d-flex justify-content-center ">
            <a href='/' style="color:white" class="btn btn-success">Go Back</a>
            <a v-on:click='saveFile()' style="color:white" class="btn btn-success ml-3">Download Output as Text File</a>
            <a onclick="window.print()" style="color:white" class="btn btn-success ml-3">Print Output as PDF File</a>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {saveAs} from 'file-saver';

export default {
  name: 'Main',
  data: function() {
    return {
      dataArrayInput: "1,7,5,0,2,1,5,6,5,2,2,0",
      dataArray: [],
      cacheParams: { // Get input for theses, bind these data to a text field, on click submit = perform BSA LRU
          cacheSize: 2, // Number of Sets in the Cache
          setSize: 2, // Number of Blocks in a set
          memoryAccessTime: 10, // Time to access memory
          cacheAccessTime: 1, // Time to access cache
      },
      cacheData: [],
      cacheOutput: {
          cacheHits: 0, // Integer count for number of hits
          cacheMiss: 0, // Integer count for number of miss
          missPenalty: 0, // float of miss penalty
          avgAccessTime: 0, // float of average access time
          totalAccessTime: 0 // float of total access time
      },
      currIndex: 0,
      history: [],
      run: false,
    }
  },
  created: function (){
    this.initCacheData(this.cacheParams.cacheSize, this.cacheParams.setSize);
  },
  methods: {
    bsa_lru(){
      this.dataArray = this.fromString
      this.initCacheData(this.cacheParams.cacheSize, this.cacheParams.setSize);
      this.startCaching();
      this.postCacheComputations();
      this.currIndex = this.history.length-1;
      this.run = true
    },
    initCacheData(cacheSize, setSize){
      var set, block;
      function dataObject (data, age) {
          this.data = data;
          this.age = age;
      }
      for(set = 0; set < cacheSize; set++) {
        let arr = []
        for (block = 0; block < setSize; block++) {
          arr.push(new dataObject(-1, 0))
        }
        this.cacheData.push(arr)
      }
      console.log(this.cacheData)
    },
    startCaching: function () {
      var x;
      // function dataObject (data, age) {
      //     this.data = data;
      //     this.age = age;
      // }
      var size = new Array(this.cacheParams.cacheSize).fill(0);
      // console.log('size array:' + size)
      for (x of this.dataArray) {
        console.log('CURR: '+x)
        
        // Modulo to find set
        var destSet = x % this.cacheParams.cacheSize;

        // Increase Age of all data in destSet
        this.increaseAge(destSet);

        var inCache = false;
        // Check if exists in cache
        var y;
        for (y of this.cacheData[destSet]) {
          if(y.data == x)
          {
            inCache = true
            y.age = 0;
            this.cacheOutput.cacheHits++
            break;
          }
        }

        if(!inCache) // if doesn't exist in cache
        {
          // Check if destSet is full, if full, LRU, if not, append
          if(size[destSet] == this.cacheParams.setSize) { // its full
            var indexOfMax = 0
            var z, i;
            // Find the Least Recently Used / Oldest Age
            for (i = 1; i < this.cacheData[destSet].length; i++){
              z = this.cacheData[destSet][i];
              if(z.age > this.cacheData[destSet][indexOfMax].age)
                indexOfMax = i;
            }
            this.cacheData[destSet][indexOfMax].data = x;
            this.cacheData[destSet][indexOfMax].age = 0;
            // this.cacheData[destSet][indexOfMax] = new dataObject(z.data, 0)
          } else { // its not full
            this.cacheData[destSet][size[destSet]].data = x;
            this.cacheData[destSet][size[destSet]].age = 0;
            // console.log(this.cacheData[destSet][size[destSet]].data)
            // console.log(size[destSet])
            console.log('ADD NEW!')
            // this.cacheData[destSet].push(new dataObject(x,0))
            size[destSet]++;
          }
          this.cacheOutput.cacheMiss++
        }
        console.log(this.cacheData[0][0].data + "," + this.cacheData[0][0].age + " "  + this.cacheData[0][1].data + "," + this.cacheData[0][1].age);
        console.log(this.cacheData[1][0].data + "," + this.cacheData[1][0].age + " "  + this.cacheData[1][1].data + "," + this.cacheData[1][1].age);
      }
    console.log(this.cacheData)
    

    },
    increaseAge: function (set) {
      var x;
      
      if(this.cacheData[set].length != 0) {
        // console.log(this.cacheData[set])
        for (x of this.cacheData[set]) {
          // console.log("this is x: " + x.data)
          x.age++;
          // console.log("this is x's new age: " + x.age)
        }
      }
    },
    postCacheComputations: function () {
      this.cacheOutput.missPenalty = this.cacheParams.cacheAccessTime*2 + (this.cacheParams.cacheSize*this.cacheParams.memoryAccessTime);
      this.cacheOutput.avgAccessTime = ((this.cacheOutput.cacheHits / this.dataArray.length)*this.cacheParams.cacheAccessTime) + ((this.cacheOutput.cacheMiss / this.dataArray.length)*this.cacheOutput.missPenalty);
      this.cacheOutput.totalAccessTime = (this.cacheOutput.cacheHits*this.cacheParams.cacheSize*this.cacheParams.cacheAccessTime) + (this.cacheOutput.cacheMiss*this.cacheParams.cacheSize*(this.cacheParams.memoryAccessTime+this.cacheParams.cacheAccessTime)) + (this.cacheOutput.cacheMiss*this.cacheParams.cacheAccessTime);
    
      console.log(this.cacheOutput)
    },
    saveFile: function() {
      var outputString = "";

      // INPUT PARAMETERS
      outputString += "INPUT PARAMETERS:\n"
      outputString += JSON.stringify(this.cacheParams) + "\nInput Array: " + this.dataArrayInput + "\n\n";

      outputString += "Set\tBlock\tData\tAge\n";
      var i, j;
      console.log(this.cacheData[0][0].data)
      for (i = 0; i < this.cacheParams.cacheSize; i++){
        for (j = 0; j < this.cacheParams.setSize; j++){
          outputString += `${i}\t${j}\t${this.cacheData[i][j].data}\t${this.cacheData[i][j].age}\n`;
        }
      }
      
      outputString += "\nPOST CACHE STATISTICS:\n"
      outputString += JSON.stringify(this.cacheOutput);
      var blob = new Blob([outputString], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "output.txt");
      console.log(outputString)
      console.log('Downloaded!')
    }
  },
  computed: {
    fromString(){
      let array = this.dataArrayInput.split(',');
      let temp = Array();
      let i=0;
      for (i=0;i<array.length;i++)
        temp.push(parseInt(array[i], 10));
      return temp
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
