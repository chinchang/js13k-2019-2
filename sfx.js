import { random } from "./utils";

(function() {
  function J() {
    this.B = function(e) {
      for (var f = 0; 24 > f; f++)
        this[String.fromCharCode(97 + f)] = e[f] || 0;
      0.01 > this.c && (this.c = 0.01);
      e = this.b + this.c + this.e;
      0.18 > e && ((e = 0.18 / e), (this.b *= e), (this.c *= e), (this.e *= e));
    };
  }
  var W = new (function() {
    this.A = new J();
    var e, f, d, g, l, z, K, L, M, A, m, N;
    this.reset = function() {
      var c = this.A;
      g = 100 / (c.f * c.f + 0.001);
      l = 100 / (c.g * c.g + 0.001);
      z = 1 - 0.01 * c.h * c.h * c.h;
      K = 1e-6 * -c.i * c.i * c.i;
      c.a || ((m = 0.5 - c.n / 2), (N = 5e-5 * -c.o));
      L = 0 < c.l ? 1 - 0.9 * c.l * c.l : 1 + 10 * c.l * c.l;
      M = 0;
      A = 1 == c.m ? 0 : 2e4 * (1 - c.m) * (1 - c.m) + 32;
    };
    this.D = function() {
      this.reset();
      var c = this.A;
      e = 1e5 * c.b * c.b;
      f = 1e5 * c.c * c.c;
      d = 1e5 * c.e * c.e + 10;
      return (e + f + d) | 0;
    };
    this.C = function(c, O) {
      var a = this.A,
        P = 1 != a.s || a.v,
        r = 0.1 * a.v * a.v,
        Q = 1 + 3e-4 * a.w,
        n = 0.1 * a.s * a.s * a.s,
        X = 1 + 1e-4 * a.t,
        Y = 1 != a.s,
        Z = a.x * a.x,
        $ = a.g,
        R = a.q || a.r,
        aa = 0.2 * a.r * a.r * a.r,
        D = a.q * a.q * (0 > a.q ? -1020 : 1020),
        S = a.p ? ((2e4 * (1 - a.p) * (1 - a.p)) | 0) + 32 : 0,
        ba = a.d,
        T = a.j / 2,
        ca = 0.01 * a.k * a.k,
        E = a.a,
        F = e,
        da = 1 / e,
        ea = 1 / f,
        fa = 1 / d,
        a = (5 / (1 + 20 * a.u * a.u)) * (0.01 + n);
      0.8 < a && (a = 0.8);
      for (
        var a = 1 - a,
          G = !1,
          U = 0,
          v = 0,
          w = 0,
          B = 0,
          t = 0,
          x,
          u = 0,
          h,
          p = 0,
          s,
          H = 0,
          b,
          V = 0,
          q,
          I = 0,
          C = Array(1024),
          y = Array(32),
          k = C.length;
        k--;

      )
        C[k] = 0;
      for (k = y.length; k--; ) y[k] = 2 * Math.random() - 1;
      for (k = 0; k < O; k++) {
        if (G) return k;
        S && ++V >= S && ((V = 0), this.reset());
        A && ++M >= A && ((A = 0), (g *= L));
        z += K;
        g *= z;
        g > l && ((g = l), 0 < $ && (G = !0));
        h = g;
        0 < T && ((I += ca), (h *= 1 + Math.sin(I) * T));
        h |= 0;
        8 > h && (h = 8);
        E || ((m += N), 0 > m ? (m = 0) : 0.5 < m && (m = 0.5));
        if (++v > F)
          switch (((v = 0), ++U)) {
            case 1:
              F = f;
              break;
            case 2:
              F = d;
          }
        switch (U) {
          case 0:
            w = v * da;
            break;
          case 1:
            w = 1 + 2 * (1 - v * ea) * ba;
            break;
          case 2:
            w = 1 - v * fa;
            break;
          case 3:
            (w = 0), (G = !0);
        }
        R &&
          ((D += aa), (s = D | 0), 0 > s ? (s = -s) : 1023 < s && (s = 1023));
        P && Q && ((r *= Q), 1e-5 > r ? (r = 1e-5) : 0.1 < r && (r = 0.1));
        q = 0;
        for (var ga = 8; ga--; ) {
          p++;
          if (p >= h && ((p %= h), 3 == E))
            for (x = y.length; x--; ) y[x] = 2 * Math.random() - 1;
          switch (E) {
            case 0:
              b = p / h < m ? 0.5 : -0.5;
              break;
            case 1:
              b = 1 - 2 * (p / h);
              break;
            case 2:
              b = p / h;
              b = 0.5 < b ? 6.28318531 * (b - 1) : 6.28318531 * b;
              b =
                0 > b
                  ? 1.27323954 * b + 0.405284735 * b * b
                  : 1.27323954 * b - 0.405284735 * b * b;
              b = 0 > b ? 0.225 * (b * -b - b) + b : 0.225 * (b * b - b) + b;
              break;
            case 3:
              b = y[Math.abs(((32 * p) / h) | 0)];
          }
          P &&
            ((x = u),
            (n *= X),
            0 > n ? (n = 0) : 0.1 < n && (n = 0.1),
            Y ? ((t += (b - u) * n), (t *= a)) : ((u = b), (t = 0)),
            (u += t),
            (B += u - x),
            (b = B *= 1 - r));
          R && ((C[H % 1024] = b), (b += C[(H - s + 1024) % 1024]), H++);
          q += b;
        }
        q = 0.125 * q * w * Z;
        c[k] = 1 <= q ? 32767 : -1 >= q ? -32768 : (32767 * q) | 0;
      }
      return O;
    };
  })();
  window.jsfxr = function(e) {
    W.A.B(e);
    var f = W.D();
    e = new Uint8Array(4 * (((f + 1) / 2) | 0) + 44);
    var f = 2 * W.C(new Uint16Array(e.buffer, 44), f),
      d = new Uint32Array(e.buffer, 0, 44);
    d[0] = 1179011410;
    d[1] = f + 36;
    d[2] = 1163280727;
    d[3] = 544501094;
    d[4] = 16;
    d[5] = 65537;
    d[6] = 44100;
    d[7] = 88200;
    d[8] = 1048578;
    d[9] = 1635017060;
    d[10] = f;
    for (var f = f + 44, d = 0, g = "data:audio/wav;base64,"; d < f; d += 3)
      var l = (e[d] << 16) | (e[d + 1] << 8) | e[d + 2],
        g =
          g +
          ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
            l >> 18
          ] +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
              (l >> 12) & 63
            ] +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
              (l >> 6) & 63
            ] +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
              l & 63
            ]);
    d -= f;
    return g.slice(0, g.length - d) + "==".slice(0, d);
  };
})();

