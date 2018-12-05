import Vue from "vue";
import App from "@/App";
import VueMaterial from "vue-material";
import VueCookies from "vue-cookies";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import axios from "axios";
import VueAxios from "vue-axios";
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";
//import Vuex from "vuex";

Vue.config.productionTip = false;
//Vue.config.BASE = "https://diglife.com/webhooks";

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.use(VueMaterial);
//Vue.use(Vuex);

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  data: () => ({
    users: [],
    channels: [],
    groups: ""
  }),
  created: function() {
    this.axios
      .get(BASEURL + "webhooks/portal_users2.php?file=base-diglife-coop.php")
      .then(response => (this.users = response.data))
      //.then(response => console.log(this.users))
      .then(response =>
        db
          .database()
          .ref("portal_users")
          .set(this.users)
      );

    this.axios
      .get(
        BASEURL +
          "webhooks/portal_channels2.php?file=base-diglife-coop.php&username=ledgerbot"
      )
      .then(response => (this.channels = response.data))
      //.then(response => console.log(this.channels))
      .then(response =>
        db
          .database()
          .ref("portal_channels")
          .set(this.channels)
      );

    if (this.$cookies.get("username")) {
      this.axios
        .get(
          BASEURL +
            "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=" +
            this.$cookies.get("username")
        )
        .then(response => (this.groups = response.data))
        //.then(response => console.log(this.channels))
        .then(response =>
          db
            .database()
            .ref("portal_profiles/" + this.$cookies.get("username"))
            .set(this.groups)
        );
    }

    this.axios
      .get(
        BASEURL +
          "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=ledgerbot"
      )
      .then(response => (this.groups = response.data))
      //.then(response => console.log(this.channels))
      .then(response =>
        db
          .database()
          .ref("portal_profiles/ledgerbot")
          .set(this.groups)
      );

    // this.axios
    //   .get(
    //     BASEURL +
    //       "webhooks/portal_channels.php?file=base-diglife-coop.php&username=ledgerbot"
    //   )
    //   .then(response => (this.channels = response.data))
    //   .then(response => console.log(this.channels))
    //   .then(response =>
    //     this.channels.forEach(function(channel) {
    //       db.firestore()
    //         .collection("channels")
    //         .doc(channel.id)
    //         .set({
    //           type: channel.type || "",
    //           name: channel.name || "",
    //           display_name: channel.display_name || "",
    //           header: channel.header || "",
    //           purpose: channel.purpose || "",
    //           total_msg_count: channel.total_msg_count || "",
    //           team: channel.team || ""
    //         });
    //     })
    //   );

    // if (this.$cookies.get("username")) {
    //   this.axios
    //     .get(
    //       BASEURL +
    //         "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=" +
    //         this.$cookies.get("username")
    //     )
    //     .then(response => (this.groups = response.data))
    //     .then(response =>
    //       db
    //         .firestore()
    //         .collection("members")
    //         .doc(this.$cookies.get("username"))
    //         .update({
    //           groups: this.groups.channels || "",
    //           grouptags: this.groups.tags || ""
    //         })
    //     );
    // }
  }
});
