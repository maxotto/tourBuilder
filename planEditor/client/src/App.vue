<template>
  <v-app>
    <v-navigation-drawer
            v-model="drawer"
            fixed
            app
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/projects">
          <v-list-tile-action>
            <v-icon>mdi-panorama</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>KrPano projects list</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>KrPano tour builder</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-speed-dial
              small
              v-model="fab"
              :top="top"
              :bottom="bottom"
              :right="right"
              :left="left"
              :direction="direction"
              :open-on-hover="hover"
              :transition="transition"
      >
        <v-btn
                slot="activator"
                v-model="fab"
                color="blue darken-2"
                dark
                fab
        >
          <v-icon>mdi-account-circle</v-icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
                fab
                dark
                small
                color="green"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
                fab
                dark
                small
                color="indigo"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
                fab
                dark
                small
                color="red"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      direction: 'bottom',
      fab: false,
      fling: false,
      hover: true,
      tabs: null,
      top: false,
      right: true,
      bottom: false,
      left: false,
      transition: 'slide-y-reverse-transition',
      drawer: null,
      clipped: true,
      fixed: true,
      title: 'Plan editor for KrPano. Part of TourBuilder.'
    }
  }
}
</script>
