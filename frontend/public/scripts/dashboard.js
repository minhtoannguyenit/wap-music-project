
window.onload = function() {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  if (userId === undefined || token === undefined) {
    window.location.href = "/frontend/views/index.html";
  }
  userLogout();
  searchSong();
  displayDashboard(userId, token);
}

async function displayDashboard(userId, token) {
  await getDashboard();
  await getUserPlaylist(userId, token);
}

async function getDashboard() {
  fetch("http://localhost:3000/songs")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.data);
      if (data.status === false) {
        return;
      }
      let html = "";
      data.data.forEach((item) => {
        html += `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.publishedDate}</td>
          <td><button id="add-btn-${item.id}" class="add-btn" onclick="addPlaylist(${item.id});"><i class="fa-solid fa-plus"></i></button></td>
      </tr>`;
      });
      document.getElementById("music-playlist").innerHTML = html;
    });
}

async function getUserPlaylist(userId, token) {
  console.log(userId, token);
  fetch(`http://localhost:3000/users/${userId}/playlists`, {
    method: "GET",
    headers: {
      "Content-type": `application/json`,
      Token: token,
    },
  }).then(response => response.json())
  .then(data => {
    if (data.status === false) {
      window.location.href = '/frontend/views/index.html';
    }
    console.log(data.data);
    let html = '';
    let songs = [];
    data.data.forEach(item => {
      html += `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.publishedDate}</td>
          <td>
            <div class="quantity">
              <button class="remove-btn" onclick="removePlaylist(${item.id});"><i class="fa-solid fa-minus"></i></button>
              <button class="play-btn" onclick="changeSong(${item.id});"><i class="fa-solid fa-play"></i></button>
            </div>
          </td>
      </tr>`;
      const addBtn = document.getElementById(`add-btn-${item.id}`);
      if (addBtn) {
        addBtn.className = 'add-btn disabledBtn';
      }
      songs.push(item);
    });
    // reload table body
    mediaPlayer.setSongs(songs);
    document.getElementById('user-playlist').innerHTML = html;
    });
}

function userLogout() {
  const userId = sessionStorage.getItem("userId");
  document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    fetch(`http://localhost:3000/users/${userId}/logout`, {
      method: "POST",
      headers: {
        "Content-type": `application/json`,
        Token: sessionStorage.getItem("token"),
      },
    });
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    window.location.href = "/frontend/views/index.html";
    mediaPlayer.setSongs([]);
  });
}

function searchSong() {
  document.getElementById("search").addEventListener("keyup", function (e) {
    e.preventDefault();
    const keyword = document.getElementById("search").value;
    fetch(`http://localhost:3000/songs?keyword=${keyword}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        if (data.status === false) {
          return;
        }
        let html = "";
        data.data.forEach((item) => {
          html += `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.publishedDate}</td>
          <td><button id="add-btn-${item.id}" class="add-btn" onclick="addPlaylist(${item.id});"><i class="fa-solid fa-plus"></i></button></td>
        </tr>`;
        });
        document.getElementById("music-playlist").innerHTML = html;
      });
  });
}

function addPlaylist(songId) {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  fetch(`http://localhost:3000/users/${userId}/playlists/${songId}`, {
    method: "POST",
    headers: {
      "Content-type": `application/json`,
      Token: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.data);
      let html = "";
      let songs = [];
      data.data.forEach((item) => {
        html += `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.publishedDate}</td>
          <td>
            <div class="quantity">
              <button class="remove-btn" onclick="removePlaylist(${item.id});"><i class="fa-solid fa-minus"></i></button>
              <button class="play-btn" onclick="changeSong(${item.id});"><i class="fa-solid fa-play"></i></button>
            </div>
          </td>
      </tr>`;
      const addBtn = document.getElementById(`add-btn-${item.id}`);
      if (addBtn) {
        addBtn.className = 'add-btn disabledBtn';
      }
      songs.push(item);
    });
    // reload table body
    mediaPlayer.setSongs(songs);
    document.getElementById('user-playlist').innerHTML = html;
    });
}

function removePlaylist(songId) {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  fetch(`http://localhost:3000/users/${userId}/playlists/${songId}`, {
    method: "DELETE",
    headers: {
      "Content-type": `application/json`,
      Token: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.data);
      let html = "";
      let songs = [];
      data.data.forEach((item) => {
        html += `<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.publishedDate}</td>
        <td>
          <div class="quantity">
            <button class="remove-btn" onclick="removePlaylist(${item.id});"><i class="fa-solid fa-minus"></i></button>
            <button class="play-btn" onclick="changeSong(${item.id});"><i class="fa-solid fa-play"></i></button>
          </div>
        </td>
      </tr>`;
        songs.push(item);
      });
      mediaPlayer.setSongs(songs);
      // reload table body
      document.getElementById("user-playlist").innerHTML = html;
    });
}
