<template>

  <el-form v-loading.fullscreen.lock="loading" ref="form"  label-width="120px">
    <img src="../assets/logo.png">
    <div class="box-container" >
        <h2 class="heading">Se connecter</h2>
        <el-row style="margin-bottom: 10px">
          <el-input
              placeholder="Email"
              v-model="email"
              clearable>
          </el-input>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-input  placeholder="Mot de passe" v-model="password" show-password></el-input>
        </el-row>
        <el-row style="margin-bottom: 10px; width: inherit">
          <el-button v-on:click="login" style="width: inherit" type="success" plain>Valider</el-button>
        </el-row>
        <el-row style="margin-bottom: 10px; width: inherit">
          <el-button v-on:click="loginWithFacebook" style="width: inherit" type="primary" plain><i class="fab fa-facebook fa-lg"></i> <label> Se connecter avec Facebook</label></el-button>
        </el-row>
    </div>
    <el-link v-on:click="register" target="_blank">S'enregistrer</el-link>
  </el-form>
</template>

<script>

import axios from 'axios';
export default {
  name: 'login',
  data() {
    return {
      email: this.$route.params.email,
      password: "",
      loading: false
    }
  },
  methods: {
    login() {
      axios.post(process.env.VUE_APP_URL + 'login', {
            'email': this.email,
            'password': this.password
          },
      ).then(response => {
        this.loading = false

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userId', response.data.userId)
        this.$router.push({ name: 'Home' });
            }).catch(e => {
                  console.log(e)
                  this.loading = false
                  this.$notify.error({
                    title: 'Erreur',
                    message: 'Email ou mot de passe incorrect si vous êtes sure de vos informations merci de nous contacter à l\'address mail suivante: soufianelalaoui99@gmail.com'
                  });
              })
    },
    async loginWithFacebook() {
     this.loading = true

      const response = await new Promise(window.FB.login);

      if (response.authResponse) {
        window.FB.api('/me', 'GET',
            {"fields": "email,name"}, user => {
              axios.post(process.env.VUE_APP_URL + "login", {
                    email: user.email,
                    password: 'fb',
                  }
              ).then((response) => {
                this.loading = false
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('userId', response.data.userId)
                this.$router.push({ name: 'Home' });
              }).catch(e => {
                console.log(e)
                this.loading = false
                this.$notify.error({
                  title: 'Erreur',
                  message: 'Ce compte n\'est pas enregistrer'
                });

              })
            });
      }
    },
    register(){
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

