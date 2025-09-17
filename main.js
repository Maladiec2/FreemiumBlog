/* ===========================
   SAFE ADSENSE HANDLER
   =========================== */
function safeAdPush() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.warn("AdSense not loaded or blocked:", e);
    }
}

/* ===========================
   LOAD POSTS FROM JSON
   =========================== */
let posts = [];

async function loadPosts() {
    try {
        const res = await fetch("posts.json");
        posts = await res.json();
        renderMainPost();
        renderCarousel();
        initCopyButtons();
    } catch (err) {
        console.error("Failed to load posts.json:", err);
    }
}

/* ===========================
   RENDER MAIN POST
   =========================== */
function renderMainPost(index = 0) {
    const currentPostEl = document.getElementById("current-post");
    if (!posts.length) return;

    const post = posts[index];
    currentPostEl.innerHTML = `<h2>${post.title}</h2>${post.content}`;
}

/* ===========================
   RENDER CAROUSEL
   =========================== */
function renderCarousel() {
    const carouselEl = document.getElementById("carousel");
    carouselEl.innerHTML = "";

    posts.slice(1).forEach((post, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h4>${post.title}</h4>${post.preview}`;
        card.addEventListener("click", () => {
            renderMainPost(idx + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        carouselEl.appendChild(card);
    });
}

/* ===========================
   CAROUSEL BUTTONS
   =========================== */
function initCarouselButtons() {
    const carouselEl = document.getElementById("carousel");
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    prevBtn.addEventListener("click", () => {
        const cardWidth = carouselEl.querySelector(".card").offsetWidth + 16;
        carouselEl.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
        const cardWidth = carouselEl.querySelector(".card").offsetWidth + 16;
        carouselEl.scrollBy({ left: cardWidth, behavior: "smooth" });
    });
}

/* ===========================
   THEME SWITCHER
   =========================== */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById("themeToggle");
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") document.body.classList.add("dark");
}

/* ===========================
   COPY BUTTONS
   =========================== */
function initCopyButtons() {
    const buttons = document.querySelectorAll(".copy-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const code = btn.nextElementSibling.innerText;
            navigator.clipboard.writeText(code).then(() => {
                btn.innerText = "Copied!";
                setTimeout(() => (btn.innerText = "Copy"), 1000);
            });
        });
    });
}

/* ===========================
   INIT BLOG
   =========================== */
window.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    initCarouselButtons();
    initThemeSwitcher();
});
