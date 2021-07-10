<template>
  <el-container style="background-color: #2c3e50; height: 100vh">
    <el-dialog title="Recherche de gifs" :visible.sync="gifDialogVisible">
        <el-input style="width: 70%; margin-right: 10px;" placeholder="Nom du gif..." v-model="searchTerm" :min="1" :max="140"></el-input>
        <el-button style="width: auto;" type="primary" @click=getGifs>Chercher</el-button>
      <div class="gif-container">
        <button v-on:click="sendGif(gif)" v-for="gif in gifs" :key="gif.id"><img :src="gif"/></button>
      </div>
    </el-dialog>
    <el-dialog
        title="Utilisateur selectionné:"
        :visible.sync="dialogVisible"
        width="30%">
      <el-row style="margin-bottom: 10px"><label style="margin-right: 5px; font-weight: bolder">Nom : </label><label>{{ userSelect.value }}</label></el-row>
      <el-row style="margin-bottom: 10px"><label style="margin-right: 5px; font-weight: bolder">Email : </label><label>{{ userSelect.email }}</label></el-row>
      <el-row>
        <el-button type="success" v-on:click="sendFriendRequest">Ajouter en ami</el-button>
        <el-button type="success" v-on:click="reportFriend">Reporter user</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
        title="Demandes d'amis:"
        :visible.sync="friendRequestVisible"
        width="60%">
      <div v-if="friendRequestList.length === 0">
        Vous n'avez aucune demandes d'amis
      </div>
      <div v-else>
        <ul id="demandes">
          <div v-for="friendRequest in friendRequestList" :key="friendRequest.id">
            <el-row style="margin-top: 50px; border: thick double #32a1ce; border-radius: 12px; padding : 20px;">
              <el-col :span="4"><label>{{ friendRequest.username }}</label></el-col>
              <el-col :span="10"><el-button v-on:click="acceptRequest(friendRequest.id)" type="success">Accepter</el-button></el-col>
              <el-col :span="10"><el-button v-on:click="declineRequest(friendRequest.id)" type="danger">Refuser</el-button></el-col>
            </el-row>
          </div>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
        v-if="user.isAdmin==1"
        title="Utilisateur signaler:"
        :visible.sync="reportListVisible"
        width="60%">
      <div v-if="reportList.length === 0">
        Pas d'utilisateur signaler
      </div>
      <div v-else>
        <ul id="report">
          <div v-for="report in reportList" :key="report.id">
            <div v-if="report.id != user.id">
              <el-row style="margin-top: 50px; border: thick double #32a1ce; border-radius: 12px; padding : 20px;">
                <el-col :span="4"><label>{{ report.username }}</label></el-col>
                <el-col :span="10" v-if="report.banned === null"><el-button v-on:click="banUsersById(report.id)" type="danger">Ban</el-button></el-col>
                <el-col :span="10" v-else><div>Banned</div></el-col>
              </el-row>
            </div>
          </div>
        </ul>
      </div>
    </el-dialog>
    <el-aside width="40vw" style="margin-top: 50px">
      <el-form v-loading.fullscreen.lock="loading" ref="form" :model="user" label-width="120px">
        <div class="box-container" style="border: none;">
          <h2 class="heading">Votre profil</h2>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Email">
              <el-input v-model="user.email" disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Nom">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Naissance">
              <el-col :span="11">
                <el-date-picker
                    v-model="user.birthday"
                    type="date"
                    placeholder="Choississez une date"
                    format="dd-MM-yyyy">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Texte">
              <el-color-picker v-model="user.text_color"/>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Fond d''écran">
              <el-color-picker v-model="user.background_color"/>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-form-item label="Sexe">
              <el-radio-group v-model="user.sexe">
                <el-radio label="Homme" style="margint-left: none"></el-radio>
                <el-radio label="Femme"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row style="margin-bottom: 10px; width: inherit">
            <el-button v-on:click="updateUser" style="width: inherit" type="success" plain>Modifier le profil
            </el-button>
          </el-row>
        </div>
      </el-form>
    </el-aside>
    <el-main style="background-color: white; padding: unset">
      <el-container style="height: 100%">
        <el-header>
          <el-menu class="el-menu--horizontal" style=" align-items: normal">
            <el-menu-item>
              <el-autocomplete
                  v-model="queryUser"
                  :fetch-suggestions="searchUser"
                  @select="selectUser"
                  placeholder="Rechercher un utilisateur"
                  :trigger-on-focus="false">
              </el-autocomplete>
            </el-menu-item>
            <el-menu-item>
              <el-button v-on:click="getFriendRequestList" style="width: inherit" type="primary" plain>Demandes d'amis</el-button>
            </el-menu-item>
            <el-menu-item>
              <el-button v-if="user.isAdmin==1" v-on:click="getReportedList" style="width: inherit" type="primary" plain>Utilisateur signalé</el-button>
            </el-menu-item>
            <el-menu-item>
              <el-button v-on:click="deconexion" style="width: inherit" type="danger" plain>Déconnection</el-button>
            </el-menu-item>
          </el-menu>
        </el-header>
        <el-main id="main" style="padding:unset; height: 100%">
          <el-container style="height: 100%; padding: unset;margin: unset">
            <el-aside width="40%" style="height: 100%;padding: unset;" >
              <el-card style="height: 100%;width:100%;padding: unset;overflow: auto;" >
                <div slot="header" class="clearfix">
                  <span>Mes amis</span>
                </div>
                <div v-if="friendList.length === 0">
                  Votre liste d'amis est vide
                </div>
                <div v-else>
                  <el-input type="text" v-model="friendFilter" @input="filterFunction" placeholder="chercher un ami.."></el-input>
                  <ul id="myUL" v-for="friend in friendListFilter" :key="friend.id" class="text item" style="padding: unset">
                    <li class="hover-list-amis" style="display: flex; flex-direction:row;" v-if="friend.username" >
                      <el-tag v-if="userConnectedList.includes(String(friend.id))" type="success">Connecté</el-tag>
                      <el-tag v-if="!(userConnectedList.includes(String(friend.id)))" type="danger">Déconnecté</el-tag>
                      <div  style="width: 50%; padding: 7px"><label>{{friend.username}}</label></div>
                      <div>
                        <el-button v-on:click="startChat(friend)">Chat</el-button>
                      </div>
                      <div style="display: flex;flex-direction: row-reverse;width: 50%">
                        <el-tooltip class="item" effect="dark" content="Supprimer l'amis" placement="top">
                          <el-popconfirm
                              @confirm=deleteUserFriend(friend.id)
                              title="Supprimer cet ami"
                          >
                            <el-button  style="font-size: 8px" type="danger" icon="el-icon-delete" size="mini" slot="reference" circle> </el-button>
                          </el-popconfirm>
                        </el-tooltip>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-card>
            </el-aside>
            <!-- DEBUT CHAT -->
            <el-main id="chatroom" style="height: 100%; width: 100%; position: relative; padding:unset; border: 1px solid #E8E8E8;margin: unset">
              <el-container style="height: 100%; padding: unset; margin: unset">
                <el-aside width="100%" style="height: 100%;padding: unset;" >
                  <div v-if="chatName == ''">
                    <div style="padding: 20px;">
                      Veuillez choisir un ami pour commencer à discuter
                    </div>
                  </div>
                  <div v-else>
                    <div id="chatmenu" style="position: absolute; width: 100%; top: 0;">
                      <el-container style="padding: 17px; border: 1px solid #E8E8E8;">
                        Vous parlez avec {{ chatName }}
                      </el-container>
                    </div>
                    <div id="chatdisplay" style="height: 80%; width: 100%; margin-top: 80px; overflow-y: scroll;">
                      <ul id="messages" style="list-style: none;">
                        <li v-for="message in messageList[chatId]" :key="message.id">
                            <div v-if="message.fromMe === true">
                              <div style="text-align: right; margin-bottom: 30px;">
                                <span style="text-align: left; display: inline-block; max-width: 100%; word-wrap:break-word; height: auto; background: #D8DEF7; padding: 10px; border-radius: 30px; margin-right: 10px; margin-bottom: 10px;">
                                  <div v-if="checkMedia(message.message)">
                                    <img :src="message.message" class="displayedImg"/>
                                  </div>
                                  <div v-else>
                                    {{ message.message}}
                                  </div>
                                </span>
                              </div>
                            </div>
                            <div v-else>
                              <div style="text-align: left; margin-bottom: 30px;">
                                <span style="text-align: left; display: inline-block; max-width: 100%; word-wrap:break-word; height: auto; background: #D8DEF7; padding: 10px; border-radius: 30px; margin-right: 10px; margin-bottom: 10px;">
                                  <div v-if="checkMedia(message.message)">
                                    <img :src="message.message" class="displayedImg"/>
                                  </div>
                                  <div v-else>
                                    {{ message.message}}
                                  </div>
                                </span>
                              </div>
                            </div>
                        </li>
                      </ul>
                    </div>
                    <div id="chatform" style="height: 4%;position: absolute; width: 100%; bottom: 0; padding: 10px; border: 1px solid #E8E8E8;">
                      <el-form style="display: inline;" v-loading.fullscreen.lock="loading" ref="chatForm" :model="chat">
                        <el-input id="sendMsg" style="width: 60%; margin-right: 10px;" placeholder="Message..." v-model="chat.message" :min="1" :max="140"></el-input>
                        <el-button v-on:click="gifDialogVisible = true">Gif</el-button>
                        <el-button id="sendBtn" style="width: auto;" type="primary" v-on:click="verifyMessage">Envoyer</el-button>
                      </el-form>
                    </div>
                  </div>
                </el-aside>
              </el-container>
            </el-main>
            <!-- FIN CHAT -->
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
  name: 'Home',
  data() {
    return {
      socket: {},
      userId: undefined,
      token: undefined,
      loading: false,
      text_color: undefined,
      background_color: undefined,
      queryUser: '',
      userList: [],
      userSelect: {},
      dialogVisible: false,
      gifDialogVisible: false,
      user: {},
      friendRequestList: [],
      friendRequestVisible: false,
      reportList: [],
      reportListVisible: false,
      friendList: [],
      friendListFilter: [],
      friendFilter: "",
      userConnectedList: [],
      messageList: [],
      chatName: '',
      chatId: '',
      chat: {},
      searchTerm: "",
      gifs: [],
    }
  },
  created: function () {
    this.socket = io(process.env.VUE_APP_SOCKET);
    if (localStorage.getItem('token') == undefined || localStorage.getItem('userId') == undefined) {
      this.$router.push({name: 'Login'});
    } else {
      this.token = localStorage.getItem('token');
      this.userId = localStorage.getItem('userId');
    }
    this.socket.emit('login', String(this.userId));
    axios.get(process.env.VUE_APP_SOCKET + '/userConnected').then(response => {
      this.userConnectedList = response.data;
    });
    axios.defaults.headers.common['Authorization'] = this.token
    axios.get(process.env.VUE_APP_URL + "users/me")
        .then(response => {
          this.user = response.data;
          document.querySelector('#chatroom').style.background = response.data.background_color;
          document.querySelector('#chatroom').style.color = response.data.text_color;
          this.getfriendlist();
        })
        .catch(e => {
          console.log(e)
        });
  },
  mounted: function (){
    this.socket.on('login', userId => {
      this.userConnectedList.push(String(userId));
    });
    this.socket.on('userDisconnect', userId => {
      this.userConnectedList.pop(String(userId));
    });
    this.socket.on('msg', msg => {
      if (msg.userTo == this.userId) {
        if (this.messageList[String(msg.userFrom)] == undefined) {
          this.messageList[String(msg.userFrom)] = [];
        }
        this.messageList[String(msg.userFrom)].push({fromMe : false, message: msg.message});
        console.log('Test du mount');
        console.log(this.messageList);
      }
      this.$forceUpdate();
    });
  },
  beforeDestroy: function () {
    this.socket.close();
  },
  methods: {
    deconexion() {
      localStorage.token = undefined
      this.$router.push({name: 'Login'})
    },
    updateUser() {
      if (this.checkForm()) {
        axios.defaults.headers.common['Authorization'] = this.token
        axios.put(process.env.VUE_APP_URL + "users/me", this.user,
        ).then(response => {
          this.user = response.data;
          document.querySelector('#chatroom').style.background = response.data.background_color
          document.querySelector('#chatroom').style.color = response.data.text_color
          this.$notify({
            title: 'Modifications sauvegardées',
            type: 'success'
          });
        }).catch(e => {
          console.log(e)
          this.loading = false
          this.$notify.error({
            title: 'Erreur',
            message: 'erreur du serveur'
          });
        })
      }
    },
    banUsersById(reportUserId) {
        axios.defaults.headers.common['Authorization'] = this.token
        axios.put(process.env.VUE_APP_URL + "/users/banUsersById", {id: reportUserId},
        ).then(() => {
          this.$notify({
            title: 'Utilisateur banni',
            type: 'success'
          });
        }).catch(e => {
          console.log(e)
          this.loading = false
          this.$notify.error({
            title: 'Erreur',
            message: 'erreur du serveur'
          });
        })
    },
    checkForm() {
      const h = this.$createElement;
      let valide = true
      if (this.user.username.length < 3) {
        this.$message({
          message: h('p', null, [
            h('span', null, 'Le pseudo doit contenir 3 lettres ou plus'),
            h('i', {style: 'color: teal'})
          ])
        });
        valide = false
      }
      if (!(this.user.sexe == "Homme" || this.user.sexe == "Femme" || this.user.sexe == null)) {
        this.$message({
          message: h('p', null, [
            h('span', null, 'Sexe invalide'),
            h('i', {style: 'color: teal'})
          ])
        });
        valide = false
      }
      return valide
    },
    searchUser: function (queryUser, cb) {
      this.userList = [];
      axios.defaults.headers.common['Authorization'] = this.token;
      axios.post(process.env.VUE_APP_URL + "users/find", {username: queryUser})
          .then(response => {
            response.data.forEach(user => this.userList.push({value: user.username, id: user.id, email: user.email})
            )
          })

      cb(this.userList)
    },
    selectUser: function (item) {
      this.userSelect = item;
      this.dialogVisible = true;
      console.log(this.userSelect)
    },
    sendFriendRequest: function () {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.post(process.env.VUE_APP_URL + "userFriend/addFriend", {userFriendId: this.userSelect.id}
      ).then(() => {
        this.$notify({
          title: 'Demande envoyé',
          type: 'success'
        });
      }).catch(()=> {
        this.$notify({
          title: 'Demande déjà envoyé',
          type: 'error'
        });
      });
    },
    reportFriend: function ()
    {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.post(process.env.VUE_APP_URL + "/report/reportFriend/", {userFriendId: this.userSelect.id}
      ).then(() => {
        this.$notify({
          title: 'signalé',
          type: 'success'
        });
      }).catch((e)=> {
        this.$notify({
          title: e.message,
          type: 'error'
        });
      });
    },
    getFriendRequestList: function () {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.get(process.env.VUE_APP_URL + "userFriend/requestList")
      .then(response => {
        this.friendRequestList = response.data;
        let copy = [];
        this.friendRequestList.forEach( function(item){
          axios.post(process.env.VUE_APP_URL + "users/findById", {id: item.userId})
              .then(response => {
                item.username = response.data[0]["username"];
                copy.push(item);
              })
        });
        this.friendRequestList = copy;
        this.friendRequestVisible = true;
      });
    },
    getReportedList: function () {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.get(process.env.VUE_APP_URL + "report/getReportList")
      .then(response => {
        this.reportList = response.data;
        let copy = [];
        this.reportList.forEach( function(item){
          axios.post(process.env.VUE_APP_URL + "users/findById", {id: item.id})
              .then(response => {
                item.username = response.data[0]["username"];
                copy.push(item);
              })
        });
        this.reportList = copy;
        console.log(this.reportList)
        this.reportListVisible = true;
      });
    },
    acceptRequest: function (requestId) {
      console.log(requestId);
      axios.defaults.headers.common['Authorization'] = this.token
      axios.put(process.env.VUE_APP_URL + "userFriend/accept", {requestId: requestId},
      ).then(response => {
        console.log(response)
        this.$notify({
          title: 'Demande acceptée',
          type: 'success'
        });
        this.getFriendRequestList();
      }).catch(e => {
        console.log(e)
        this.loading = false
        this.$notify.error({
          title: 'Erreur',
          message: 'erreur du serveur'
        });
      })
    },
    declineRequest: function (requestId) {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.put(process.env.VUE_APP_URL + "userFriend/decline", {requestId: requestId},
      ).then(response => {
        console.log(response)
        this.$notify({
          title: 'Demande refusée',
          type: 'success'
        });
        this.getFriendRequestList();
      }).catch(e => {
        console.log(e)
        this.loading = false
        this.$notify.error({
          title: 'Erreur',
          message: 'erreur du serveur'
        });
      })
    },
    getfriendlist: function () {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.get(process.env.VUE_APP_URL + "userFriend/friendlist")
          .then(response => {
            this.friendList = response.data
            this.friendListFilter = response.data
          });
    },
    filterFunction: function ()
    {
      this.friendListFilter = this.friendList.filter(friend =>friend.username.includes(this.friendFilter))
    },
    deleteUserFriend: function (userFriendId)
    {
      axios.defaults.headers.common['Authorization'] = this.token
      axios.delete(process.env.VUE_APP_URL + "userFriend/"+userFriendId)
          .then(()=>{
            this.$notify({
              title: 'Ami supprimé',
              type: 'success'
            });

            this.friendList = this.friendList.filter(userFriend=>userFriend.id !== userFriendId);

            this.friendListFilter = this.friendListFilter.filter(userFriend=>userFriend.id !== userFriendId);


          }).catch(()=> {
                this.$notify.error({
                  title: 'Erreur',
                  message: 'erreur du serveur'
                });
            })

    },
    sendMessage: function (friendUserId,message){
      this.socket.emit('msg', {userFrom : this.userId, userTo: friendUserId, message: message});
      if(this.messageList[friendUserId] == undefined){
        this.messageList[String(friendUserId)] = [];
      }
      this.messageList[String(friendUserId)].push({fromMe : true, message: message});

      this.updateChat();
    },
    startChat: function (friend) {
      if (!this.userConnectedList.includes(String(friend.id))) {
        this.$notify({
            title: 'Votre ami n\'est pas connecté',
            type: 'error'
          });
      } else{
        this.chatId = friend.id;
        this.chatName = friend.username;
      }
    },
    verifyMessage: function() {
      if (this.chat.message.length < 1 || this.chat.message.length > 200) {
           this.$notify({
            title: 'Vous ne pouvez un message contenant 1 et 200 caractères',
            type: 'error'
          });
      } else {
        this.sendMessage(this.chatId, this.chat.message);
        document.getElementById("sendMsg").value = "";
      }
    },
    updateChat: function() {
      document.getElementById("sendMsg").value = "";
      this.chat.message = "";

      this.$nextTick(function () {
        var messageBox = document.getElementById('chatdisplay');
        messageBox.scrollTop = messageBox.scrollHeight;
      });

    },
    getGifs: function (){
      let apiKey = "dc6zaTOxFJmzC";
      let searchEndPoint = "https://api.giphy.com/v1/gifs/search?";
      let limit = 5;
      let url = `${searchEndPoint}&api_key=${apiKey}&q=${
          this.searchTerm
      }&limit=${limit}`;
      fetch(url)
          .then(response => {
            return response.json();
          })
          .then(json => {
            this.buildGifs(json);
          })
          .catch(err => console.log(err));
    },
    buildGifs: function (json) {
      this.gifs = json.data.map(gif => gif.id).map(gifId => {
        return `https://media.giphy.com/media/${gifId}/giphy.gif`;
      });
    },
    sendGif: function (gif){
      this.sendMessage(this.chatId, gif);
      this.gifDialogVisible= false;
      
    },
    checkMedia: function (message){
      return message.endsWith(".gif")
    },
  }
}

</script>

<style>
body {
  margin: unset;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
  text-align: left;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.hover-list-amis
{
  padding: 10%;
}
.hover-list-amis:hover
{
  border: #2c3e50 1px solid;
  border-radius: 10px;
}

.gif-container {
  margin-top: 1em;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 20em;
}
.displayedImg {
  max-width: 100%;
  max-height: 100%;
  border-radius: 25px;
}



</style>
