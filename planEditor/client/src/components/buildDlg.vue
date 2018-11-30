<template>
    <v-dialog
            v-model="show"
            max-width="500"
    >
        <v-card>
            <v-card-title class="headline">{{id}}</v-card-title>

            <v-card-text>
                Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="closeDlg()"
                >
                    Disagree
                </v-btn>

                <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="closeDlg()"
                >
                    Agree
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: "buildDlg",
    props: ['id', 'show'],
    methods: {
      closeDlg(){
        this.$emit('closeDlg', true);
      },
    },
  }
</script>

<style scoped>

</style>