let posts = [];

/* Load posts.json */
function loadPosts() {
    return fetch("posts.json")
        .then(res => res.json())
        .then(data => {
            posts = data;
            if (posts.length) {
                loadMainPost(posts[0]);
                loadCarousel(posts);
            }
        })
        .catch(err => console.error("Error loading posts.json:", err));
}

/* Escape HTML for code box */
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* Load main post */
function loadMainPost(post) {
    const currentPostEl = document.getElementById("current-post");
    fetch(post.file)
        .then(res => res.text())
        .then(html => {
            currentPostEl.innerHTML = html; // load raw HTML as-is
        })
        .catch(err => {
            currentPostEl.innerHTML = `<p>Failed to load post: ${err}</p>`;
        });
}

/* Load carousel dynamically */
function loadCarousel(posts) {
    const carouselEl = document.getElementById("carousel");
    carouselEl.innerHTML = "";

    if (!posts.length) return;

    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "card";

        const previewContent = post.preview || `<p>Preview not available</p>`;

        // Add real <a> link for SEO
        card.innerHTML = `
            <a href="${post.file}">
                <h4>${post.title}</h4>
                ${previewContent}
            </a>
        `;

        // Enhance UX: prevent reload and load dynamically
        card.querySelector("a").addEventListener("click", e => {
            e.preventDefault();
            loadMainPost(post);
            window.scrollTo({ top: 0, behavior: "smooth" });
            const newUrl = new URL(post.file, window.location.origin + "/FreemiumBlog/");
            history.pushState(null, "", newUrl);

        });

        carouselEl.appendChild(card);
    });
}


/* Helper to fetch first n characters from HTML file as fallback preview */
function truncateTextFromFile(file, length) {
    let text = "";
    fetch(file)
        .then(res => res.text())
        .then(html => {
            text = html.replace(/<[^>]+>/g, ""); // strip tags
            text = text.slice(0, length) + (text.length > length ? "..." : "");
        })
        .catch(err => {
            text = "Preview not available";
        });
    return `<p>${text}</p>`;
}


/* Copy buttons */
function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.onclick = () => {
            const code = btn.nextElementSibling.innerText;
            navigator.clipboard.writeText(code).then(() => {
                btn.innerText = "Copied!";
                setTimeout(() => btn.innerText = "Copy", 1000);
            });
        };
    });
}

/* Carousel buttons */
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

/* Theme switcher */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById("themeToggle");
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

/* Inject ads from config */
function loadAds() {
    if (typeof AD_CONFIG !== "undefined") {
        const topBanner = document.getElementById("topBannerAd");
        const inlineAd = document.getElementById("inlineAd");
        const sideAd = document.getElementById("sideAd");

        if (topBanner) topBanner.innerHTML += AD_CONFIG.topBanner;
        if (inlineAd) inlineAd.innerHTML += AD_CONFIG.inlineAd;
        if (sideAd) sideAd.innerHTML += AD_CONFIG.sideAd;
    }
}


/* Initialize */
window.addEventListener("DOMContentLoaded", () => {
    loadPosts().then(() => {
        initCarouselButtons();
        initThemeSwitcher();
        loadAds(); // <-- dynamically load ads
    });
});

// Hamburger Menu Toggle
const menuBtn = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");

menuBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("open");   // show/hide side menu
    menuBtn.classList.toggle("open");    // animate bars into X
});