const sounds = {};
function addSound(sid, list) {
  sounds[sid] = [];
  list.forEach(function(s) {
    var a = new Audio();
    a.src = jsfxr(s);
    sounds[sid].push(a);
  });
}

export function playSound(sid) {
  sounds[sid] && sounds[sid][random(0, sounds[sid].length - 1)].play();
}

addSound("laser", [
  [
    0,
    0,
    0.20186369123006712,
    0.08864788869394417,
    0.3533138312310672,
    0.730741378990208,
    0.2,
    -0.18340614838729788,
    0,
    0,
    0,
    0,
    0,
    0.13312363811900763,
    0.13711016008646912,
    0,
    0,
    0,
    1,
    0,
    0,
    0.1086867241891986,
    0,
    0.5
  ],
  [
    0,
    0,
    0.2732218187386066,
    0.09292699553578221,
    0.03300790675047618,
    0.764744932473655,
    0.36691959834015275,
    -0.23915212474273018,
    0,
    0,
    0,
    0,
    0,
    0.20399771679086742,
    0.0022463616577739656,
    0,
    0,
    0,
    1,
    0,
    0,
    0.0673932643123878,
    0,
    0.5
  ]
]);

addSound("explosion", [
  [
    3,
    ,
    0.3417,
    0.4126,
    0.2799,
    0.0141,
    ,
    0.1053,
    ,
    ,
    ,
    0.239,
    0.612,
    ,
    ,
    ,
    0.4363,
    -0.2564,
    1,
    ,
    ,
    ,
    ,
    0.5
  ],
  [
    3,
    0,
    0.29543862264632753,
    0.34516609461402187,
    0.42899737981196207,
    0.33660416688363043,
    0,
    -0.2690700410417636,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    -0.21134041848609875,
    -0.2316907481419962,
    1,
    0,
    0,
    0,
    0,
    0.5
  ],
  [
    3,
    0,
    0.25248370901712475,
    0.6325791872481547,
    0.09061954133800243,
    0.10337277112428506,
    0,
    -0.2985780353874932,
    0,
    0,
    0,
    -0.7302524884341515,
    0.6027070326674928,
    0,
    0,
    0,
    0.0061548340192078,
    -0.02154246942121234,
    1,
    0,
    0,
    0,
    0,
    0.5
  ]
]);

