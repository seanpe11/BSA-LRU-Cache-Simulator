<template>
    <div class="container rounded" style="background-color:white">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Block</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- For each set -->
                    <template v-for="(set, index) in history[0]">
                        <tr :key="index">
                            <td :rowspan="cacheInfo.blockSize">{{index}}</td>
                            <td>0 (age={{set.ages[0]}})</td>
                            <td>{{set.data[0]}}</td>
                        </tr>
                        <tr v-for="index in 4-1" :key="index">
                            <td>{{index}} (age={{set.ages[index]}})</td>
                            <td>{{set.data[index]}}</td>
                        </tr>
                    </template>
                    
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "Cache",
    props: {
        cacheInfo: Object,
        cacheData: Array,
    },
    data: function() {
        return {
            history: [],
            currIndex: 0,
            
        }
    },
    created: function() {
        let vm = this
        this.history.push(this.cacheData)
        this.bsa_lru(this.cacheData)
    },
    methods: {
        bsa_lru: function(firstStep) {
            this.history.push(this.cacheData)
            var histCache = []
            let histSet = []
            let block, set
            for (set of this.cacheData){
                histSet = []
                for (block of set)
                    histSet.push({data: block.data, age: block.age})
                histCache.push(histSet)
            }
            console.log(histCache)
        }
    }, 
}
</script>