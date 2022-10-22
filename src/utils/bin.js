export class Item {
  constructor({ type, name, info, data, host }) {
    this.type = type || "folder";
    this.name = name;
    this.info = info || {};
    this.info.icon = this.info.icon || this.type;
    this.data = data;
    this.host = host;
    this.id = this.gene();
  }

  gene() {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    this.lookup[id] = item;
  }

  getId(id) {
    return this.lookup[id];
  }

  getPath(id) {
    var cpath = "";
    var curr = this.getId(id);

    while (curr) {
      cpath = curr.name + "\\" + cpath;
      curr = curr.host;
    }

    return cpath.count("\\") > 1 ? cpath.strip("\\") : cpath;
  }

  parsePath(cpath) {
    if (cpath.includes("%")) {
      return this.special[cpath.trim()];
    }

    cpath = cpath
      .split("\\")
      .filter((x) => x !== "")
      .map((x) => x.trim().toLowerCase());
    if (cpath.length === 0) return null;

    var pid = null,
      curr = null;
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].name.toLowerCase() === cpath[0]) {
        curr = this.tree[i];
        break;
      }
    }

    if (curr) {
      var i = 1,
        l = cpath.length;
      while (curr.type === "folder" && i < l) {
        var res = true;
        for (var j = 0; j < curr.data.length; j++) {
          if (curr.data[j].name.toLowerCase() === cpath[i]) {
            i += 1;
            if (curr.data[j].type === "folder") {
              res = false;
              curr = curr.data[j];
            }

            break;
          }
        }

        if (res) break;
      }

      if (i === l) pid = curr.id;
    }

    return pid;
  }

  parseFolder(data, name, host = null) {
    var item = new Item({
      type: data.type,
      name: data.name || name,
      info: data.info,
      host: host,
    });

    this.setId(item.id, item);

    if (data.info && data.info.spid) {
      this.setSpecial(data.info.spid, item.id);
    }

    if (item.type !== "folder") {
      item.setData(data.data);
    } else {
      var fdata = [];
      if (data.data) {
        for (const key of Object.keys(data.data)) {
          fdata.push(this.parseFolder(data.data[key], key, item));
        }
      }

      item.setData(fdata);
    }

    return item;
  }

  parse(data) {
    var drives = Object.keys(data);
    var tree = [];
    for (var i = 0; i < drives.length; i++) {
      tree.push(this.parseFolder(data[drives[i]]));
    }

    this.tree = tree;
  }
}
