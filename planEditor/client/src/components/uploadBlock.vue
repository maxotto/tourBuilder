<template>
    <v-layout row wrap :class="`upload${template.number}`">

        {{response}}
        <v-flex xs4>
            <ul>
                <li v-for="(file, index) in files" :key="file.id">
                    <span>{{file.name}}</span> -
                    <span>{{file.size | formatSize}}</span> -
                    <span v-if="file.error">{{file.error}}</span>
                    <span v-else-if="file.success">success</span>
                    <span v-else-if="file.active">active</span>
                    <span v-else-if="file.active">active</span>
                    <span v-else></span>
                </li>
            </ul>
        </v-flex>
        <v-flex xs4>
            <file-upload
                    :post-action="`/upload/floorImage/${id}/${template.number}`"
                    :response="response"
                    extensions="gif,jpg,jpeg,png,webp"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    :multiple="false"
                    :size="1024 * 1024 * 10"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="upload">
                <v-btn small >
                    <v-icon>
                        mdi-plus
                    </v-icon>
                    Select files
                </v-btn>
            </file-upload>
        </v-flex>
        <v-flex xs4>
            <v-btn small v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                <v-icon>
                    mdi-upload
                </v-icon>
                Start Upload
            </v-btn>
            <v-btn small v-else @click.prevent="$refs.upload.active = false">
                <v-icon>
                    mdi-delete
                </v-icon>
                Stop Upload
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  export default {
    name: "uploadBlock",
    components: {FileUpload},
    props: ['template', 'id'],
    data() {
      return {
        files: [],
        response: {},
      }
    },
    methods: {
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
        if (newFile.success !== false) {
          console.log('success??', newFile, oldFile);
          this.response = newFile.response;
        }
        if (newFile && !oldFile) {
          // add
          console.log('add', newFile)
        }
        if (newFile && oldFile) {
          // update
          console.log('update', newFile)
        }
        if (!newFile && oldFile) {
          // remove
          console.log('remove', oldFile)
        }
      }
    }
  }
</script>

<style scoped>

</style>