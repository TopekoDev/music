<template>
  <div class="container">
    <div class="centered">
      <h1>Create account</h1>
      <form v-on:submit.prevent="register">
        <input class="inField" autocomplete="off" name="username" type="text" placeholder="username" v-model="username" />
        <br/>
        <input class="inField" autocomplete="off" name="password" type="password" placeholder="password" v-model="password" />
        <br/>
        <input class="inField" autocomplete="off" name="password2" type="password" placeholder="confirm password" v-model="password2" />
        <br/>
        <button type="button" id="back" v-on:click="$router.push('/')">Back</button>
        <button type="submit" id="register" :disabled="regDisabled">Register</button>
      </form>
      <p style="opacity: 0;" v-if="message==''">blank</p>
      <p>{{ message }}</p>
    </div>
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
.container {
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
.centered {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
.inField {
    background-color:rgb(255, 255, 255);
    font-size: 15px;
    border: none;
    color: rgb(0, 0, 0);
    height: 35px;
    width: 250px;
    flex: 1;
    padding: 0 5px 0 5px;
    margin-bottom: 5px;
    border-radius: 2px;
}
#register {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    margin: 10px 0 0 25px;
    padding: 10px 30px 10px 30px;
    color: white;
}
#back {
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    margin: 10px 25px 0 0;
    padding: 10px 30px 10px 30px;
    color: rgb(139, 139, 139);
}
button {
    cursor: pointer;
    font-size: 15px;
}
</style>
