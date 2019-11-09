<template>
  <div>
    <h1>Registeration</h1>
    <form v-on:submit.prevent="register">
      <input autocomplete="off" name="username" type="text" placeholder="username" v-model="username" />
      <br/>
      <input autocomplete="off" name="password" type="password" placeholder="password" v-model="password" />
      <br/>
      <input autocomplete="off" name="password2" type="password" placeholder="confirm password" v-model="password2" />
      <br/>
      <button :disabled="regDisabled == true">Register</button>
      <p>{{ message }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "register",
  components: {
    
  },
  data() {
    return {
      username: "",
      password: "",
      password2: "",
      message: "",
      regDisabled: false
    }
  },
  methods: {
    register: async function() {
      //compare password and confirm password
      if(this.password === this.password2) {
        this.regDisabled = true;
        //post data to server
        console.log(process.env.VUE_APP_SERVER_ADDRESS);
        const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/register', {
          method: "post",
          data: {username: this.username, password: this.password},
          withCredentials: true
        });
        //show error/success message
        this.message = response.data.msg;
        this.regDisabled = false;
        //clear fields if not success
        if(response.data.status != "success") {
          this.password = "";
          this.password2 = "";
        } else if (response.data.status == "success") {
          this.$router.push('/login');
        }
      } else {
        //if passwords do not match
        this.password = "";
        this.password2 = "";
        this.message = "Passwords do not match";
      }
    }
  }
}
</script>

<style scoped>
p {
    color: red;
}
</style>
