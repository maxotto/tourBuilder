<template>
    <div>

        <v-flex xs12 sm6 offset-sm3>
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
                            :rules="nameRules"
                            label="Title"
                            required
                    ></v-text-field>
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
                    <div  style="width: 500px; height: 500px">
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
                    <v-card-actions>
                        <v-btn flat color="green" @click="createProject">Create</v-btn>
                    </v-card-actions>
                </v-form>

            </v-card>
        </v-flex>

    </div>
</template>

<script>
  export default {
    name: "newProject",
    data: function () {
      return {
        title: '',
        address: '',
        template: '',
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
      dragEnd(e){
        this.center = this.markerLocation;
      },
      updateCoordinates(location) {
        this.markerLocation = {
          lat: location.latLng.lat(),
          lng: location.latLng.lng(),
        };
      },
      createProject(){
        alert('Need To save new project.');
      }
    },
    watch:{
      markerLocation(val){
        console.log(val);
      }
    },
  }
</script>

<style scoped>

</style>