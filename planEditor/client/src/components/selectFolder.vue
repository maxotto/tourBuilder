<template>
    <v-select
            v-model="select"
            :hint="`${select.state}, ${select.abbr}`"
            :items="items"
            item-text="state"
            item-value="abbr"
            label="Select"
            persistent-hint
            return-object
            single-line
    ></v-select>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "selectFolder",
        data () {
            return {
                current: '../..',
                select: { state: 'Florida', abbr: 'FL' },
                items: [
                    { state: 'Florida', abbr: 'FL' },
                    { state: 'Georgia', abbr: 'GA' },
                    { state: 'Nebraska', abbr: 'NE' },
                    { state: 'California', abbr: 'CA' },
                    { state: 'New York', abbr: 'NY' }
                ]
            }
        },
        watch: {
            select(val){
                this.updateList(this.current);
            },
        },
        methods: {
            updateList(current){
                axios.get('/readfolder?c=' + current)
                    .then(response => {console.log(response.data)} )
                    .catch(e => console.log(e));
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>