addSound("hit", [
  [
    3,
    ,
    0.2403,
    0.6344,
    0.2291,
    0.1147,
    ,
    -0.0681,
    ,
    ,
    ,
    -0.7594,
    0.7851,
    ,
    ,
    0.5514,
    ,
    ,
    1,
    ,
    ,
    ,
    ,
    0.5
  ],
  [
    3,
    0.0341,
    0.1945,
    0.5512,
    0.1999,
    0.1522,
    0.0221,
    -0.0542,
    -0.0411,
    0.0473,
    ,
    -0.7584,
    0.7943,
    ,
    -0.0028,
    0.5986,
    ,
    -0.0285,
    1,
    0.0442,
    ,
    ,
    -0.0111,
    0.5
  ],
  [
    3,
    0.0715,
    0.2252,
    0.5179,
    0.1874,
    0.1626,
    0.0116,
    -0.0217,
    -0.0186,
    0.0577,
    0.0614,
    -0.8043,
    0.827,
    ,
    -0.0028,
    0.6757,
    -0.0179,
    -0.0466,
    1,
    0.0064,
    ,
    ,
    0.0265,
    0.5
  ]
]);

addSound("winExplosion", [
  [
    3,
    0,
    0.37402130250153964,
    0.37755261732779943,
    0.20860049840982053,
    0.2615879349464807,
    0,
    -0.3452769016527329,
    0,
    0,
    0,
    -0.7349481878855222,
    0.8091127974010215,
    0,
    0,
    0,
    -0.059400677951952086,
    -0.19253254157222524,
    1,
    0,
    0,
    0,
    0,
    0.5
  ]
]);

addSound("powerup", [
  [
    0,
    ,
    0.2102,
    ,
    0.321,
    0.375,
    ,
    0.4517,
    ,
    ,
    ,
    ,
    ,
    0.341,
    ,
    0.4955,
    ,
    ,
    1,
    ,
    ,
    ,
    ,
    0.5
  ]
]);

// WIN SOUND

const tm = window.TinyMusic || require("./TinyMusic.min.js");
// create a new Web Audio API context
var ac = new AudioContext();

// set the playback tempo (120 beats per minute)
var winningSoundTempo = 220;

// create a new sequence
var winSound1 = new tm.Sequence(ac, winningSoundTempo, [
  "F5 s",
  "- es",
  "F5 es",
  "F5 q",
  "- s",
  "G5 s",
  "- es",
  "G5 es",
  "G5 q",
  "- s",
  "A5 s",
  "- es",
  "A5 es",
  "A5 q"
]);
var winSound2 = new tm.Sequence(ac, winningSoundTempo, [
  "A5 s",
  "- es",
  "A5 es",
  "A5 q",
  "- s",
  "B5 s",
  "- es",
  "B5 es",
  "B5 q",
  "- s",
  "C#6 s",
  "- es",
  "C#6 es",
  "C#6 q"
]);

var winSound3 = new tm.Sequence(ac, winningSoundTempo, [
  "C6 s",
  "- es",
  "C6 es",
  "C6 q",
  "- s",
  "D6 s",
  "- es",
  "D6 es",
  "D6 q",
  "- s",
  "E6 s",
  "- es",
  "E6 es",
  "E6 q"
]);
winSound1.loop = false;
winSound2.loop = false;
winSound3.loop = false;
winSound1.waveType = "triangle";
winSound2.waveType = "triangle";
winSound3.waveType = "triangle";

export function playWinSound() {
  winSound1.play();
  winSound2.play();
  winSound3.play();
}
