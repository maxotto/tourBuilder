<template>
    <div>
        <v-layout row wrap>
            <v-flex xm6>
                <v-card>
                    <p></p>
                    <v-img
                            src="https://krpano.com/tours/kuchlerhaus/imagebars/werkstatt1glasblaeserei.jpg"
                    ></v-img>

                    <v-card-title primary-title>
                        <div>
                            <h1  class="headline mb-0">New project</h1>
                            <p>Fill the fields and press "Create" button when ready.</p>
                        </div>
                    </v-card-title>
                    <v-form v-model="valid">
                        <v-text-field
                                v-model="title"
                                label="Title"
                                required
                        ></v-text-field>
                        <select-folder @clicked="setFolder"></select-folder>
                        <v-select
                                :items="templatesList"
                                label="Select template to generate"
                                v-model="template"
                        ></v-select>
                        <v-text-field
                                v-model="address"
                                label="Address"
                                required
                        ></v-text-field>
                        <p>Location: {{center}}</p>
                    </v-form>

                </v-card>
            </v-flex>
            <v-flex xm6>
                <div  style="width: 500px; height: 500px; padding: 20px" >
                    <GmapMap :center="center" :zoom="7" style="width: 500px; height: 500px">
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
        <v-layout row wrap>
            <v-flex xm6 offset-xm3>
                <v-card-actions>
                    <v-btn flat color="green" @click="createProject">Create</v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>

    </div>
</template>

<script>
  import SelectFolder from '@/components/selectFolder.vue';
  import ProjectsService from '@/services/ProjectsService';
  export default {
    name: "newProject",
      components: {SelectFolder},
      data: function () {
      return {
        title: '',
        address: '',
        inFolder: './',
        template: 'First',
        templatesList: [
          'First'
        ],
        path: '',
        center: {
          lat: 43.6567919,
          lng: -79.6010328,
        },
        markerLocation: {
          lat: 43.6567919,
          lng: -79.6010328,
        }
      }
    },
    methods: {
      async createProject () {
        await ProjectsService.addProject({
          title: this.title,
          address: this.address,
          folder: this.inFolder,
          template: this.template,
          location: this.center,
        });
        this.$router.push('/projects');
      },
      setFolder(folder){
        this.inFolder = folder;
      },
      dragEnd(e){
        this.center = this.markerLocation;
      },
      updateCoordinates(location) {
        this.markerLocation = {
          lat: location.latLng.lat(),
          lng: location.latLng.lng(),
        };
      },

    },
    watch:{

    },
  }
</script>

<style scoped>

</style>