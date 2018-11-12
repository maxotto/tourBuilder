<template>
    <v-container align-content-center class="upload">
            <file-upload
                    :post-action="`/upload/project/${recordId}`"
                    :input-id="`dir${recordId}`"
                    directory
                    v-model="directory"
                    multiple
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    :ref="`upload-dir${recordId}`">
                <v-btn small :ref="`uploadbtn${recordId}`">
                    <template v-if="uploaded">
                        <v-icon>
                            mdi-reload
                        </v-icon>
                        Change map image
                    </template>
                    <template v-else>
                        <v-icon>
                            mdi-plus
                        </v-icon>
                        Add map image
                    </template>
                </v-btn>
            </file-upload>
            {{directory}}
    </v-container>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  export default {
    name: "uploadBlock",
    components: {FileUpload},
    props: ['recordId'],
    data() {
      return {
        uploaderActive: false,
        directory: [],
        uploaded: false,
      }
    },
    mounted(){
      /*
      const n = 'upload' + this.template.number;
      this.$watch(
        () => {
          return this.$refs[n].active
        },
        (val) => {
          this.uploaderActive = val;
          // alert('$watch Active: ' + val)
        }
      )
      */
    },
    watch:{
      /*
      forceUpload(val){
        if(val && !this.template.uploaded) {
          // console.log('forceUpload',val);
          // this.startUpload(this.template.number);
          var btn = this.$refs['uploadbtn' + this.template.number];
          document.getElementById('file' + this.template.number).click();
          // console.log({input});
          // input.click();
          // btn.trigger("click");
        }
      }
      */
    },
    methods: {
      startUpload(floorNumber){
        // console.log('start this', floorNumber);
        // console.log(this.$refs);
        this.$refs['upload-dir' + this.recordId].active = true;
      },

      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // Before adding a file
          // 添加文件前
          // Filter system files or hide files
          // 过滤系统文件 和隐藏文件
          if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
            return prevent()
          }
          // Filter php html js file
          // 过滤 php html js 文件
          if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
            return prevent()
          }
        }
      },
      inputFile(newFile, oldFile) {
        if (newFile && newFile.success !== false) {
          // console.log('success??', newFile, oldFile, this.template.number);
          //this.response = newFile.response;
          // this.$emit('clicked', this.template.number);
        }
        if (newFile && !oldFile) {
          // add
          //console.log('add', newFile);
          this.startUpload();
        }
        if (newFile && oldFile) {
          // update
          //console.log('update', newFile)
        }
        if (!newFile && oldFile) {
          // remove
          //console.log('remove', oldFile)
        }
      }
    }
  }
</script>

<style scoped>
    .upload{
        padding-top: unset;
        padding-bottom: unset;
    }
    p{
        text-align: center;
        margin: unset;
        padding: unset;
    }
</style>