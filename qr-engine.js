    (function (global) {
      "use strict";
      var ECC = { LOW: { ordinal: 0, formatBits: 1 }, MEDIUM: { ordinal: 1, formatBits: 0 }, QUARTILE: { ordinal: 2, formatBits: 3 }, HIGH: { ordinal: 3, formatBits: 2 } };
      var ECC_CODEWORDS_PER_BLOCK = [
        [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
        [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
      ];
      var NUM_ERROR_CORRECTION_BLOCKS = [
        [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
        [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
        [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
        [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
      ];
      var MIN_VERSION = 1, MAX_VERSION = 40, N1 = 3, N2 = 3, N3 = 40, N4 = 10;
      function getBit(x, i) { return ((x >>> i) & 1) !== 0; }
      function rsMul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 0xFF; }
      function rsDivisor(degree) { var r = []; for (var i = 0; i < degree - 1; i++)r.push(0); r.push(1); var root = 1; for (i = 0; i < degree; i++) { for (var j = 0; j < r.length; j++) { r[j] = rsMul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; } root = rsMul(root, 0x02); } return r; }
      function rsRemainder(data, divisor) { var r = divisor.map(function () { return 0; }); data.forEach(function (b) { var f = b ^ r.shift(); r.push(0); divisor.forEach(function (c, i) { r[i] ^= rsMul(c, f); }); }); return r; }
      function rawModules(v) { var r = (16 * v + 128) * v + 64; if (v >= 2) { var a = Math.floor(v / 7) + 2; r -= (25 * a - 10) * a - 55; if (v >= 7) r -= 36; } return r; }
      function dataCodewords(v, ecl) { return Math.floor(rawModules(v) / 8) - ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][v] * NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][v]; }
      function utf8(str) { var o = [], e = unescape(encodeURIComponent(str)); for (var i = 0; i < e.length; i++)o.push(e.charCodeAt(i)); return o; }

      function QrCode(version, ecl, dcw, mask) {
        this.version = version; this.ecl = ecl; this.size = version * 4 + 17; var s = this.size;
        this.modules = []; this.isFunction = [];
        for (var i = 0; i < s; i++) { var row = [], fr = []; for (var j = 0; j < s; j++) { row.push(false); fr.push(false); } this.modules.push(row); this.isFunction.push(fr); }
        this.drawFunctionPatterns();
        this.drawCodewords(this.addEccAndInterleave(dcw));
        if (mask === -1) { var min = Infinity; for (var m = 0; m < 8; m++) { this.applyMask(m); this.drawFormatBits(m); var p = this.getPenaltyScore(); if (p < min) { mask = m; min = p; } this.applyMask(m); } }
        this.mask = mask; this.applyMask(mask); this.drawFormatBits(mask); this.functionModules = this.isFunction; this.isFunction = null;
      }
      var P = QrCode.prototype;
      P.getModule = function (x, y) { return x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x]; };
      P.isFunctionModule = function (x, y) { return this.functionModules[y][x]; };
      P.setF = function (x, y, d) { this.modules[y][x] = d; this.isFunction[y][x] = true; };
      P.drawFunctionPatterns = function () {
        var s = this.size, i; for (i = 0; i < s; i++) { this.setF(6, i, i % 2 === 0); this.setF(i, 6, i % 2 === 0); }
        this.finder(3, 3); this.finder(s - 4, 3); this.finder(3, s - 4);
        var ap = this.alignPos(), n = ap.length;
        for (i = 0; i < n; i++)for (var j = 0; j < n; j++)if (!(i === 0 && j === 0) && !(i === 0 && j === n - 1) && !(i === n - 1 && j === 0)) this.align(ap[i], ap[j]);
        this.drawFormatBits(0); this.drawVersion();
      };
      P.finder = function (x, y) { for (var dy = -4; dy <= 4; dy++)for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy; if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setF(xx, yy, d !== 2 && d !== 4); } };
      P.align = function (x, y) { for (var dy = -2; dy <= 2; dy++)for (var dx = -2; dx <= 2; dx++)this.setF(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); };
      P.alignPos = function () { if (this.version === 1) return []; var n = Math.floor(this.version / 7) + 2; var step = (this.version === 32) ? 26 : Math.ceil((this.size - 13) / (n * 2 - 2)) * 2; var r = [6]; for (var p = this.size - 7; r.length < n; p -= step)r.splice(1, 0, p); return r; };
      P.drawFormatBits = function (mask) {
        var data = (this.ecl.formatBits << 3) | mask, rem = data; for (var i = 0; i < 10; i++)rem = (rem << 1) ^ ((rem >>> 9) * 0x537); var bits = ((data << 10) | rem) ^ 0x5412, s = this.size;
        for (i = 0; i <= 5; i++)this.setF(8, i, getBit(bits, i)); this.setF(8, 7, getBit(bits, 6)); this.setF(8, 8, getBit(bits, 7)); this.setF(7, 8, getBit(bits, 8));
        for (i = 9; i < 15; i++)this.setF(14 - i, 8, getBit(bits, i));
        for (i = 0; i < 8; i++)this.setF(s - 1 - i, 8, getBit(bits, i)); for (i = 8; i < 15; i++)this.setF(8, s - 15 + i, getBit(bits, i)); this.setF(8, s - 8, true);
      };
      P.drawVersion = function () {
        if (this.version < 7) return; var rem = this.version; for (var i = 0; i < 12; i++)rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25); var bits = (this.version << 12) | rem;
        for (i = 0; i < 18; i++) { var bit = getBit(bits, i), a = this.size - 11 + (i % 3), b = Math.floor(i / 3); this.setF(a, b, bit); this.setF(b, a, bit); }
      };
      P.addEccAndInterleave = function (data) {
        var v = this.version, e = this.ecl; var nb = NUM_ERROR_CORRECTION_BLOCKS[e.ordinal][v], bl = ECC_CODEWORDS_PER_BLOCK[e.ordinal][v]; var raw = Math.floor(rawModules(v) / 8); var nsb = nb - raw % nb, sbl = Math.floor(raw / nb); var blocks = [], div = rsDivisor(bl);
        for (var i = 0, k = 0; i < nb; i++) { var dat = data.slice(k, k + sbl - bl + (i < nsb ? 0 : 1)); k += dat.length; var ecc = rsRemainder(dat, div); if (i < nsb) dat.push(0); blocks.push(dat.concat(ecc)); }
        var res = []; for (i = 0; i < blocks[0].length; i++)for (var j = 0; j < blocks.length; j++)if (i !== sbl - bl || j >= nsb) res.push(blocks[j][i]); return res;
      };
      P.drawCodewords = function (data) { var s = this.size, i = 0; for (var right = s - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (var vert = 0; vert < s; vert++)for (var j = 0; j < 2; j++) { var x = right - j, up = ((right + 1) & 2) === 0, y = up ? s - 1 - vert : vert; if (!this.isFunction[y][x] && i < data.length * 8) { this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7)); i++; } } } };
      P.applyMask = function (mask) { var s = this.size; for (var y = 0; y < s; y++)for (var x = 0; x < s; x++) { if (this.isFunction[y][x]) continue; var inv; switch (mask) { case 0: inv = (x + y) % 2 === 0; break; case 1: inv = y % 2 === 0; break; case 2: inv = x % 3 === 0; break; case 3: inv = (x + y) % 3 === 0; break; case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break; case 5: inv = (x * y) % 2 + (x * y) % 3 === 0; break; case 6: inv = ((x * y) % 2 + (x * y) % 3) % 2 === 0; break; case 7: inv = ((x + y) % 2 + (x * y) % 3) % 2 === 0; break; }if (inv) this.modules[y][x] = !this.modules[y][x]; } };
      P.getPenaltyScore = function () {
        var r = 0, s = this.size, x, y;
        for (y = 0; y < s; y++) { var rc = false, rx = 0, rh = [0, 0, 0, 0, 0, 0, 0]; for (x = 0; x < s; x++) { if (this.modules[y][x] === rc) { rx++; if (rx === 5) r += N1; else if (rx > 5) r++; } else { this.fpAdd(rx, rh); if (!rc) r += this.fpCount(rh) * N3; rc = this.modules[y][x]; rx = 1; } } r += this.fpTerm(rc, rx, rh) * N3; }
        for (x = 0; x < s; x++) { var rc2 = false, ry = 0, rh2 = [0, 0, 0, 0, 0, 0, 0]; for (y = 0; y < s; y++) { if (this.modules[y][x] === rc2) { ry++; if (ry === 5) r += N1; else if (ry > 5) r++; } else { this.fpAdd(ry, rh2); if (!rc2) r += this.fpCount(rh2) * N3; rc2 = this.modules[y][x]; ry = 1; } } r += this.fpTerm(rc2, ry, rh2) * N3; }
        for (y = 0; y < s - 1; y++)for (x = 0; x < s - 1; x++) { var c = this.modules[y][x]; if (c === this.modules[y][x + 1] && c === this.modules[y + 1][x] && c === this.modules[y + 1][x + 1]) r += N2; }
        var dark = 0; for (y = 0; y < s; y++)for (x = 0; x < s; x++)if (this.modules[y][x]) dark++; var t = s * s; var k = Math.ceil(Math.abs(dark * 20 - t * 10) / t) - 1; r += k * N4; return r;
      };
      P.fpCount = function (rh) { var n = rh[1]; var core = n > 0 && rh[2] === n && rh[3] === n * 3 && rh[4] === n && rh[5] === n; return (core && rh[0] >= n * 4 && rh[6] >= n ? 1 : 0) + (core && rh[6] >= n * 4 && rh[0] >= n ? 1 : 0); };
      P.fpTerm = function (c, l, rh) { if (c) { this.fpAdd(l, rh); l = 0; } l += this.size; this.fpAdd(l, rh); return this.fpCount(rh); };
      P.fpAdd = function (l, rh) { if (rh[0] === 0) l += this.size; rh.pop(); rh.unshift(l); };

      function encodeText(text, eclName, boostEcl) {
        var ecl = ECC[eclName] || ECC.MEDIUM; var bytes = utf8(text); var version, used, cap;
        for (version = MIN_VERSION; ; version++) { cap = dataCodewords(version, ecl) * 8; var cc = (version <= 9) ? 8 : 16; used = 4 + cc + bytes.length * 8; if (used <= cap) break; if (version >= MAX_VERSION) throw new Error("El contenido es demasiado largo para un código QR."); }
        if (boostEcl !== false) { ["MEDIUM", "QUARTILE", "HIGH"].forEach(function (nm) { var c = ECC[nm]; if (used <= dataCodewords(version, c) * 8) ecl = c; }); cap = dataCodewords(version, ecl) * 8; }
        var bb = []; function ap(v, l) { for (var i = l - 1; i >= 0; i--)bb.push((v >>> i) & 1); }
        ap(0x4, 4); ap(bytes.length, (version <= 9) ? 8 : 16); bytes.forEach(function (b) { ap(b, 8); });
        ap(0, Math.min(4, cap - bb.length)); ap(0, (8 - bb.length % 8) % 8);
        for (var pad = 0xEC; bb.length < cap; pad ^= 0xEC ^ 0x11)ap(pad, 8);
        var dcw = []; for (var i = 0; i < bb.length; i += 8) { var byte = 0; for (var j = 0; j < 8; j++)byte = (byte << 1) | bb[i + j]; dcw.push(byte); }
        return new QrCode(version, ecl, dcw, -1);
      }
      global.QREngine = { encodeText: encodeText, ECC: ECC };
    })(window);
