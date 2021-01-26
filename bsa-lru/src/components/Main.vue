<template>
  <div>
  <div class="container" style="background-color:white">
    <p> This is a visual representation of the Block set associative least recently used cache replacement algorithm. Simply fill out the parameters below and watch it work! </p>
  </div>
  <Cache :cacheData="cacheParams"/>
  </div>
</template>

<script>
import Cache from './Cache.vue'
export default {
  name: 'Main',
  components: {
    Cache,
  },
  data: function() {
    return {
      cacheParams: {},
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
