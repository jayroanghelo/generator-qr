    (function () {
      "use strict";
      var $ = function (id) { return document.getElementById(id); };

      // ----- Estado de diseño -----
      var state = {
        fg: "#101728", bg: "#ffffff", transparent: false,
        grad: false, fg2: "#6d8cff", gradDir: "diag",
        dot: "square", eyeFrame: "square", eyeBall: "square",
        eyeColorOn: false, eyeColor: "#101728",
        ecc: "MEDIUM", quiet: true,
        logo: null, logoOriginal: null, logoSize: 20, logoBg: true,
        bgRemove: false, bgTol: 32,
        frameStyle: "none", frameText: "SCAN ME",
        frameFont: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", frameColor: "#101728",
        type: "url"
      };

      // ----- Tabs de contenido -----
      var TYPES = [
        { id: "url", label: "URL", icon: "link" },
        { id: "text", label: "Texto", icon: "pencil" },
        { id: "wifi", label: "WiFi", icon: "wifi" },
        { id: "vcard", label: "Contacto", icon: "user-round" },
        { id: "email", label: "Email", icon: "mail" },
        { id: "phone", label: "Teléfono", icon: "phone" },
        { id: "sms", label: "SMS", icon: "message-square" },
        { id: "geo", label: "Ubicación", icon: "map-pin" },
        { id: "social", label: "Redes", icon: "globe" },
        { id: "app", label: "Tienda de Apps", icon: "smartphone" },
        { id: "pdf", label: "PDF", icon: "file-text" },
        { id: "batch", label: "Lote", icon: "layers" },
        { id: "read", label: "Leer QR", icon: "scan-line" }
      ];
      var tabsEl = $("tabs");
      TYPES.forEach(function (t) {
        var b = document.createElement("button");
        b.className = "tab" + (t.id === "url" ? " active" : "");
        b.innerHTML = "<i data-lucide=\"" + t.icon + "\"></i> <span>" + t.label + "</span>";
        b.onclick = function () {
          state.type = t.id;
          document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          document.querySelectorAll(".field-group").forEach(function (g) { g.classList.toggle("active", g.dataset.type === t.id); });
          render();
        };
        tabsEl.appendChild(b);
      });

      if (window.lucide) {
        lucide.createIcons();
      } else {
        setTimeout(function () { if (window.lucide) lucide.createIcons(); }, 100);
      }

      // ----- Iconos de Redes Sociales -----
      var ICONS = {
        instagram: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
        tiktok: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>',
        facebook: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%231877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
        whatsapp: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2325D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
        x: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
        youtube: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
        linkedin: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%230A66C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
      };

      // ----- Plantillas -----
      var TEMPLATES = [
        { name: "Clásico", fg: "#101728", bg: "#ffffff", grad: false, dot: "square", eyeFrame: "square", eyeBall: "square" },
        { name: "Elegante", fg: "#000000", bg: "#ffffff", grad: false, dot: "dots", eyeFrame: "circle", eyeBall: "circle" },
        // Redes Sociales 2026
        { name: "Instagram", fg: "#833ab4", bg: "#ffffff", grad: true, fg2: "#fd1d1d", gradDir: "diag", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle", icon: "instagram", frameStyle: "phone", frameText: "SÍGUEME", frameColor: "#E1306C", ecc: "HIGH" },
        { name: "TikTok", fg: "#00f2fe", bg: "#000000", grad: true, fg2: "#fe0979", gradDir: "diag", dot: "dots", eyeFrame: "circle", eyeBall: "circle", eyeColor: "#00f2fe", icon: "tiktok", frameStyle: "bottom", frameText: "FOLLOW ME", frameColor: "#fe0979", ecc: "HIGH" },
        { name: "Facebook", fg: "#1877F2", bg: "#ffffff", grad: true, fg2: "#42b72a", gradDir: "horiz", dot: "rounded", eyeFrame: "square", eyeBall: "square", icon: "facebook", frameStyle: "bottom", frameText: "SÍGUENOS", frameColor: "#1877F2", ecc: "HIGH" },
        { name: "WhatsApp", fg: "#128C7E", bg: "#ffffff", grad: true, fg2: "#25D366", gradDir: "diag", dot: "classy", eyeFrame: "circle", eyeBall: "circle", icon: "whatsapp", frameStyle: "rounded", frameText: "CHAT", frameColor: "#25D366", ecc: "HIGH" },
        { name: "X (Twitter)", fg: "#000000", bg: "#ffffff", grad: false, dot: "square", eyeFrame: "square", eyeBall: "square", icon: "x", frameStyle: "border", frameText: "POST", frameColor: "#000000", ecc: "HIGH" },
        { name: "YouTube", fg: "#FF0000", bg: "#ffffff", grad: true, fg2: "#c4302b", gradDir: "vert", dot: "rounded", eyeFrame: "rounded", eyeBall: "rounded", icon: "youtube", frameStyle: "bottom", frameText: "SUSCRÍBETE", frameColor: "#FF0000", ecc: "HIGH" },
        { name: "LinkedIn", fg: "#0A66C2", bg: "#ffffff", grad: true, fg2: "#0077b5", gradDir: "horiz", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle", icon: "linkedin", frameStyle: "bottom", frameText: "CONECTAR", frameColor: "#0A66C2", ecc: "HIGH" },
        { name: "Océano", fg: "#0077b6", bg: "#ffffff", grad: true, fg2: "#00b4d8", gradDir: "diag", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Atardecer", fg: "#f72585", bg: "#fff7f2", grad: true, fg2: "#ff8800", gradDir: "diag", dot: "dots", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Bosque", fg: "#1b4332", bg: "#f1faee", grad: true, fg2: "#52b788", gradDir: "vert", dot: "rounded", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Neón", fg: "#7b2ff7", bg: "#0e1116", grad: true, fg2: "#16d0ff", gradDir: "diag", dot: "dots", eyeFrame: "circle", eyeBall: "circle" },
        { name: "Coral", fg: "#e63946", bg: "#ffffff", grad: false, dot: "diamond", eyeFrame: "square", eyeBall: "square" },
        { name: "Real", fg: "#3a0ca3", bg: "#ffffff", grad: true, fg2: "#7209b7", gradDir: "horiz", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Oro Negro", fg: "#bf9b30", bg: "#0e1116", grad: true, fg2: "#ffd700", gradDir: "diag", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle", eyeColor: "#ffd700" },
        { name: "Platino", fg: "#434a54", bg: "#ffffff", grad: true, fg2: "#9aa5b1", gradDir: "vert", dot: "dots", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Rubí", fg: "#9b1d3a", bg: "#fff5f6", grad: true, fg2: "#e0245e", gradDir: "diag", dot: "rounded", eyeFrame: "circle", eyeBall: "circle" },
        { name: "Esmeralda", fg: "#04663b", bg: "#f3fbf6", grad: true, fg2: "#2ecc71", gradDir: "diag", dot: "dots", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Zafiro", fg: "#0b3d91", bg: "#ffffff", grad: true, fg2: "#3a86ff", gradDir: "radial", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Amatista", fg: "#5b2a86", bg: "#faf5ff", grad: true, fg2: "#b56cf0", gradDir: "diag", dot: "diamond", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Cobre", fg: "#7c3a14", bg: "#fff7f0", grad: true, fg2: "#d97b34", gradDir: "vert", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Medianoche", fg: "#1a2980", bg: "#0a0e14", grad: true, fg2: "#26d0ce", gradDir: "diag", dot: "dots", eyeFrame: "circle", eyeBall: "circle", eyeColor: "#26d0ce" },
        { name: "Flamenco", fg: "#ff4d6d", bg: "#fff0f3", grad: true, fg2: "#ff9e00", gradDir: "horiz", dot: "dots", eyeFrame: "circle", eyeBall: "circle" },
        { name: "Menta", fg: "#0fa3a3", bg: "#f0fffd", grad: true, fg2: "#5ef2c4", gradDir: "diag", dot: "rounded", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Lavanda", fg: "#6a4c93", bg: "#f8f5ff", grad: true, fg2: "#c9a7eb", gradDir: "vert", dot: "dots", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Cibernético", fg: "#00f5d4", bg: "#0d0221", grad: true, fg2: "#f15bb5", gradDir: "diag", dot: "diamond", eyeFrame: "circle", eyeBall: "circle", eyeColor: "#f15bb5" },
        { name: "Selva", fg: "#386641", bg: "#fefae0", grad: true, fg2: "#a7c957", gradDir: "diag", dot: "rounded", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Cereza", fg: "#6a040f", bg: "#fff", grad: true, fg2: "#dc2f02", gradDir: "vert", dot: "diamond", eyeFrame: "square", eyeBall: "square" },
        { name: "Acero", fg: "#2b2d42", bg: "#edf2f4", grad: false, dot: "square", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Tropical", fg: "#ff6b35", bg: "#fffbe6", grad: true, fg2: "#f7c548", gradDir: "diag", dot: "dots", eyeFrame: "circle", eyeBall: "circle" },
        { name: "Galaxia", fg: "#3a0ca3", bg: "#05010f", grad: true, fg2: "#f72585", gradDir: "diag", dot: "dots", eyeFrame: "circle", eyeBall: "circle", eyeColor: "#f72585" },
        { name: "Café", fg: "#3e2723", bg: "#f5ede4", grad: true, fg2: "#8d6e63", gradDir: "vert", dot: "rounded", eyeFrame: "rounded", eyeBall: "rounded" },
        { name: "Hielo", fg: "#0277bd", bg: "#e8f7ff", grad: true, fg2: "#80d8ff", gradDir: "radial", dot: "dots", eyeFrame: "rounded", eyeBall: "circle" },
        { name: "Mono Invertido", fg: "#ffffff", bg: "#101728", grad: false, dot: "rounded", eyeFrame: "rounded", eyeBall: "rounded" }
      ];
      var tEl = $("templates");
      TEMPLATES.forEach(function (t, i) {
        var d = document.createElement("div");
        d.className = "tpl" + (i === 0 ? " active" : "");
        var grad = t.grad ? "linear-gradient(135deg," + t.fg + "," + (t.fg2 || t.fg) + ")" : t.fg;
        d.innerHTML = '<div class="sw" style="background:' + grad + '"></div><span>' + t.name + '</span>';
        d.onclick = function () {
          document.querySelectorAll(".tpl").forEach(function (x) { x.classList.remove("active"); });
          d.classList.add("active");
          applyTemplate(t);
        };
        tEl.appendChild(d);
      });

      // Flechas del carrusel de plantillas
      $("tplPrev").onclick = function () { tEl.scrollBy({ left: -tEl.clientWidth * 0.8, behavior: "smooth" }); };
      $("tplNext").onclick = function () { tEl.scrollBy({ left: tEl.clientWidth * 0.8, behavior: "smooth" }); };
      function updateArrows() {
        var max = tEl.scrollWidth - tEl.clientWidth - 2;
        $("tplPrev").style.display = tEl.scrollLeft > 2 ? "flex" : "none";
        $("tplNext").style.display = tEl.scrollLeft < max ? "flex" : "none";
      }
      tEl.addEventListener("scroll", updateArrows);
      window.addEventListener("resize", updateArrows);
      updateArrows();

      function applyTemplate(t) {
        state.fg = t.fg; state.bg = t.bg; state.grad = !!t.grad; state.fg2 = t.fg2 || state.fg2;
        state.gradDir = t.gradDir || state.gradDir; state.dot = t.dot; state.eyeFrame = t.eyeFrame; state.eyeBall = t.eyeBall;
        // color de ojos opcional
        if (t.eyeColor) { state.eyeColorOn = true; state.eyeColor = t.eyeColor; } else { state.eyeColorOn = false; }
        $("eyeColorOn").checked = state.eyeColorOn;
        $("eyeColorWrap").style.display = state.eyeColorOn ? "block" : "none";
        $("eyeColor").value = state.eyeColor; $("eyeColorTxt").value = state.eyeColor;
        // sincronizar controles
        $("fgColor").value = state.fg; $("fgColorTxt").value = state.fg;
        $("bgColor").value = state.bg; $("bgColorTxt").value = state.bg;
        $("gradOn").checked = state.grad; $("gradControls").style.display = state.grad ? "block" : "none";
        $("fgColor2").value = state.fg2; $("fgColor2Txt").value = state.fg2; $("gradDir").value = state.gradDir;
        $("transparentBg").checked = false; state.transparent = false;
        setSeg("dotStyle", state.dot); setSeg("eyeFrame", state.eyeFrame); setSeg("eyeBall", state.eyeBall);

        // Novedad: Marcos y Logos Automáticos
        if (t.frameStyle) {
          state.frameStyle = t.frameStyle;
          setSeg("frameStyle", t.frameStyle);
        } else {
          state.frameStyle = "none";
          setSeg("frameStyle", "none");
        }
        if (t.frameText) { state.frameText = t.frameText; $("frameText").value = t.frameText; }
        if (t.frameColor) { state.frameColor = t.frameColor; $("frameColor").value = t.frameColor; $("frameColorTxt").value = t.frameColor; }
        
        if (t.ecc) { state.ecc = t.ecc; $("eccLevel").value = t.ecc; }

        if (t.icon && ICONS[t.icon]) {
          var img = new Image();
          img.onload = function() {
            state.logoOriginal = img;
            state.logo = img; 
            state.bgRemove = false;
            $("bgRemove").checked = false;
            $("bgTolWrap").style.display = "none";
            $("logoPreview").style.display = "flex";
            $("bgRemoveWrap").style.display = "block";
            $("logoThumb").src = img.src;
            $("logoThumb").classList.remove("alpha");
            state.ecc = "HIGH"; $("eccLevel").value = "HIGH";
            render();
          };
          img.src = ICONS[t.icon];
          return; 
        } else {
          state.logo = null; state.logoOriginal = null;
          $("logoPreview").style.display = "none";
          $("bgRemoveWrap").style.display = "none";
          $("logoInput").value = "";
        }

        render();
      }
      function setSeg(id, val) { document.querySelectorAll("#" + id + " button").forEach(function (b) { b.classList.toggle("active", b.dataset.v === val); }); }

      // ----- Bind controles de color -----
      function bindColor(colorId, txtId, key) {
        var c = $(colorId), t = $(txtId);
        c.oninput = function () { state[key] = c.value; t.value = c.value; render(); };
        t.oninput = function () { if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(t.value)) { state[key] = t.value; c.value = t.value; render(); } };
      }
      bindColor("fgColor", "fgColorTxt", "fg");
      bindColor("bgColor", "bgColorTxt", "bg");
      bindColor("fgColor2", "fgColor2Txt", "fg2");
      bindColor("eyeColor", "eyeColorTxt", "eyeColor");
      bindColor("frameColor", "frameColorTxt", "frameColor");

      // ----- Marco -----
      document.querySelectorAll("#frameStyle button").forEach(function (b) {
        b.onclick = function () { setSeg("frameStyle", b.dataset.v); state.frameStyle = b.dataset.v; render(); };
      });
      $("frameText").oninput = function () { state.frameText = this.value; render(); };
      $("frameFont").onchange = function () { state.frameFont = this.value; render(); };

      $("transparentBg").onchange = function () { state.transparent = this.checked; render(); };
      $("gradOn").onchange = function () { state.grad = this.checked; $("gradControls").style.display = this.checked ? "block" : "none"; render(); };
      $("gradDir").onchange = function () { state.gradDir = this.value; render(); };
      $("eyeColorOn").onchange = function () { state.eyeColorOn = this.checked; $("eyeColorWrap").style.display = this.checked ? "block" : "none"; render(); };
      $("eccLevel").onchange = function () { state.ecc = this.value; render(); };
      $("quietZone").onchange = function () { state.quiet = this.checked; render(); };

      // ----- Segmentos de forma -----
      ["dotStyle", "eyeFrame", "eyeBall"].forEach(function (id) {
        var key = id === "dotStyle" ? "dot" : (id === "eyeFrame" ? "eyeFrame" : "eyeBall");
        document.querySelectorAll("#" + id + " button").forEach(function (b) {
          b.onclick = function () { setSeg(id, b.dataset.v); state[key] = b.dataset.v; render(); };
        });
      });

      // ----- Iconos visuales de las formas (en vez de texto) -----
      function frameIcon(type) {
        if (type === "circle")
          return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="12" cy="12" r="2.1" fill="currentColor"/></svg>';
        var rx = type === "rounded" ? 5.5 : 0.5, brx = type === "rounded" ? 1.4 : 0;
        return '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="' + rx + '" fill="none" stroke="currentColor" stroke-width="3"/><rect x="10" y="10" width="4" height="4" rx="' + brx + '" fill="currentColor"/></svg>';
      }
      function shapeIcon(type) {
        return '<svg viewBox="0 0 24 24">' + svgShape(type, 2.5, 2.5, 19, "currentColor") + '</svg>';
      }
      function decorateSeg(id, kind) {
        document.querySelectorAll("#" + id + " button").forEach(function (b) {
          var label = b.textContent.trim();
          b.title = label;
          b.setAttribute("aria-label", label);
          b.innerHTML = (kind === "frame" ? frameIcon(b.dataset.v) : shapeIcon(b.dataset.v));
        });
      }
      decorateSeg("dotStyle", "shape");
      decorateSeg("eyeFrame", "frame");
      decorateSeg("eyeBall", "shape");

      // ----- Acordeones -----
      document.querySelectorAll(".acc-head").forEach(function (h) {
        h.onclick = function () { h.parentElement.classList.toggle("open"); };
      });

      // ----- Logo -----
      var logoDrop = $("logoDrop"), logoInput = $("logoInput");
      logoDrop.onclick = function () { logoInput.click(); };
      logoDrop.ondragover = function (e) { e.preventDefault(); logoDrop.style.borderColor = "var(--accent)"; };
      logoDrop.ondragleave = function () { logoDrop.style.borderColor = ""; };
      logoDrop.ondrop = function (e) { e.preventDefault(); logoDrop.style.borderColor = ""; if (e.dataTransfer.files[0]) loadLogo(e.dataTransfer.files[0]); };
      logoInput.onchange = function () { if (this.files[0]) loadLogo(this.files[0]); };
      function loadLogo(file) {
        var r = new FileReader();
        r.onload = function () {
          var img = new Image();
          img.onload = function () {
            state.logoOriginal = img;
            $("logoPreview").style.display = "flex";
            $("bgRemoveWrap").style.display = "block";
            // forzar ECC alta para legibilidad
            state.ecc = "HIGH"; $("eccLevel").value = "HIGH";
            applyLogoProcessing();
          };
          img.src = r.result;
        };
        r.readAsDataURL(file);
      }

      // ---- Quitafondos offline (relleno por proximidad desde los bordes) ----
      function removeBackground(img, tol) {
        var max = 600;
        var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
        var sc = Math.min(1, max / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
        var cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
        var ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, cw, ch);
        var id = ctx.getImageData(0, 0, cw, ch), data = id.data;
        function px(x, y) { var i = (y * cw + x) * 4; return [data[i], data[i + 1], data[i + 2]]; }
        var cs = [px(0, 0), px(cw - 1, 0), px(0, ch - 1), px(cw - 1, ch - 1)];
        var bg = [0, 0, 0]; cs.forEach(function (c) { bg[0] += c[0]; bg[1] += c[1]; bg[2] += c[2]; });
        bg = bg.map(function (v) { return v / 4; });
        function dist(i) { var a = data[i] - bg[0], b = data[i + 1] - bg[1], c = data[i + 2] - bg[2]; return Math.sqrt(a * a + b * b + c * c); }
        var thr = tol, total = cw * ch;
        var visited = new Uint8Array(total);
        var stack = [];
        for (var x = 0; x < cw; x++) { stack.push(x); stack.push((ch - 1) * cw + x); }
        for (var y = 0; y < ch; y++) { stack.push(y * cw); stack.push(y * cw + cw - 1); }
        while (stack.length) {
          var p = stack.pop();
          if (visited[p]) continue; visited[p] = 1;
          var i = p * 4;
          if (dist(i) > thr) continue;       // borde del objeto: se conserva, no se propaga
          data[i + 3] = 0;                    // fondo: transparente
          var qx = p % cw, qy = (p / cw) | 0;
          if (qx > 0) stack.push(p - 1);
          if (qx < cw - 1) stack.push(p + 1);
          if (qy > 0) stack.push(p - cw);
          if (qy < ch - 1) stack.push(p + cw);
        }
        // Suavizado de bordes (anti-halo): alfa parcial en el contorno
        var soft = thr * 0.8;
        var copy = data.slice(0);
        for (var p2 = 0; p2 < total; p2++) {
          var i2 = p2 * 4;
          if (copy[i2 + 3] === 0) continue;
          var nx = p2 % cw, ny = (p2 / cw) | 0, edge = false;
          if (nx > 0 && copy[(p2 - 1) * 4 + 3] === 0) edge = true;
          else if (nx < cw - 1 && copy[(p2 + 1) * 4 + 3] === 0) edge = true;
          else if (ny > 0 && copy[(p2 - cw) * 4 + 3] === 0) edge = true;
          else if (ny < ch - 1 && copy[(p2 + cw) * 4 + 3] === 0) edge = true;
          if (!edge) continue;
          var d = dist(i2);
          if (d < thr + soft) {
            var a = Math.max(0, Math.min(1, (d - thr) / soft));
            data[i2 + 3] = Math.round(data[i2 + 3] * a);
          }
        }
        ctx.putImageData(id, 0, 0);
        return cv;
      }

      function applyLogoProcessing() {
        if (!state.logoOriginal) { state.logo = null; render(); return; }
        if (!state.bgRemove) {
          state.logo = state.logoOriginal;
          $("logoThumb").src = state.logoOriginal.src;
          $("logoThumb").classList.remove("alpha");
          render();
          return;
        }
        var cv = removeBackground(state.logoOriginal, state.bgTol);
        var out = new Image();
        out.onload = function () { state.logo = out; render(); };
        out.src = cv.toDataURL("image/png");
        $("logoThumb").src = out.src;
        $("logoThumb").classList.add("alpha");
      }

      $("logoRemove").onclick = function () {
        state.logo = null; state.logoOriginal = null; state.bgRemove = false;
        $("bgRemove").checked = false; $("bgTolWrap").style.display = "none";
        $("bgRemoveWrap").style.display = "none";
        $("logoPreview").style.display = "none"; logoInput.value = ""; render();
      };
      $("logoSize").oninput = function () { state.logoSize = +this.value; $("logoSizeVal").textContent = this.value + "%"; render(); };
      $("logoBg").onchange = function () { state.logoBg = this.checked; render(); };
      $("bgRemove").onchange = function () { state.bgRemove = this.checked; $("bgTolWrap").style.display = this.checked ? "block" : "none"; applyLogoProcessing(); };
      $("bgTol").oninput = function () { state.bgTol = +this.value; $("bgTolVal").textContent = this.value; if (state.bgRemove) applyLogoProcessing(); };

      // ----- Inputs de contenido -> render -----
      document.querySelectorAll(".field-group input, .field-group textarea, .field-group select").forEach(function (el) {
        el.addEventListener("input", render);
        el.addEventListener("change", render);
      });

      // ----- "https://" obligatorio y fijo en el campo URL -----
      (function () {
        var u = $("url_value");
        function enforce() {
          var v = u.value;
          if (!v.startsWith("https://")) {
            v = v.replace(/^(https?:\/\/|h(t(t(p(s?(:?(\/\/?)?)?)?)?)?)?)/i, "");
            v = "https://" + v;
            u.value = v;
            try { u.setSelectionRange(v.length, v.length); } catch (e) { }
          }
        }
        u.addEventListener("input", function () { enforce(); render(); });
        u.addEventListener("blur", enforce);
        u.addEventListener("focus", function () {
          if (u.selectionStart < 8) { try { u.setSelectionRange(u.value.length, u.value.length); } catch (e) { } }
        });
      }());

      // ----- Construir cadena de datos según tipo -----
      function esc(s) { return (s || "").replace(/([\\;,:"])/g, "\\$1"); }
      function buildData() {
        switch (state.type) {
          case "url": return $("url_value").value.trim();
          case "text": return $("text_value").value;
          case "wifi": {
            var ssid = $("wifi_ssid").value, pass = $("wifi_pass").value, enc = $("wifi_enc").value, hid = $("wifi_hidden").value;
            if (!ssid) return "";
            if (enc === "nopass") return "WIFI:T:nopass;S:" + esc(ssid) + ";;";
            return "WIFI:T:" + enc + ";S:" + esc(ssid) + ";P:" + esc(pass) + ";H:" + hid + ";;";
          }
          case "email": {
            var to = $("email_to").value.trim(); if (!to) return "";
            var q = []; if ($("email_subject").value) q.push("subject=" + encodeURIComponent($("email_subject").value));
            if ($("email_body").value) q.push("body=" + encodeURIComponent($("email_body").value));
            return "mailto:" + to + (q.length ? "?" + q.join("&") : "");
          }
          case "phone": { var p = $("phone_value").value.replace(/\s/g, ""); return p ? "tel:" + p : ""; }
          case "sms": { var n = $("sms_number").value.replace(/\s/g, ""); if (!n) return ""; var m = $("sms_body").value; return "SMSTO:" + n + (m ? ":" + m : ""); }
          case "vcard": {
            var f = $("vc_first").value, l = $("vc_last").value;
            if (!f && !l && !$("vc_phone").value && !$("vc_email").value) return "";
            var v = "BEGIN:VCARD\nVERSION:3.0\n";
            v += "N:" + (l || "") + ";" + (f || "") + "\nFN:" + ((f + " " + l).trim()) + "\n";
            if ($("vc_org").value) v += "ORG:" + $("vc_org").value + "\n";
            if ($("vc_title").value) v += "TITLE:" + $("vc_title").value + "\n";
            if ($("vc_phone").value) v += "TEL;TYPE=CELL:" + $("vc_phone").value + "\n";
            if ($("vc_email").value) v += "EMAIL:" + $("vc_email").value + "\n";
            if ($("vc_url").value) v += "URL:" + $("vc_url").value + "\n";
            if ($("vc_adr").value) v += "ADR:;;" + $("vc_adr").value + "\n";
            v += "END:VCARD"; return v;
          }
          case "geo": { var la = $("geo_lat").value.trim(), lo = $("geo_lng").value.trim(); return (la && lo) ? "geo:" + la + "," + lo : ""; }
          case "social": { var base = $("social_net").value, val = $("social_value").value.trim().replace(/^@/, ""); return val ? base + val : ""; }
          case "app": {
            var mode = $("app_mode").value;
            if (mode === "ios") return $("app_ios").value.trim();
            if (mode === "android") return $("app_android").value.trim();
            return $("app_dest").value.trim();
          }
          case "pdf": {
            var pm = $("pdf_mode").value;
            return pm === "direct" ? $("pdf_url").value.trim() : $("pdf_dest").value.trim();
          }
          case "batch": {
            var lines = batchEntries();
            return lines.length ? lines[0] : "";
          }
          case "read": return "";
        }
        return "";
      }

      // Entradas del lote (una por línea, sin vacías)
      function batchEntries() {
        var raw = ($("batch_list") ? $("batch_list").value : "") || "";
        var isUrl = $("batch_type") && $("batch_type").value === "url";
        return raw.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(function (s) { return s; })
          .map(function (s) {
            if (isUrl && !/^[a-z][a-z0-9+.-]*:\/\//i.test(s) && !/^(mailto:|tel:|wifi:)/i.test(s)) return "https://" + s;
            return s;
          });
      }

      // ====================== RENDERER ======================
      function isFinder(x, y, n) { return (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7); }

      function makeFgStyle(ctx, x0, y0, dim) {
        if (!state.grad) return state.fg;
        var g;
        if (state.gradDir === "radial") g = ctx.createRadialGradient(x0 + dim / 2, y0 + dim / 2, dim * 0.05, x0 + dim / 2, y0 + dim / 2, dim * 0.7);
        else if (state.gradDir === "horiz") g = ctx.createLinearGradient(x0, y0, x0 + dim, y0);
        else if (state.gradDir === "vert") g = ctx.createLinearGradient(x0, y0, x0, y0 + dim);
        else g = ctx.createLinearGradient(x0, y0, x0 + dim, y0 + dim);
        g.addColorStop(0, state.fg); g.addColorStop(1, state.fg2);
        return g;
      }

      function roundRect(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      // ---- Sistema de formas unificado (canvas + SVG) ----
      function fr(v) { return Math.round(v * 1000) / 1000; }
      function rrPath(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); return "M" + fr(x + r) + " " + fr(y) + "L" + fr(x + w - r) + " " + fr(y) + "Q" + fr(x + w) + " " + fr(y) + " " + fr(x + w) + " " + fr(y + r) + "L" + fr(x + w) + " " + fr(y + h - r) + "Q" + fr(x + w) + " " + fr(y + h) + " " + fr(x + w - r) + " " + fr(y + h) + "L" + fr(x + r) + " " + fr(y + h) + "Q" + fr(x) + " " + fr(y + h) + " " + fr(x) + " " + fr(y + h - r) + "L" + fr(x) + " " + fr(y + r) + "Q" + fr(x) + " " + fr(y) + " " + fr(x + r) + " " + fr(y) + "Z"; }
      function polyPath(cx, cy, r, sides, rot) { var d = ""; for (var i = 0; i < sides; i++) { var a = rot + i * 2 * Math.PI / sides; d += (i ? "L" : "M") + fr(cx + r * Math.cos(a)) + " " + fr(cy + r * Math.sin(a)); } return d + "Z"; }
      function starPath(cx, cy, ro, ri, pts, rot) { var d = ""; for (var i = 0; i < pts * 2; i++) { var r = i % 2 ? ri : ro, a = rot + i * Math.PI / pts; d += (i ? "L" : "M") + fr(cx + r * Math.cos(a)) + " " + fr(cy + r * Math.sin(a)); } return d + "Z"; }
      function plusPath(x, y, s) { var w = s * 0.56, l = x + (s - w) / 2, rg = x + (s + w) / 2, t = y + (s - w) / 2, b = y + (s + w) / 2; return "M" + fr(l) + " " + fr(y) + "L" + fr(rg) + " " + fr(y) + "L" + fr(rg) + " " + fr(t) + "L" + fr(x + s) + " " + fr(t) + "L" + fr(x + s) + " " + fr(b) + "L" + fr(rg) + " " + fr(b) + "L" + fr(rg) + " " + fr(y + s) + "L" + fr(l) + " " + fr(y + s) + "L" + fr(l) + " " + fr(b) + "L" + fr(x) + " " + fr(b) + "L" + fr(x) + " " + fr(t) + "L" + fr(l) + " " + fr(t) + "Z"; }
      function heartPath(x, y, s) { var cx = x + s / 2; return "M" + fr(cx) + " " + fr(y + s * 0.92) + "C" + fr(x + s * 0.02) + " " + fr(y + s * 0.55) + " " + fr(x + s * 0.12) + " " + fr(y + s * 0.12) + " " + fr(cx) + " " + fr(y + s * 0.34) + "C" + fr(x + s * 0.88) + " " + fr(y + s * 0.12) + " " + fr(x + s * 0.98) + " " + fr(y + s * 0.55) + " " + fr(cx) + " " + fr(y + s * 0.92) + "Z"; }
      function leafPath(x, y, s) { var r = s * 0.5; return "M" + fr(x + r) + " " + fr(y) + "L" + fr(x + s) + " " + fr(y) + "L" + fr(x + s) + " " + fr(y + s - r) + "Q" + fr(x + s) + " " + fr(y + s) + " " + fr(x + s - r) + " " + fr(y + s) + "L" + fr(x) + " " + fr(y + s) + "L" + fr(x) + " " + fr(y + r) + "Q" + fr(x) + " " + fr(y) + " " + fr(x + r) + " " + fr(y) + "Z"; }
      function diamondPath(x, y, s) { var c = s / 2; return "M" + fr(x + c) + " " + fr(y) + "L" + fr(x + s) + " " + fr(y + c) + "L" + fr(x + c) + " " + fr(y + s) + "L" + fr(x) + " " + fr(y + c) + "Z"; }
      function trianglePath(x, y, s) { return "M" + fr(x) + " " + fr(y) + "L" + fr(x + s) + " " + fr(y) + "L" + fr(x + s / 2) + " " + fr(y + s) + "Z"; }
      function shapeD(type, x, y, s) {
        var cx = x + s / 2, cy = y + s / 2;
        switch (type) {
          case "rounded": return rrPath(x, y, s, s, s * 0.3);
          case "extra-rounded": return rrPath(x, y, s, s, s * 0.46);
          case "classy": case "leaf": return leafPath(x, y, s);
          case "diamond": return diamondPath(x, y, s);
          case "triangle": return trianglePath(x, y, s);
          case "hexagon": return polyPath(cx, cy, s * 0.57, 6, -Math.PI / 2);
          case "star": return starPath(cx, cy, s * 0.58, s * 0.25, 5, -Math.PI / 2);
          case "heart": return heartPath(x, y, s);
          case "plus": return plusPath(x, y, s);
        }
        return null;
      }
      function drawShape(ctx, type, x, y, s) {
        if (type === "square") { ctx.fillRect(x, y, s + 0.5, s + 0.5); return; }
        if (type === "dots" || type === "circle") { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * 0.5, 0, 7); ctx.fill(); return; }
        if (type === "dot") { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * 0.36, 0, 7); ctx.fill(); return; }
        var d = shapeD(type, x, y, s);
        if (d) { ctx.fill(new Path2D(d)); } else { ctx.fillRect(x, y, s + 0.5, s + 0.5); }
      }
      function svgShape(type, x, y, s, fill) {
        if (type === "square") return svgRoundRect(x, y, s, s, 0, fill);
        if (type === "dots" || type === "circle") return svgCircle(x + s / 2, y + s / 2, s * 0.5, fill);
        if (type === "dot") return svgCircle(x + s / 2, y + s / 2, s * 0.36, fill);
        var d = shapeD(type, x, y, s);
        return d ? '<path d="' + d + '" fill="' + fill + '"/>' : svgRoundRect(x, y, s, s, 0, fill);
      }
      function drawDot(ctx, px, py, ms) { drawShape(ctx, state.dot, px, py, ms); }

      function drawEye(ctx, ex, ey, ms, frameStyle, ballStyle, fgStyle, bgStyle) {
        // marco 7x7 (anillo de 1 módulo), hueco 5x5, centro 3x3
        var x = ex * ms, y = ey * ms;
        ctx.fillStyle = fgStyle;
        // outer
        if (frameStyle === "circle") {
          ctx.beginPath(); ctx.arc(x + 3.5 * ms, y + 3.5 * ms, 3.5 * ms, 0, 7); ctx.fill();
        } else {
          roundRect(ctx, x, y, 7 * ms, 7 * ms, frameStyle === "rounded" ? ms * 1.6 : 0); ctx.fill();
        }
        // gap (fondo)
        if (state.transparent) { ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; }
        else ctx.fillStyle = bgStyle;
        if (frameStyle === "circle") {
          ctx.beginPath(); ctx.arc(x + 3.5 * ms, y + 3.5 * ms, 2.5 * ms, 0, 7); ctx.fill();
        } else {
          roundRect(ctx, x + ms, y + ms, 5 * ms, 5 * ms, frameStyle === "rounded" ? ms * 1.0 : 0); ctx.fill();
        }
        if (state.transparent) ctx.restore();
        // ball 3x3
        ctx.fillStyle = fgStyle;
        drawShape(ctx, ballStyle, x + 2 * ms, y + 2 * ms, 3 * ms);
      }

      var currentQR = null;

      function renderToCanvas(qr, canvas, targetPx) {
        var n = qr.size;
        var margin = state.quiet ? 4 : 0;
        var total = n + margin * 2;
        var ms = Math.floor(targetPx / total);
        if (ms < 1) ms = 1;
        var dim = ms * total;
        canvas.width = dim; canvas.height = dim;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, dim, dim);
        var bgStyle = state.bg;
        if (!state.transparent) { ctx.fillStyle = state.bg; ctx.fillRect(0, 0, dim, dim); }
        ctx.translate(margin * ms, margin * ms);

        var fgStyle = makeFgStyle(ctx, 0, 0, n * ms);
        var eyeStyle = state.eyeColorOn ? state.eyeColor : fgStyle;

        // datos (sin ojos)
        ctx.fillStyle = fgStyle;
        for (var y = 0; y < n; y++)for (var x = 0; x < n; x++) {
          if (isFinder(x, y, n)) continue;
          if (!qr.getModule(x, y)) continue;
          if (qr.isFunctionModule(x, y)) ctx.fillRect(x * ms, y * ms, ms + 0.5, ms + 0.5); // timing/alineación sólidos
          else drawDot(ctx, x * ms, y * ms, ms);
        }
        // ojos
        drawEye(ctx, 0, 0, ms, state.eyeFrame, state.eyeBall, eyeStyle, bgStyle);
        drawEye(ctx, n - 7, 0, ms, state.eyeFrame, state.eyeBall, eyeStyle, bgStyle);
        drawEye(ctx, 0, n - 7, ms, state.eyeFrame, state.eyeBall, eyeStyle, bgStyle);

        // logo
        if (state.logo) {
          var ls = (state.logoSize / 100) * n * ms;
          var cx = (n * ms - ls) / 2, cy = (n * ms - ls) / 2;
          var pad = ls * 0.12;
          if (state.logoBg) {
            ctx.fillStyle = state.transparent ? "#ffffff" : state.bg;
            roundRect(ctx, cx - pad, cy - pad, ls + pad * 2, ls + pad * 2, ls * 0.18); ctx.fill();
          }
          ctx.drawImage(state.logo, cx, cy, ls, ls);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // ====================== MARCO (frame) ======================
      function contrast(hex) {
        hex = (hex || "#000").replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
        var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#101728" : "#ffffff";
      }
      function frameLayout(q) {
        var s = state.frameStyle, pad = q * 0.05, labelH = q * 0.17;
        if (s === "bottom" || s === "rounded") { var r = (s === "rounded") ? q * 0.1 : q * 0.05; return { type: s, outW: q + 2 * pad, outH: pad + q + labelH, qrX: pad, qrY: pad, r: r, labelY: pad + q, labelH: labelH }; }
        if (s === "top") return { type: s, outW: q + 2 * pad, outH: labelH + q + pad, qrX: pad, qrY: labelH, r: q * 0.05, labelY: 0, labelH: labelH };
        if (s === "border") { var bw = Math.max(3, q * 0.035), p = bw + q * 0.03, boxH = q + 2 * p; return { type: s, outW: q + 2 * p, outH: boxH + labelH * 0.45, qrX: p, qrY: p, r: q * 0.06, bw: bw, boxH: boxH, labelH: labelH }; }
        if (s === "phone") { var padX = q * 0.09, bt = q * 0.14, bb = q * 0.2; return { type: s, outW: q + 2 * padX, outH: bt + q + bb, qrX: padX, qrY: bt, r: q * 0.13, bt: bt, bb: bb, labelH: bb }; }
        return { type: "none", outW: q, outH: q, qrX: 0, qrY: 0 };
      }
      function applyFrame(qrCanvas) {
        var L = frameLayout(qrCanvas.width);
        if (L.type === "none") return qrCanvas;
        var q = qrCanvas.width, col = state.frameColor, txt = state.frameText || "";
        var c = document.createElement("canvas");
        c.width = Math.round(L.outW); c.height = Math.round(L.outH);
        var ctx = c.getContext("2d"), fs;
        if (L.type === "bottom" || L.type === "top" || L.type === "rounded") {
          ctx.fillStyle = col; roundRect(ctx, 0, 0, L.outW, L.outH, L.r); ctx.fill();
          ctx.fillStyle = "#ffffff"; roundRect(ctx, L.qrX, L.qrY, q, q, L.type === "rounded" ? L.r * 0.6 : Math.max(2, q * 0.02)); ctx.fill();
          ctx.drawImage(qrCanvas, L.qrX, L.qrY);
          fs = L.labelH * 0.46;
          ctx.fillStyle = contrast(col); ctx.font = "bold " + fs + "px " + state.frameFont;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(txt, L.outW / 2, L.labelY + L.labelH / 2);
        } else if (L.type === "border") {
          ctx.fillStyle = "#ffffff"; roundRect(ctx, L.qrX - L.bw * 0.5, L.qrY - L.bw * 0.5, q + L.bw, q + L.bw, L.r); ctx.fill();
          ctx.drawImage(qrCanvas, L.qrX, L.qrY);
          ctx.strokeStyle = col; ctx.lineWidth = L.bw; roundRect(ctx, L.bw / 2, L.bw / 2, L.outW - L.bw, L.boxH - L.bw, L.r); ctx.stroke();
          fs = L.labelH * 0.46; ctx.font = "bold " + fs + "px " + state.frameFont;
          var tw = ctx.measureText(txt).width, tagW = tw + fs * 1.6, tagH = L.labelH * 0.82, tagX = (L.outW - tagW) / 2, tagY = L.boxH - tagH / 2;
          ctx.fillStyle = col; roundRect(ctx, tagX, tagY, tagW, tagH, tagH / 2); ctx.fill();
          ctx.fillStyle = contrast(col); ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(txt, L.outW / 2, tagY + tagH / 2);
        } else if (L.type === "phone") {
          ctx.fillStyle = col; roundRect(ctx, 0, 0, L.outW, L.outH, L.r); ctx.fill();
          var scrX = L.outW * 0.06, scrY = L.bt * 0.62, scrW = L.outW - 2 * scrX, scrH = L.outH - scrY - L.bb * 0.32;
          ctx.fillStyle = "#ffffff"; roundRect(ctx, scrX, scrY, scrW, scrH, q * 0.05); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.5)"; roundRect(ctx, (L.outW - q * 0.16) / 2, L.bt * 0.3, q * 0.16, Math.max(2, q * 0.022), q * 0.012); ctx.fill();
          ctx.drawImage(qrCanvas, L.qrX, L.qrY);
          fs = L.bb * 0.3; ctx.fillStyle = col; ctx.font = "bold " + fs + "px " + state.frameFont;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(txt, L.outW / 2, L.qrY + q + (scrY + scrH - (L.qrY + q)) / 2);
        }
        return c;
      }

      function render() {
        var err = $("errMsg"); err.textContent = "";
        var data = buildData();
        var canvas = $("preview");
        if (!data) {
          var c = canvas.getContext("2d"); canvas.width = 600; canvas.height = 600;
          c.clearRect(0, 0, 600, 600); c.fillStyle = "#f2f4f8"; c.fillRect(0, 0, 600, 600);
          c.fillStyle = "#aab4c2"; c.font = "22px sans-serif"; c.textAlign = "center";
          c.fillText("Introduce el contenido →", 300, 300);
          currentQR = null; return;
        }
        try {
          currentQR = window.QREngine.encodeText(data, state.ecc);
          var qrC = document.createElement("canvas");
          renderToCanvas(currentQR, qrC, state.frameStyle === "none" ? 600 : 520);
          var full = applyFrame(qrC);
          canvas.width = full.width; canvas.height = full.height;
          var pc = canvas.getContext("2d"); pc.clearRect(0, 0, full.width, full.height);
          pc.drawImage(full, 0, 0);
        } catch (e) {
          err.textContent = e.message || "No se pudo generar el QR.";
          currentQR = null;
        }
      }

      // ====================== SVG EXPORT ======================
      function svgRoundRect(x, y, w, h, r, fill) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="' + f(r) + '" ry="' + f(r) + '" fill="' + fill + '"/>'; }
      function svgCircle(cx, cy, r, fill) { return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="' + fill + '"/>'; }
      function f(v) { return Math.round(v * 1000) / 1000; }

      function buildSVG(qr) {
        var n = qr.size, ms = 10, margin = state.quiet ? 4 : 0, total = n + margin * 2, dim = total * ms, o = margin * ms;
        var fgRef, eyeRef, defs = "";
        if (state.grad) {
          var coords;
          if (state.gradDir === "horiz") coords = 'x1="0" y1="0" x2="1" y2="0"';
          else if (state.gradDir === "vert") coords = 'x1="0" y1="0" x2="0" y2="1"';
          else coords = 'x1="0" y1="0" x2="1" y2="1"';
          if (state.gradDir === "radial")
            defs = '<radialGradient id="fgGrad"><stop offset="0" stop-color="' + state.fg + '"/><stop offset="1" stop-color="' + state.fg2 + '"/></radialGradient>';
          else
            defs = '<linearGradient id="fgGrad" ' + coords + '><stop offset="0" stop-color="' + state.fg + '"/><stop offset="1" stop-color="' + state.fg2 + '"/></linearGradient>';
          fgRef = "url(#fgGrad)";
          eyeRef = state.eyeColorOn ? state.eyeColor : fgRef;
        } else { fgRef = state.fg; eyeRef = state.eyeColorOn ? state.eyeColor : fgRef; }

        // ---- contenido del QR (coordenadas 0..dim) ----
        var inner = "";
        if (!state.transparent) inner += '<rect width="' + dim + '" height="' + dim + '" fill="' + state.bg + '"/>';
        for (var y = 0; y < n; y++)for (var x = 0; x < n; x++) {
          if (isFinder(x, y, n)) continue;
          if (!qr.getModule(x, y)) continue;
          var px = o + x * ms, py = o + y * ms;
          if (qr.isFunctionModule(x, y)) { inner += svgRoundRect(px, py, ms, ms, 0, fgRef); continue; }
          inner += svgShape(state.dot, px, py, ms, fgRef);
        }
        inner += svgEye(o, 0, 0, ms, fgRef, eyeRef);
        inner += svgEye(o, n - 7, 0, ms, fgRef, eyeRef);
        inner += svgEye(o, 0, n - 7, ms, fgRef, eyeRef);
        if (state.logo) {
          var ls = (state.logoSize / 100) * n * ms, cx = o + (n * ms - ls) / 2, cy = o + (n * ms - ls) / 2, pad = ls * 0.12;
          if (state.logoBg) inner += svgRoundRect(cx - pad, cy - pad, ls + pad * 2, ls + pad * 2, ls * 0.18, state.transparent ? "#ffffff" : state.bg);
          inner += '<image x="' + f(cx) + '" y="' + f(cy) + '" width="' + f(ls) + '" height="' + f(ls) + '" href="' + state.logo.src + '"/>';
        }

        var L = frameLayout(dim);
        if (L.type === "none") {
          return '<svg xmlns="http://www.w3.org/2000/svg" width="' + dim + '" height="' + dim + '" viewBox="0 0 ' + dim + ' ' + dim + '">' + (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
        }

        // ---- con marco ----
        var col = state.frameColor, txt = htmlEsc(state.frameText || ""), tc = contrast(col);
        var ff = (state.frameFont || "sans-serif").replace(/"/g, "'");
        var qg = '<g transform="translate(' + f(L.qrX) + ' ' + f(L.qrY) + ')">' + inner + '</g>';
        function txtEl(cx2, cy2, size, fill) { return '<text x="' + f(cx2) + '" y="' + f(cy2) + '" font-family="' + ff + '" font-weight="bold" font-size="' + f(size) + '" fill="' + fill + '" text-anchor="middle" dominant-baseline="central">' + txt + '</text>'; }
        var out = '<svg xmlns="http://www.w3.org/2000/svg" width="' + f(L.outW) + '" height="' + f(L.outH) + '" viewBox="0 0 ' + f(L.outW) + ' ' + f(L.outH) + '">';
        if (defs) out += '<defs>' + defs + '</defs>';
        var fs;
        if (L.type === "bottom" || L.type === "top" || L.type === "rounded") {
          out += svgRoundRect(0, 0, L.outW, L.outH, L.r, col);
          out += svgRoundRect(L.qrX, L.qrY, dim, dim, L.type === "rounded" ? L.r * 0.6 : dim * 0.02, "#ffffff");
          out += qg;
          fs = L.labelH * 0.46; out += txtEl(L.outW / 2, L.labelY + L.labelH / 2, fs, tc);
        } else if (L.type === "border") {
          out += svgRoundRect(L.qrX - L.bw * 0.5, L.qrY - L.bw * 0.5, dim + L.bw, dim + L.bw, L.r, "#ffffff");
          out += qg;
          out += '<rect x="' + f(L.bw / 2) + '" y="' + f(L.bw / 2) + '" width="' + f(L.outW - L.bw) + '" height="' + f(L.boxH - L.bw) + '" rx="' + f(L.r) + '" ry="' + f(L.r) + '" fill="none" stroke="' + col + '" stroke-width="' + f(L.bw) + '"/>';
          fs = L.labelH * 0.46;
          var tw = (state.frameText || "").length * fs * 0.6, tagW = tw + fs * 1.6, tagH = L.labelH * 0.82, tagX = (L.outW - tagW) / 2, tagY = L.boxH - tagH / 2;
          out += svgRoundRect(tagX, tagY, tagW, tagH, tagH / 2, col);
          out += txtEl(L.outW / 2, tagY + tagH / 2, fs, tc);
        } else if (L.type === "phone") {
          out += svgRoundRect(0, 0, L.outW, L.outH, L.r, col);
          var scrX = L.outW * 0.06, scrY = L.bt * 0.62, scrW = L.outW - 2 * scrX, scrH = L.outH - scrY - L.bb * 0.32;
          out += svgRoundRect(scrX, scrY, scrW, scrH, dim * 0.05, "#ffffff");
          out += svgRoundRect((L.outW - dim * 0.16) / 2, L.bt * 0.3, dim * 0.16, Math.max(2, dim * 0.022), dim * 0.012, "rgba(255,255,255,0.5)");
          out += qg;
          fs = L.bb * 0.3; out += txtEl(L.outW / 2, L.qrY + dim + (scrY + scrH - (L.qrY + dim)) / 2, fs, col);
        }
        out += '</svg>';
        return out;
      }

      function svgEye(o, ex, ey, ms, fg, eye) {
        var x = o + ex * ms, y = o + ey * ms, bg = state.transparent ? "#ffffff" : state.bg, out = "";
        var bgFill = state.transparent ? null : bg;
        if (state.eyeFrame === "circle") {
          out += svgCircle(x + 3.5 * ms, y + 3.5 * ms, 3.5 * ms, eye);
          if (bgFill) out += svgCircle(x + 3.5 * ms, y + 3.5 * ms, 2.5 * ms, bgFill);
          else out += svgCircle(x + 3.5 * ms, y + 3.5 * ms, 2.5 * ms, bg);
        } else {
          var r = state.eyeFrame === "rounded" ? ms * 1.6 : 0;
          out += svgRoundRect(x, y, 7 * ms, 7 * ms, r, eye);
          out += svgRoundRect(x + ms, y + ms, 5 * ms, 5 * ms, state.eyeFrame === "rounded" ? ms * 1.0 : 0, bg);
        }
        out += svgShape(state.eyeBall, x + 2 * ms, y + 2 * ms, 3 * ms, eye);
        return out;
      }

      // ====================== DESCARGAS ======================
      function safeName() { return "qr-" + state.type + "-" + Date.now(); }
      $("dlPng").onclick = function () {
        if (!currentQR) { flash("Primero introduce el contenido."); return; }
        var size = +$("dlSize").value;
        var tmp = document.createElement("canvas");
        renderToCanvas(currentQR, tmp, size);
        var full = applyFrame(tmp);
        var a = document.createElement("a");
        a.href = full.toDataURL("image/png");
        a.download = safeName() + ".png"; a.click();
      };
      $("dlSvg").onclick = function () {
        if (!currentQR) { flash("Primero introduce el contenido."); return; }
        var svg = buildSVG(currentQR);
        var blob = new Blob([svg], { type: "image/svg+xml" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = safeName() + ".svg"; a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      };
      $("copyBtn").onclick = function () {
        if (!currentQR) { flash("Primero introduce el contenido."); return; }
        var tmp = document.createElement("canvas");
        renderToCanvas(currentQR, tmp, 1024);
        tmp = applyFrame(tmp);
        tmp.toBlob(function (blob) {
          if (navigator.clipboard && window.ClipboardItem) {
            navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(
              function () { flash("¡Copiado al portapapeles!", true); },
              function () { flash("No se pudo copiar; usa Descargar PNG."); }
            );
          } else flash("Tu navegador no permite copiar; usa Descargar.");
        });
      };
      function flash(msg, ok) { var e = $("errMsg"); e.textContent = msg; e.style.color = ok ? "var(--ok)" : "#ff7b72"; setTimeout(function () { e.textContent = ""; e.style.color = "#ff7b72"; }, 2500); }

      // ====================== COMPROBADOR DE ESCANEABILIDAD ======================
      $("checkBtn").onclick = function () {
        var box = $("checkResult");
        if (!currentQR) { box.className = "check-result bad"; box.textContent = "Primero introduce el contenido."; return; }
        if (typeof jsQR !== "function") { box.className = "check-result bad"; box.textContent = "Lector no disponible."; return; }
        box.className = "check-result"; box.textContent = "Comprobando…";
        setTimeout(function () {
          var data = buildData();
          // Render del QR real (con colores, formas y logo) a un canvas
          var c = document.createElement("canvas");
          renderToCanvas(currentQR, c, 600);
          var ctx = c.getContext("2d");
          var img = ctx.getImageData(0, 0, c.width, c.height);
          var res = null;
          try { res = jsQR(img.data, c.width, c.height); } catch (e) { }
          var ok = res && res.data === data;
          // Métrica de contraste fg/bg
          var contrastInfo = contrastReport();
          if (ok) {
            box.className = "check-result good";
            box.innerHTML = "✓ Escanea correctamente" + (contrastInfo.warn ? " · " + contrastInfo.msg : "");
          } else {
            box.className = "check-result bad";
            box.innerHTML = "✗ Difícil de escanear. " + (contrastInfo.warn ? contrastInfo.msg : "Prueba más contraste, menos logo o corrección de errores alta (H).");
          }
        }, 30);
      };
      function relLum(hex) {
        hex = (hex || "#000").replace("#", ""); if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
        var f = [0, 2, 4].map(function (i) { var v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
      }
      function contrastReport() {
        var l1 = relLum(state.fg), l2 = relLum(state.transparent ? "#ffffff" : state.bg);
        var ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (ratio < 3) return { warn: true, msg: "contraste muy bajo (" + ratio.toFixed(1) + ":1), oscurece el color principal." };
        if (ratio < 4.5) return { warn: true, msg: "contraste justo (" + ratio.toFixed(1) + ":1)." };
        return { warn: false, msg: "" };
      }

      // ----- App Store / PDF: alternar cajas según modo -----
      $("app_mode").onchange = function () { $("app_smart_box").style.display = this.value === "smart" ? "block" : "none"; render(); };
      $("pdf_mode").onchange = function () { $("pdf_cover_box").style.display = this.value === "cover" ? "block" : "none"; render(); };

      function downloadHtml(name, html) {
        var blob = new Blob([html], { type: "text/html;charset=utf-8" });
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      }
      function htmlEsc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

      // ----- Generar página inteligente de App Store -----
      $("genAppPage").onclick = function () {
        var name = $("app_name").value || "Nuestra app";
        var ios = $("app_ios").value.trim(), and = $("app_android").value.trim();
        if (!ios && !and) { flash("Añade al menos un enlace de tienda."); return; }
        var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>' + htmlEsc(name) + '</title><style>' +
          'body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:linear-gradient(160deg,#0e1116,#1b2330);color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}' +
          '.card{max-width:360px;text-align:center;background:#1c232d;border:1px solid #2b333f;border-radius:20px;padding:32px 26px;box-shadow:0 20px 60px rgba(0,0,0,.4)}' +
          'h1{font-size:24px;margin:0 0 10px}p{color:#8b98a8;font-size:15px;margin:0 0 22px}' +
          'a.btn{display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;color:#fff;background:#000;border:1px solid #333;border-radius:12px;padding:14px;margin:10px 0;font-weight:600;font-size:15px}' +
          'a.btn.gp{background:#0f9d58}a.btn:hover{filter:brightness(1.15)}</style></head><body><div class="card">' +
          '<h1>' + htmlEsc(name) + '</h1><p>Descarga la aplicación en tu tienda</p>' +
          (ios ? '<a class="btn" id="ios" href="' + htmlEsc(ios) + '">  App Store (iOS)</a>' : '') +
          (and ? '<a class="btn gp" id="and" href="' + htmlEsc(and) + '">▶ Google Play (Android)</a>' : '') +
          '</div><script>(function(){var ua=navigator.userAgent||"";var ios=' + JSON.stringify(ios) + ',and=' + JSON.stringify(and) + ';' +
          'if(/iPhone|iPad|iPod/i.test(ua)&&ios)location.href=ios;else if(/Android/i.test(ua)&&and)location.href=and;})();<\/script></body></html>';
        downloadHtml("app.html", html);
        flash("Página descargada: súbela a tu web y pega su URL arriba.", true);
      };

      // ----- Generar página de portada de PDF -----
      $("genPdfPage").onclick = function () {
        var title = $("pdf_title").value || "Documento PDF";
        var desc = $("pdf_desc").value || "";
        var url = $("pdf_url").value.trim();
        if (!url) { flash("Indica primero la URL del PDF."); return; }
        var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>' + htmlEsc(title) + '</title><style>' +
          'body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:linear-gradient(160deg,#0e1116,#1b2330);color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}' +
          '.card{max-width:380px;text-align:center;background:#1c232d;border:1px solid #2b333f;border-radius:20px;padding:34px 28px;box-shadow:0 20px 60px rgba(0,0,0,.4)}' +
          '.ic{font-size:46px}h1{font-size:23px;margin:14px 0 8px}p{color:#8b98a8;font-size:15px;margin:0 0 24px}' +
          'a.btn{display:inline-block;text-decoration:none;color:#fff;background:linear-gradient(135deg,#6d8cff,#9d7bff);border-radius:12px;padding:14px 30px;font-weight:700;font-size:16px}a.btn:hover{filter:brightness(1.1)}</style></head><body>' +
          '<div class="card"><div class="ic">📄</div><h1>' + htmlEsc(title) + '</h1><p>' + htmlEsc(desc) + '</p>' +
          '<a class="btn" href="' + htmlEsc(url) + '" target="_blank" rel="noopener">Ver PDF</a></div></body></html>';
        downloadHtml("pdf.html", html);
        flash("Portada descargada: súbela a tu web y pega su URL arriba.", true);
      };

      // ====================== ZIP (almacenamiento, sin dependencias) ======================
      var CRC_TABLE = (function () {
        var t = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++)c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t;
      })();
      function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++)c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
      function strBytes(s) { var b = []; for (var i = 0; i < s.length; i++)b.push(s.charCodeAt(i) & 0xFF); return b; }
      function makeZip(files) { // files: [{name, bytes(Uint8Array)}]
        var chunks = [], central = [], offset = 0;
        function u16(n) { return [n & 0xFF, (n >>> 8) & 0xFF]; }
        function u32(n) { return [n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF]; }
        files.forEach(function (f) {
          var name = strBytes(f.name), data = f.bytes, crc = crc32(data), len = data.length;
          var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(len), u32(len), u16(name.length), u16(0), name);
          chunks.push(new Uint8Array(local)); chunks.push(data);
          central.push([].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(len), u32(len), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name));
          offset += local.length + len;
        });
        var cstart = offset, cbytes = [];
        central.forEach(function (c) { cbytes = cbytes.concat(c); offset += c.length; });
        var end = [].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(offset - cstart), u32(cstart), u16(0));
        chunks.push(new Uint8Array(cbytes)); chunks.push(new Uint8Array(end));
        return new Blob(chunks, { type: "application/zip" });
      }
      function dataURLtoBytes(durl) { var b = atob(durl.split(",")[1]); var a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++)a[i] = b.charCodeAt(i); return a; }

      // ====================== GENERACIÓN POR LOTES ======================
      function updateBatchCount() { var n = batchEntries().length; $("batch_count").textContent = n + (n === 1 ? " entrada" : " entradas"); }
      $("batch_list").addEventListener("input", updateBatchCount);
      $("batch_type").addEventListener("change", function () { render(); updateBatchCount(); });
      $("batch_csv_btn").onclick = function () { $("batch_csv").click(); };
      $("batch_csv").onchange = function () {
        var f = this.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          var txt = String(r.result).replace(/[",;]+/g, "\n");
          var cur = $("batch_list").value.trim();
          $("batch_list").value = (cur ? cur + "\n" : "") + txt;
          updateBatchCount(); render();
        };
        r.readAsText(f); this.value = "";
      };
      $("batch_zip").onclick = function () {
        var entries = batchEntries();
        if (!entries.length) { flash("Añade al menos una entrada al lote."); return; }
        if (entries.length > 500) { flash("Máximo 500 por lote."); return; }
        var size = +$("dlSize").value || 1024;
        var btn = $("batch_zip"), oldTxt = btn.textContent; btn.disabled = true;
        var files = [], pad = String(entries.length).length;
        var i = 0;
        function step() {
          var end = Math.min(i + 8, entries.length);
          for (; i < end; i++) {
            try {
              var qr = window.QREngine.encodeText(entries[i], state.ecc);
              var c = document.createElement("canvas");
              renderToCanvas(qr, c, size);
              var full = applyFrame(c);
              var num = String(i + 1); while (num.length < pad) num = "0" + num;
              files.push({ name: "qr-" + num + ".png", bytes: dataURLtoBytes(full.toDataURL("image/png")) });
            } catch (e) { /* salta entradas demasiado largas */ }
          }
          btn.textContent = "Generando… " + i + "/" + entries.length;
          if (i < entries.length) { setTimeout(step, 0); return; }
          var blob = makeZip(files);
          var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
          a.download = "qr-lote-" + Date.now() + ".zip"; a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
          btn.disabled = false; btn.textContent = oldTxt;
          flash("ZIP con " + files.length + " QR descargado.", true);
        }
        step();
      };

      // ====================== LECTOR DE QR ======================
      var readStream = null;
      function stopCamera() { if (readStream) { readStream.getTracks().forEach(function (t) { t.stop(); }); readStream = null; } var v = $("read_video"); v.style.display = "none"; }
      function showReadResult(text) {
        $("read_out").style.display = "block";
        $("read_text").value = text;
        var open = $("read_open");
        if (/^(https?:\/\/|mailto:|tel:|wifi:)/i.test(text)) { open.style.display = "inline-flex"; open.href = text; }
        else open.style.display = "none";
      }
      function scanLoop() {
        var v = $("read_video"); if (!readStream) return;
        if (v.readyState === v.HAVE_ENOUGH_DATA) {
          var c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
          var ctx = c.getContext("2d"); ctx.drawImage(v, 0, 0, c.width, c.height);
          try {
            var img = ctx.getImageData(0, 0, c.width, c.height);
            var res = jsQR(img.data, c.width, c.height);
            if (res && res.data) { showReadResult(res.data); stopCamera(); flash("QR leído.", true); return; }
          } catch (e) { }
        }
        requestAnimationFrame(scanLoop);
      }
      $("read_cam").onclick = function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { flash("Tu navegador no permite la cámara aquí; usa 'Subir imagen'."); return; }
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (s) {
          readStream = s; var v = $("read_video"); v.srcObject = s; v.setAttribute("muted", ""); v.play(); v.style.display = "block";
          requestAnimationFrame(scanLoop);
        }).catch(function () { flash("No se pudo abrir la cámara; usa 'Subir imagen'."); });
      };
      $("read_img_btn").onclick = function () { $("read_img").click(); };
      $("read_img").onchange = function () {
        var f = this.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          var im = new Image();
          im.onload = function () {
            var c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
            var ctx = c.getContext("2d"); ctx.drawImage(im, 0, 0);
            try {
              var d = ctx.getImageData(0, 0, c.width, c.height);
              var res = jsQR(d.data, c.width, c.height);
              if (res && res.data) { showReadResult(res.data); flash("QR leído.", true); }
              else { flash("No se detectó ningún QR en la imagen."); }
            } catch (e) { flash("No se pudo leer la imagen."); }
          };
          im.src = r.result;
        };
        r.readAsDataURL(f); this.value = "";
      };
      $("read_copy").onclick = function () {
        var t = $("read_text").value; if (!t) return;
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { flash("Copiado.", true); }, function () { });
      };
      // Al cambiar de pestaña, apaga la cámara si estaba activa
      document.querySelectorAll(".tab").forEach(function (b) { b.addEventListener("click", function () { if (state.type !== "read") stopCamera(); }); });

      // ====================== HISTORIAL Y PLANTILLAS PROPIAS ======================
      var DESIGN_KEYS = ["fg", "bg", "transparent", "grad", "fg2", "gradDir", "dot", "eyeFrame", "eyeBall",
        "eyeColorOn", "eyeColor", "ecc", "quiet", "logoSize", "logoBg", "frameStyle", "frameText", "frameFont", "frameColor"];
      function pickDesign() { var d = {}; DESIGN_KEYS.forEach(function (k) { d[k] = state[k]; }); return d; }
      function applyDesign(d) {
        DESIGN_KEYS.forEach(function (k) { if (d[k] !== undefined) state[k] = d[k]; });
        $("fgColor").value = state.fg; $("fgColorTxt").value = state.fg;
        $("bgColor").value = state.bg; $("bgColorTxt").value = state.bg;
        $("transparentBg").checked = state.transparent;
        $("gradOn").checked = state.grad; $("gradControls").style.display = state.grad ? "block" : "none";
        $("fgColor2").value = state.fg2; $("fgColor2Txt").value = state.fg2; $("gradDir").value = state.gradDir;
        $("eyeColorOn").checked = state.eyeColorOn; $("eyeColorWrap").style.display = state.eyeColorOn ? "block" : "none";
        $("eyeColor").value = state.eyeColor; $("eyeColorTxt").value = state.eyeColor;
        $("eccLevel").value = state.ecc; $("quietZone").checked = state.quiet;
        $("logoSize").value = state.logoSize; $("logoSizeVal").textContent = state.logoSize + "%"; $("logoBg").checked = state.logoBg;
        $("frameText").value = state.frameText; $("frameFont").value = state.frameFont;
        $("frameColor").value = state.frameColor; $("frameColorTxt").value = state.frameColor;
        setSeg("dotStyle", state.dot); setSeg("eyeFrame", state.eyeFrame); setSeg("eyeBall", state.eyeBall); setSeg("frameStyle", state.frameStyle);
      }
      function swatchCss(d) { return d.grad ? "linear-gradient(135deg," + d.fg + "," + (d.fg2 || d.fg) + ")" : d.fg; }
      function lsGet(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
      function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

      function renderPresets() {
        var list = lsGet("qrstudio_presets", []), el = $("presetList");
        el.innerHTML = "";
        if (!list.length) { el.innerHTML = '<div class="saved-empty">Aún no has guardado diseños.</div>'; return; }
        list.forEach(function (p, idx) {
          var it = document.createElement("div"); it.className = "saved-item";
          it.innerHTML = '<span class="sw" style="background:' + swatchCss(p.design) + '"></span><span class="nm"></span><button class="del" title="Eliminar">×</button>';
          it.querySelector(".nm").textContent = p.name;
          it.onclick = function (e) { if (e.target.classList.contains("del")) return; applyDesign(p.design); render(); flash("Diseño aplicado.", true); };
          it.querySelector(".del").onclick = function () { var l = lsGet("qrstudio_presets", []); l.splice(idx, 1); lsSet("qrstudio_presets", l); renderPresets(); };
          el.appendChild(it);
        });
      }
      $("presetSave").onclick = function () {
        var name = ($("presetName").value || "").trim() || ("Diseño " + (lsGet("qrstudio_presets", []).length + 1));
        var l = lsGet("qrstudio_presets", []); l.unshift({ name: name, design: pickDesign() });
        if (l.length > 30) l = l.slice(0, 30);
        lsSet("qrstudio_presets", l); $("presetName").value = ""; renderPresets(); flash("Diseño guardado.", true);
      };
      $("cfgExport").onclick = function () {
        var cfg = { presets: lsGet("qrstudio_presets", []), current: pickDesign() };
        var blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrstudio-config.json"; a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      };
      $("cfgImportBtn").onclick = function () { $("cfgFile").click(); };
      $("cfgFile").onchange = function () {
        var f = this.files[0]; if (!f) return; var r = new FileReader();
        r.onload = function () {
          try {
            var cfg = JSON.parse(r.result);
            if (cfg.presets) lsSet("qrstudio_presets", cfg.presets);
            if (cfg.current) { applyDesign(cfg.current); render(); }
            renderPresets(); flash("Configuración importada.", true);
          } catch (e) { flash("Archivo no válido."); }
        };
        r.readAsText(f); this.value = "";
      };

      function recordHistory() {
        var data = buildData(); if (!data) return;
        var fields = {};
        document.querySelectorAll(".field-group input, .field-group textarea, .field-group select").forEach(function (el) { if (el.id) fields[el.id] = el.value; });
        var l = lsGet("qrstudio_history", []);
        l.unshift({ type: state.type, fields: fields, design: pickDesign(), label: data.slice(0, 48), ts: Date.now() });
        if (l.length > 15) l = l.slice(0, 15);
        lsSet("qrstudio_history", l); renderHistory();
      }
      function renderHistory() {
        var list = lsGet("qrstudio_history", []), el = $("historyList");
        el.innerHTML = "";
        if (!list.length) { el.innerHTML = '<div class="saved-empty">Tus descargas aparecerán aquí.</div>'; return; }
        list.forEach(function (h) {
          var it = document.createElement("div"); it.className = "saved-item";
          it.innerHTML = '<span class="sw" style="background:' + swatchCss(h.design) + '"></span><span class="nm"></span>';
          it.querySelector(".nm").textContent = h.label || h.type;
          it.onclick = function () {
            // restaura tipo, campos y diseño
            var tab = Array.prototype.find.call(document.querySelectorAll(".tab"), function (b) { return b.textContent.trim().toLowerCase().indexOf(({ url: "url", text: "texto", wifi: "wifi", vcard: "contacto", email: "email", phone: "teléfono", sms: "sms", geo: "ubicación", social: "redes", app: "tienda", pdf: "pdf", batch: "lote", read: "leer" }[h.type] || h.type)) >= 0; });
            if (tab) tab.click();
            Object.keys(h.fields).forEach(function (id) { var e = $(id); if (e) e.value = h.fields[id]; });
            applyDesign(h.design); render(); flash("Restaurado del historial.", true);
          };
          el.appendChild(it);
        });
      }
      $("historyClear").onclick = function () { lsSet("qrstudio_history", []); renderHistory(); };

      // Registrar en historial al descargar
      var _dlPng = $("dlPng").onclick; $("dlPng").onclick = function () { _dlPng(); recordHistory(); };
      var _dlSvg = $("dlSvg").onclick; $("dlSvg").onclick = function () { _dlSvg(); recordHistory(); };

      renderPresets(); renderHistory();

      // valor de demo inicial
      $("url_value").value = "https://";
      updateBatchCount();
      render();
    })();
