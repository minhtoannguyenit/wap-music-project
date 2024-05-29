const users = require("../data/users.json");
const moment = require('moment');
const playList = require("../data/playlists.json");

module.exports = class User {
  constructor(name, email, password, playlists = []) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = null;
    this.playlists = playlists;
  }

  static getAll() {
    return users;
  }

  static login({email, password}) {
    const index = users.findIndex((user) => user.email === email && user.password === password);
    if (index > -1) {
      const token = Math.random().toString(36) + moment().format('*YYYY-MM-DDThh:mm:ss.ms');
      users[index].token = token;
      return users[index];
    }
    throw new Error('Your email or password is incorrect');
  }

  static logout(userId, {token}) {
    const index = users.findIndex((user) => user.id === userId && token === user.token);
    if (index > -1) {
      users[index].token = null;
      return true;
    }
    throw new Error('User not found');
  }

  static playlists(userId, token) {
    const user = users.find((user) => user.id === userId && token === user.token);
    if (user) {
      const list = [];
      user.playlists.forEach((playlist) => {
        list.push(playList.find((p) => p.id === playlist));
      });
      return list;
    }
    throw new Error('User not found');
  }

  static addPlaylist(userId, songId, token) {
    const userIndex = users.findIndex((user) => user.id === userId && token === user.token);
    if (userIndex > -1) {
      const songIndex = users[userIndex].playlists.findIndex((song) => song === songId);
      if (songIndex > -1) {
        throw new Error('Song already in the playlist');
      } else {
        users[userIndex].playlists.push(songId);
      }
      const list = [];
      users[userIndex].playlists.forEach((playlist) => {
        list.push(playList.find((p) => p.id === playlist));
      });
      return list;
    }
    throw new Error('User not found');
  }

  static removePlaylist(userId, songId, token) {
    const userIndex = users.findIndex((user) => user.id === userId && token === user.token);
    if (userIndex > -1) {
      const songIndex = users[userIndex].playlists.findIndex((song) => song === songId);
      if (songIndex > -1) {
        users[userIndex].playlists.splice(songIndex, 1);
        const list = [];
        users[userIndex].playlists.forEach((playlist) => {
          list.push(playList.find((p) => p.id === playlist));
        });
        return list;
      }
      throw new Error('Song not found');
    }
    throw new Error('User not found');
  } 
}