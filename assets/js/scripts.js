    document.getElementById("year").textContent = new Date().getFullYear();

    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    burger?.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileMenu?.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    /* ── Features Carousel (page-based 3×2 grid) ── */
    (function() {
      const track = document.getElementById("featTrack");
      const viewport = document.getElementById("featCarousel");
      const prevBtn = document.getElementById("featPrev");
      const nextBtn = document.getElementById("featNext");
      const dotsContainer = document.getElementById("featDots");
      if (!track || !viewport) return;

      const originalSlides = Array.from(track.querySelectorAll(".carousel-slide"));
      let currentIndex = 0;
      let autoTimer;

      function getPerPage() {
        const w = window.innerWidth;
        if (w <= 520) return 1;
        if (w <= 768) return 4;
        return 6;
      }

      function buildPages() {
        const perPage = getPerPage();
        track.innerHTML = "";
        const numPages = Math.ceil(originalSlides.length / perPage);
        for (let i = 0; i < numPages; i++) {
          const page = document.createElement("div");
          page.className = "carousel-page";
          for (let j = i * perPage; j < Math.min((i + 1) * perPage, originalSlides.length); j++) {
            page.appendChild(originalSlides[j]);
          }
          track.appendChild(page);
        }
      }

      function getMaxIndex() {
        return Math.max(0, track.querySelectorAll(".carousel-page").length - 1);
      }

      function buildDots() {
        dotsContainer.innerHTML = "";
        const max = getMaxIndex();
        for (let i = 0; i <= max; i++) {
          const dot = document.createElement("button");
          dot.className = "carousel-dot" + (i === currentIndex ? " active" : "");
          dot.setAttribute("aria-label", "Go to page " + (i + 1));
          dot.addEventListener("click", () => goTo(i));
          dotsContainer.appendChild(dot);
        }
      }

      function updateButtons() {
        const max = getMaxIndex();
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= max;
      }

      function updateDots() {
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
      }

      function goTo(index) {
        const max = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, max));

        const gap = 14;
        const pageWidth = viewport.offsetWidth;
        const offset = currentIndex * (pageWidth + gap);

        track.style.transform = "translateX(-" + offset + "px)";
        updateButtons();
        updateDots();
        resetAuto();
      }

      function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
          if (currentIndex >= getMaxIndex()) {
            goTo(0);
          } else {
            goTo(currentIndex + 1);
          }
        }, 6000);
      }

      prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
      nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

      // Swipe support
      let startX = 0;
      let dragging = false;
      viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
      viewport.addEventListener("touchend", (e) => {
        if (!dragging) return;
        dragging = false;
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) {
          diff < 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        }
      });

      // Pause auto on hover
      viewport.addEventListener("mouseenter", () => clearInterval(autoTimer));
      viewport.addEventListener("mouseleave", resetAuto);

      function init() {
        buildPages();
        const max = getMaxIndex();
        if (currentIndex > max) currentIndex = max;
        buildDots();
        goTo(currentIndex);
      }

      window.addEventListener("resize", init);
      init();
    })();