(function () {
  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("open");
        document.body.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".faq-q").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (node) { node.classList.add("show"); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (node) { seen.observe(node); });
  }

  if (document.querySelector("[data-latest-apk], [data-release-files], [data-apk-meta]")) {
    fetch("https://api.github.com/repos/VMRcompany/echogram/releases/latest")
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var assets = data.assets || [];
        var tag = data.tag_name || "";
        var apk = null;
        var i;
        for (i = 0; i < assets.length; i++) {
          if (/\.apk$/i.test(assets[i].name) && tag && assets[i].name.indexOf(tag) !== -1) {
            apk = assets[i];
            break;
          }
        }
        if (!apk) {
          for (i = 0; i < assets.length; i++) {
            if (/\.apk$/i.test(assets[i].name)) { apk = assets[i]; break; }
          }
        }
        if (!apk && assets.length) apk = assets[0];
        if (apk) {
          document.querySelectorAll("[data-latest-apk]").forEach(function (node) {
            node.href = apk.browser_download_url;
          });
        }
        document.querySelectorAll("[data-apk-label]").forEach(function (node) {
          node.textContent = tag ? "Скачать " + tag : "Скачать";
        });
        document.querySelectorAll("[data-apk-meta]").forEach(function (node) {
          node.textContent = tag ? "Версия " + tag + " · GitHub Releases" : "GitHub Releases";
        });
        document.querySelectorAll("[data-release-files]").forEach(function (list) {
          list.textContent = "";
          assets.forEach(function (file) {
            var item = document.createElement("li");
            var link = document.createElement("a");
            link.href = file.browser_download_url;
            link.textContent = file.name;
            var size = document.createElement("span");
            var mb = file.size / 1048576;
            size.textContent = mb >= 0.1 ? mb.toFixed(1).replace(".", ",") + " МБ" : "";
            item.appendChild(link);
            if (size.textContent) item.appendChild(size);
            list.appendChild(item);
          });
        });
      })
      .catch(function () {});
  }

  if (window.lottie) {
    document.querySelectorAll("[data-sticker]").forEach(function (el) {
      window.lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: el.getAttribute("data-sticker")
      });
    });
  }
})();
