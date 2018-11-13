<template>
    <div>
        <v-snackbar
                v-model="snackbar.visible"
                :bottom="snackbar.y === 'bottom'"
                :left="snackbar.x === 'left'"
                :multi-line="snackbar.mode === 'multi-line'"
                :right="x === 'right'"
                :timeout="snackbar.timeout"
                :top="y === 'top'"
                :vertical="snackbar.mode === 'vertical'"
        >
            {{ snackbar.text }}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar.snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-btn color="primary" dark class="mb-2" @click="prepareCreate">New project</v-btn>
        <v-dialog v-model="dialog" max-width="1024" >
            <v-card>
                <v-card-title>
                    <span class="headline">{{dlgTitle}}</span>
                    {{editedItem}}
                </v-card-title>

                <v-card-text>
                    <div>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-layout wrap row>
                                    <v-flex xs12>
                                        <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-select
                                                :items="templatesList"
                                                label="Select template to generate"
                                                v-model="editedItem.template"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12>
                                        {{editedItem.location}}
                                    </v-flex>
                                    <v-flex xs12>
                                        <br>
                                        <span style="color: red"><b>Upload files</b></span>
                                    </v-flex>
                                    <v-flex xs12 v-show="editedItem._id">
                                        <uploader
                                                ref="uploader"
                                                :options="options"
                                                class="uploader-example"
                                                @complete="uploaded"
                                        >
                                            <uploader-unsupport></uploader-unsupport>
                                            <uploader-drop>
                                                <p>Drop files here to upload or</p>
                                                <uploader-btn :attrs="attrs">select files</uploader-btn>
                                            </uploader-drop>
                                            <uploader-list></uploader-list>
                                        </uploader>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6>
                                <div style="width: 510px; height: 510px; padding: 15px">
                                    <GmapMap :center="editedItem.location" :zoom="14" style="width: 480px; height: 480px">
                                        <GmapMarker
                                                :position="markerLocation"
                                                :clickable="true"
                                                :draggable="true"
                                                @dragend="dragEnd"
                                                @drag="updateCoordinates"
                                        ></GmapMarker>
                                    </GmapMap>
                                </div>
                            </v-flex>
                        </v-layout>

                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dlgCancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" :disabled="!canSaveNew" flat @click.native="dlgSave">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table
                :headers="headers"
                :items="rows"
                hide-actions
                class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td class="text-xs-center">{{ props.item.title }}</td>
                    <td class="text-xs-center">{{ props.item.folder }}</td>
                    <td class="text-xs-center">{{ props.item.outFolder }}</td>
                    <td class="text-xs-center">{{ props.item.address }}</td>
                    <td class="text-xs-center">{{ props.item.template }}</td>
                    <td class="justify-center layout px-0">
                        <action-buttons :state="props.item.state" :id="props.item._id"></action-buttons>
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                @click="deleteItem(props.item)"
                        >
                            mdi-delete
                        </v-icon>

                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
  import ProjectsService from '@/services/ProjectsService';
  import SelectFolder from '@/components/selectFolder.vue';
  import ActionButtons from '@/components/actionButtons.vue';

  export default {
    name: "projectsList",
    components: {SelectFolder, ActionButtons},
    data () {
      return {
        uploader: undefined,
        options: {
          chunkSize: 52428800*10,
          target: this.getTarget,
          testChunks: false
        },
        attrs: {
          accept: 'application/zip'
        },
        headers: [
          {
            text: 'Title',
            value: 'title'
          },
          { text: 'In Folder', value: 'folder' },
          { text: 'Out Folder', value: 'outFolder' },
          { text: 'Address', value: 'address' },
          { text: 'Template', value: 'template' },
          { text: 'Actions', value: '_id', sortable: false},
        ],
        rows: [],
        dialog: false,
        dlgTitle: '',
        editedIndex: -1,
        editedItem: {
          id: null,
          title: '',
          address: '',
          folder: 'source',
          outFolder: 'destination',
          template: 'First',
          location: {
            lat: 43.6567919,
            lng: -79.6010328,
          },
          state: {}
        },
        newItem: {
          id: null,
          title: '',
          address: '',
          folder: 'source',
          outFolder: 'destination',
          template: 'First',
          location: {
            lat: 43.6567919,
            lng: -79.6010328,
          },
        },
        template: 'First',
        templatesList: [
          'First'
        ],
        markerLocation: {
          lat: 43.6567919,
          lng: -79.6010328,
        },
        snackbar: {
          visible: false,
          y: 'top',
          x: null,
          mode: 'multi-line',
          timeout: 6000,
          text: 'Hello, I\'m a snackbar'
        },
        lastError: '',
      }
    },
    computed: {
      canSaveNew(){
        return (
          this.editedItem.title !== '' &&
          this.editedItem.address !== '' &&
          this.editedItem.folder !== './' &&
          this.editedItem.outFolder !== './' &&
          // this.editedItem.outFolder !== this.editedItem.folder &&
          this.editedItem.location.lat !== 43.6567919 &&
          this.editedItem.location.lng !== -79.6010328
        );
      }
    },
    methods: {
      getTarget(){
        return '/upload/project/' + this.editedItem._id
      },

      uploaded(result){
        console.log({result});
        this.snackbar.text = "File uploaded and unzipped!";
        this.snackbar.visible = true;
      },

      createProject (data) {
        ProjectsService.addProject({
          title: data.title,
          address: data.address,
          folder: data.folder,
          outFolder: data.outFolder,
          template: data.template,
          location: data.location,
          state: {
            floors: false,
            floorsImages: false,
            hotspots: false,
            lookatTag: false,
            needRebuild: false,
            built: false,
            lookatValue: false,
            planHotspots: false,
          }
        })
          .then(result => {
            if (!result.data.success){
              this.snackbar.text = result.data.message;
              this.lastError = result.data.message;
              this.snackbar.visible = true;
            } else {
              this.getList();
              this.dialog = false;
              this.resetDlg();
            }
          })
          .catch(error => {console.log(error)});
      },
      saveProject(data){
        ProjectsService.updateProject(
            {
              title: data.title,
              address: data.address,
              folder: data.folder,
              outFolder: data.outFolder,
              template: data.template,
              location: data.location,
              id: data._id,
              state: data.state,
            }
        )
          .then(result => {
            if (!result.data.success){
              this.snackbar.text = result.data.message;
              this.lastError = result.data.message;
              this.snackbar.visible = true;
            } else {
              this.getList();
              this.dialog = false;
              this.resetDlg();
            }
          })
          .catch(err => {console.log(err)});
      },
      setInFolder(folder){
        this.editedItem.folder = folder;
      },
      setOutFolder(folder){
        this.editedItem.outFolder = folder;
      },
      dlgSave(){
        console.log(this.editedItem);
        if(this.editedItem._id){
          this.saveProject(this.editedItem)
        } else {
          this.createProject(this.editedItem);
        }
      },
      dlgCancel(){
        this.dialog = false;
        this.resetDlg();
      },
      resetDlg(){
        this.lastError = '';
        this.editedItem = Object.assign({}, this.newItem);
        this.markerLocation = this.newItem.location;
        this.editedIndex = -1;
        this.uploader.cancel();
      },
      getList(){
        ProjectsService.fetchProjects()
          .then(result => {
            if (result.data.success) {
              this.rows = result.data.items;
            }
          })
          .catch(e => {console.log(e)});
      },
      editItem (item) {
        console.log(item);
        this.resetDlg();
        this.editedIndex = this.rows.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.options.target = '/upload/project/'+this.editedItem._id;
        this.markerLocation = this.editedItem.location;
        this.dlgTitle = 'Edit the project';
        this.dialog = true;
      },

      deleteItem (item) {
        const rowId = item._id;
        //alert(rowId);
        confirm('Are you sure you want to delete this project "' + item.title + '"?') && this.deleteFromDB(rowId)
      },
      deleteFromDB(id){
        ProjectsService.deleteProject(id)
          .then(result => {
            console.log(result);
            this.getList();
          })
          .catch(e => {console.log(e)})
      },
      prepareCreate(){
        this.editedItem = Object.assign({}, this.newItem);
        this.markerLocation = this.newItem.location;
        this.dlgTitle = 'Create new project';
        this.dialog = true;
      },
      dragEnd(e){
        this.editedItem.location = this.markerLocation;
      },
      updateCoordinates(location) {
        this.markerLocation = {
          lat: location.latLng.lat(),
          lng: location.latLng.lng(),
        };
      },
    },
    mounted(){
      this.$nextTick(() => {
      this.uploader = this.$refs.uploader.uploader;
      });
      this.getList();
    }
  }
</script>

<style scoped>
    .uploader-example {
        width: 450px;
        padding: 15px;
        margin: 40px auto 0;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    }
    .uploader-example .uploader-btn {
        margin-right: 4px;
    }
    .uploader-example .uploader-list {
        max-height: 350px;
        overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>