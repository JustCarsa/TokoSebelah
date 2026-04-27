/* TOKOSEBELAH — auth.js (localStorage-based user system) */
var Auth = {
  _ukey: 'ts_users',
  _ckey: 'ts_uid',

  getUsers: function () {
    try { return JSON.parse(localStorage.getItem(this._ukey) || '[]'); } catch (e) { return []; }
  },
  saveUsers: function (u) { localStorage.setItem(this._ukey, JSON.stringify(u)); },

  getCurrentUser: function () {
    var uid = localStorage.getItem(this._ckey);
    if (!uid) return null;
    var us = this.getUsers();
    for (var i = 0; i < us.length; i++) { if (us[i].id === uid) return us[i]; }
    return null;
  },

  login: function (email, pass) {
    var us = this.getUsers();
    for (var i = 0; i < us.length; i++) {
      if (us[i].email === email && us[i].password === pass) {
        localStorage.setItem(this._ckey, us[i].id);
        return { ok: true, user: us[i] };
      }
    }
    return { ok: false, msg: 'Email atau password salah' };
  },

  register: function (data) {
    var us = this.getUsers();
    for (var i = 0; i < us.length; i++) {
      if (us[i].email === data.email) return { ok: false, msg: 'Email sudah terdaftar' };
    }
    var u = {
      id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      exp: 0,
      vouchers: [],
      createdAt: new Date().toISOString()
    };
    us.push(u);
    this.saveUsers(us);
    localStorage.setItem(this._ckey, u.id);
    return { ok: true, user: u };
  },

  logout: function () { localStorage.removeItem(this._ckey); },

  updateUser: function (updates) {
    var us = this.getUsers();
    var cur = this.getCurrentUser();
    if (!cur) return null;
    for (var i = 0; i < us.length; i++) {
      if (us[i].id === cur.id) {
        for (var k in updates) { if (Object.prototype.hasOwnProperty.call(updates, k)) us[i][k] = updates[k]; }
        this.saveUsers(us);
        return us[i];
      }
    }
    return null;
  },

  addExp: function (amount) {
    var u = this.getCurrentUser();
    if (!u) return null;
    var threshold = 1000;
    var prev = Math.floor((u.exp || 0) / threshold);
    var newExp = (u.exp || 0) + amount;
    var earned = Math.floor(newExp / threshold) - prev;
    var vouchers = (u.vouchers || []).slice();
    for (var i = 0; i < earned; i++) {
      vouchers.push({
        code: 'TS' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        discount: 10,
        used: false,
        earnedAt: new Date().toISOString()
      });
    }
    return this.updateUser({ exp: newExp, vouchers: vouchers });
  },

  /* Render the top user bar into #ts-user-bar.
     Auto-detects whether we are in root (index.html) or id/ subfolder. */
  renderBar: function () {
    var el = document.getElementById('ts-user-bar');
    if (!el) return;

    /* Detect location: pages inside /id/ use relative paths without prefix,
       root index.html needs the id/ prefix. */
    var inIdFolder = window.location.pathname.indexOf('/id/') !== -1 ||
                     window.location.pathname.replace(/.*\//, '').indexOf('.html') !== -1 &&
                     window.location.pathname.indexOf('/id/') !== -1;

    /* Simpler: just check if the current file is index.html at root */
    var fname = window.location.pathname.split('/').pop();
    var isRoot = (fname === '' || fname === 'index.html') &&
                 window.location.pathname.indexOf('/id/') === -1;

    var base    = isRoot ? 'id/' : '';
    var homeUrl = isRoot ? 'index.html' : '../index.html';

    var u = this.getCurrentUser();
    var html;
    if (u) {
      var av = u.name.charAt(0).toUpperCase();
      var activeVouchers = (u.vouchers || []).filter(function (v) { return !v.used; }).length;
      html =
        '<a href="' + homeUrl + '" class="ts-bar-home"><i class="fas fa-home"></i> Home</a>' +
        '<div class="ts-bar-right">' +
          '<a href="' + base + 'rewards.html" class="ts-bar-link" title="EXP & Rewards">' +
            '<i class="fas fa-star"></i> ' + (u.exp || 0) + ' EXP' +
            (activeVouchers ? '<span class="ts-bar-badge">' + activeVouchers + '</span>' : '') +
          '</a>' +
          '<a href="' + base + 'profile.html" class="ts-bar-link ts-bar-user">' +
            '<span class="ts-avatar">' + av + '</span>' + u.name +
          '</a>' +
        '</div>';
    } else {
      html =
        '<a href="' + homeUrl + '" class="ts-bar-home"><i class="fas fa-home"></i> Home</a>' +
        '<div class="ts-bar-right">' +
          '<a href="' + base + 'login.html" class="ts-bar-link ts-bar-login">' +
            '<i class="fas fa-sign-in-alt"></i> Login / Daftar' +
          '</a>' +
        '</div>';
    }
    el.innerHTML = html;
  }
};

/* Seed default accounts on first load */
(function () {
  var seeds = [
    { id: 'seed_user',  name: 'User',  email: '111', password: '111', phone: '', role: 'user',  exp: 0, vouchers: [], createdAt: new Date().toISOString() },
    { id: 'seed_admin', name: 'Admin', email: '222', password: '222', phone: '', role: 'admin', exp: 0, vouchers: [], createdAt: new Date().toISOString() },

    { id: 'dummy_1', name: 'Rizky Pratama',  email: 'rizky@mail.com',  password: 'rizky123',  phone: '081234567890', role: 'user', exp: 2450,
      vouchers: [
        { code: 'TS1A2B3C', discount: 10, used: false, earnedAt: '2026-03-15T10:00:00.000Z' },
        { code: 'TS4D5E6F', discount: 10, used: true,  earnedAt: '2026-02-28T10:00:00.000Z' }
      ], createdAt: '2026-01-10T08:00:00.000Z' },

    { id: 'dummy_2', name: 'Sinta Dewi',     email: 'sinta@mail.com',  password: 'sinta123',  phone: '087654321098', role: 'user', exp: 800,
      vouchers: [], createdAt: '2026-02-01T09:30:00.000Z' },

    { id: 'dummy_3', name: 'Bagus Setiawan', email: 'bagus@mail.com',  password: 'bagus123',  phone: '', role: 'user', exp: 5100,
      vouchers: [
        { code: 'TS7G8H9I', discount: 10, used: false, earnedAt: '2026-03-01T10:00:00.000Z' },
        { code: 'TSJK0LMN', discount: 10, used: false, earnedAt: '2026-03-15T10:00:00.000Z' },
        { code: 'TSOP1QRS', discount: 10, used: true,  earnedAt: '2026-01-20T10:00:00.000Z' }
      ], createdAt: '2026-01-05T07:00:00.000Z' },

    { id: 'dummy_4', name: 'Maya Kusuma',    email: 'maya@mail.com',   password: 'maya123',   phone: '082345678901', role: 'user', exp: 300,
      vouchers: [], createdAt: '2026-03-20T14:00:00.000Z' },

    { id: 'dummy_5', name: 'Andi Wijaya',    email: 'andi@mail.com',   password: 'andi123',   phone: '089876543210', role: 'user', exp: 1200,
      vouchers: [
        { code: 'TSTUVWXY', discount: 10, used: false, earnedAt: '2026-02-10T10:00:00.000Z' }
      ], createdAt: '2026-01-25T11:00:00.000Z' },

    { id: 'dummy_6', name: 'Dewi Lestari',   email: 'dewi@mail.com',   password: 'dewi123',   phone: '083456789012', role: 'user', exp: 6300,
      vouchers: [
        { code: 'TSABC123', discount: 10, used: false, earnedAt: '2026-02-05T10:00:00.000Z' },
        { code: 'TSDEF456', discount: 10, used: false, earnedAt: '2026-03-10T10:00:00.000Z' },
        { code: 'TSGHI789', discount: 10, used: true,  earnedAt: '2026-01-15T10:00:00.000Z' }
      ], createdAt: '2025-12-20T06:00:00.000Z' }
  ];
  var existing = Auth.getUsers();
  var changed = false;
  seeds.forEach(function (s) {
    var found = false;
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].id === s.id) { found = true; break; }
    }
    if (!found) { existing.push(s); changed = true; }
  });
  if (changed) Auth.saveUsers(existing);
})();

document.addEventListener('DOMContentLoaded', function () { Auth.renderBar(); });
