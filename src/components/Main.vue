<template>
  <div>
  <div class="container rounded" style="background-color:white">
    <p> This is a visual representation of the Block set associative least recently used cache replacement algorithm. Simply fill out the parameters below and watch it work! </p>
  </div>
  <div class="container rounded" style="background-color:white">
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
          <template v-for="setIndex of cacheParams.blockSize">
            <tr v-for='blockIndex of cacheParams.setSize' :key='setIndex+blockIndex'>
              <td>{{setIndex-1}}</td>
              <td>{{blockIndex-1}}</td>
              <td>{{cacheData[setIndex-1][blockIndex-1].data}}</td>
              <td>{{cacheData[setIndex-1][blockIndex-1].age}}</td>
            </tr>
          </template>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data: function() {
    return {
      cacheParams: { // Get input for theses, bind these data to a text field, on click submit = perform BSA LRU
          blockSize: 2, // Number of Sets in the Block
          setSize: 2, // Number of Blocks in a set
          memoryAccessTime: 10, // Time to access memory
          cacheAccessTime: 1, // Time to access cache
          dataArray: [1,7,5,0,2,1,5,6,5,2,2,0] // Data array
      },
      cacheData: [
        // depends on blocksize and setsize
        [],
        []
      ],
      cacheOutput: {
          cacheHits: 0, // Integer count for number of hits
          cacheMiss: 0, // Integer count for number of miss
          missPenalty: 0, // float of miss penalty
          avgAccessTime: 0, // float of average access time
          totalAccessTime: 0 // float of total access time
      },
    }
  },
  created: function (){
    this.initCacheData(this.cacheParams.blockSize, this.cacheParams.setSize);
    this.startCaching();
    this.postCacheComputations();
  },
  methods: {
    initCacheData(blockSize, setSize){
      var i, j;
      function dataObject (data, age) {
          this.data = data;
          this.age = age;
      }
      for(i = 0; i < blockSize; i++) {
        for (j = 0; j < setSize; j++) {
          this.cacheData[i][j] = new dataObject(-1,0)
        }
      }
      console.log(this.cacheData)
    },
    startCaching: function () {
      var x;
      // function dataObject (data, age) {
      //     this.data = data;
      //     this.age = age;
      // }
      var size = new Array(this.cacheParams.blockSize).fill(0);
      // console.log('size array:' + size)
      for (x of this.cacheParams.dataArray) {
        console.log('CURR: '+x)
        
        // Modulo to find set
        var destSet = x % this.cacheParams.blockSize;

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
      this.cacheOutput.missPenalty = this.cacheParams.cacheAccessTime*2 + (this.cacheParams.blockSize*this.cacheParams.memoryAccessTime);
      this.cacheOutput.avgAccessTime = ((this.cacheOutput.cacheHits / this.cacheParams.dataArray.length)*this.cacheParams.cacheAccessTime) + ((this.cacheOutput.cacheMiss / this.cacheParams.dataArray.length)*this.cacheOutput.missPenalty);
      this.cacheOutput.totalAccessTime = (this.cacheOutput.cacheHits*this.cacheParams.blockSize*this.cacheParams.cacheAccessTime) + (this.cacheOutput.cacheMiss*this.cacheParams.blockSize*(this.cacheParams.memoryAccessTime+this.cacheParams.cacheAccessTime)) + (this.cacheOutput.cacheMiss*this.cacheParams.cacheAccessTime);
    
      console.log(this.cacheOutput)
    }
  }
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
