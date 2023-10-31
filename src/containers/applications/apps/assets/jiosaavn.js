"use babel";
import axios from "axios";

const search_url = "/search?query=";
const song_url = "/song?pids=";
const album_url = "/album?id=";

const { floor, random } = Math;

class JioSaavn {
  constructor() {
    // this.ignorewhitespace = true;
    this.defaultSongs = [
      "Szz0RZFb",
      "cgM-pRO9",
      "mPk9X_H_",
      "R2GnvPCo",
      "eR_xs61E",
      "ZGifVkqI",
      "TEG8c_EJ",
      "gy17KLcd",
      "rkpNHSo1",
      "o8jkpKcg",
      "tUjXvoKS",
      "Kv6rGi1G",
    ];

    this.dfdata = [
      {
        id: "Szz0RZFb", //"Szz0RZFb",
        album: "Raincoat",
        albumArt:
          "https://c.saavncdn.com/432/Raincoat-Hindi-2004-20210125130707-150x150.jpg",
        name: "Piya Tora Kaisa Abhiman",
        artist: "Shubha Mudgal",
        duration: 297,
        src: "https://aac.saavncdn.com/432/545714e974b6138352be162e6f13c4f5_160.mp4",
      },
    ];

    this.instance = axios.create({
      baseURL: "https://dev.saavn.me",
    });
  }

  fetch(url, config = {}) {
    return new Promise((resolve, reject) => {
      this.instance(url, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject({
            error: "axios",
            data: error,
          });
        });
    });
  }

  fetchSong(pids) {
    if (typeof pids != "object") pids = [pids];
    return new Promise((resolve, reject) => {
      this.fetch(song_url + pids.join(","))
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => reject(err));
    });
  }

  fetchSongs(pids) {
    if (typeof pids != "object") pids = [pids];
    return new Promise((resolve, reject) => {
      this.fetch(song_url + pids.join(","))
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  mapToSong(obj) {
    return {
      id: obj.song_id,
      album: obj.album_name,
      albumArt: obj.song_image,
      name: obj.song_name,
      artist: obj.song_artist,
      duration: obj.song_duration,
      src:
        obj.download_links && (obj.download_links[1] || obj.download_links[0]),
    };
  }

  getAlbum(id) {
    return new Promise((resolve, reject) => {
      this.fetch(album_url + id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  searchQuery(query) {
    if (query.length < 1) return;
    return new Promise((resolve, reject) => {
      this.fetch(search_url + query)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getDefault() {
    // console.log("Okay");
    return new Promise((resolve) => {
      this.fetchSong(
        this.defaultSongs[floor(random() * this.defaultSongs.length)],
      )
        .then((res) => {
          resolve([this.mapToSong(res)]);
        })
        .catch((err) => {
          console.log(err);
          resolve(this.dfdata);
        });
    });
  }

  formatTime(sec) {
    if (!sec) return "0:00";
    var res = floor(sec / 60);
    res += ":";
    sec %= 60;
    if (sec < 10) res += "0";
    res += sec;

    return res;
  }

  formatPeriod(sec) {
    if (!sec) return "";
    var res = "",
      h = floor(sec / 3600);
    if (h != 0) res += h + " hr ";
    sec = sec % 3600;
    res += floor(sec / 60) + " min ";
    sec %= 60;
    res += sec + " sec";
    return res;
  }

  shuffle(arr) {
    var currentIndex = arr.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = floor(random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }
    return arr;
  }

  mixQueue(n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    var brr = this.shuffle([...arr]);
    for (var i = 0; i < n; i++) arr[brr[i]] = brr[(i + 1) % n];

    return arr;
  }

  sliceArr(arr, i) {
    return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
  }
}

export default new JioSaavn();
