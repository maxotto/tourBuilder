<template>
    <v-select
            v-model="select"
            :items="items"
            label="Select folder of input 3D pano"
    ></v-select>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "selectFolder",
      props: ['iniPath'],
        data () {
            return {
                fullSelectedPath: '..',
                select: '',
                items: [
                ],

            }
        },
        watch: {
            select(val){
              this.updateList();
            },
          iniPath(val){
            this.fullSelectedPath = val;
            this.select = './';
            this.updateList();
          }
        },
        methods: {
            updateList(){
                axios.get('/readfolder?s=' + this.select + '&f=' + this.fullSelectedPath)
                    .then(response => {
                      if(response.data.success){
                        this.select = response.data.current;
                        this.fullSelectedPath = response.data.current;
                        this.items = response.data.items;
                        this.$emit('clicked', this.select);
                      }
                    })
                    .catch(e => console.log(e));
            }
        },
        mounted(){
          this.updateList();
        }
    }
</script>

<style scoped>

</style>