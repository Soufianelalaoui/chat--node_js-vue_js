<template>
  <el-form v-loading.fullscreen.lock="loading" ref="form"  label-width="120px">
    <img src="../assets/logo.png">
    <div class="box-container" >
      <h2 class="heading">S'enregister</h2>
      <el-row style="margin-bottom: 10px">
        <el-input placeholder="Email" v-model="email" clearable></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-input placeholder="Nom d'utilisateur" v-model="username" clearable></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-input  placeholder="Mot de passe" v-model="password" show-password></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-input  placeholder="Confirmer le mot de passe" v-model="passwordConfirmation" show-password></el-input>
      </el-row>
      <el-row style="margin-bottom: 10px; width: inherit">
        <el-button v-on:click="register" style="width: inherit"  type="success" plain>Valider</el-button>
      </el-row>
      <el-row style="margin-bottom: 10px; width: inherit">
        <el-button v-on:click="registerWithFacebook" style="width: inherit" type="primary" plain><i class="fab fa-facebook fa-lg"></i> <label> S'enregistrer avec Facebook</label></el-button>
      </el-row>
    </div>
    <el-link v-on:click="login" target="_blank">Se connecter</el-link>
  </el-form>
</template>

<script>
import axios from 'axios';
export default {
  name: 'login_signup_social',
  data() {
    return {
      username: "",
      password: "",
      email: "",
      passwordConfirmation: "",
      loading: false
    }
  },

  methods: {
    checkForm(){
      const h = this.$createElement;
      let valide = true
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(this.email)){
        this.$message({
          message: h('p', null, [
            h('span', null, 'Syntaxe email invalide '),
            h('i', { style: 'color: teal' })
          ])
        });
        valide = false
      }
      if(this.username.length < 3){
        this.$message({
          message: h('p', null, [
            h('span', null, 'le pseudo doit contenir 3 lettres ou + '),
            h('i', { style: 'color: teal' })
          ])
        });
        valide = false
      }
      if(this.password < 3 ){
        this.$message({
          message: h('p', null, [
            h('span', null, 'le mot de passe doit contenir 3 lettres ou + '),
            h('i', { style: 'color: teal' })
          ])
        });
        valide = false
      }
      if(this.password !== this.passwordConfirmation){
        this.$message({
          message: h('p', null, [
            h('span', null, 'les mots de passes ne sont pas identique'),
            h('i', { style: 'color: teal' })
          ])
        });
        valide = false
      }
      return valide
    },
    register() {
      this.loading = true
      if(this.checkForm()){
        axios.post(process.env.VUE_APP_URL + "register", {
              email: this.email,
              password: this.password,
              username: this.username,
              facebook: false
            }
        ).then(() => {
          this.$router.push({name: 'Login', params: { email: this.email } })
          this.$notify({
            title: 'Compte enregistré',
            type: 'success'
          });
        }).catch(e => {
          console.log(e)
          this.loading = false
          this.$notify.error({
            title: 'Erreur',
            message: 'Un compte utilise déjas l\'email'
          });
        })
      }else {
        this.loading = false
      }
    },
    async registerWithFacebook() {
      const response = await new Promise(window.FB.login);
      this.loading = true
      if (response.authResponse) {
        window.FB.api('/me', 'GET',
            {"fields": "email,name"}, user => {
              axios.post(process.env.VUE_APP_URL + "register", {
                    email: user.email,
                    password: 'fb',
                    username: user.name
                  }
              ).then((response) => {
                this.loading = false
                this.$router.push({name: 'Login', params: { email: response.email } })
                this.$notify({
                  title: 'Compte enregistré',
                  type: 'success'
                });
              }).catch(e => {
                console.log(e)
                this.loading = false
                this.$notify.error({
                  title: 'Erreur',
                  message: 'Un compte utilise déjas l\'email'
                });
              })
            });
      }
    },
    login(){
      this.$router.push({
        name: 'Login'
      })
    }
  }
}

</script>
