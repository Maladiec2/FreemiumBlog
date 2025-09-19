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


/* Load carousel */
function loadCarousel(posts) {
    const carouselEl = document.getElementById("carousel");
    carouselEl.innerHTML = "";
    posts.slice(1).forEach(post => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h4>${post.title}</h4>${post.preview}`;
        card.addEventListener("click", () => {
            loadMainPost(post);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        carouselEl.appendChild(card);
    });
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

/* Initialize */
window.addEventListener("DOMContentLoaded", () => {
    loadPosts().then(() => {
        initCarouselButtons();
        initThemeSwitcher();
    });
});
