// Owner Posts – loaded dynamically from data/posts.json
// Images are stored in images/updates/ on GitHub and served via Netlify CDN.

const REPO_OWNER = 'abdigeleto';
const REPO_NAME = 'ethiohomes';
const BRANCH = 'main';

$(document).ready(function () {
    const postsContainer = $('#posts-container');
    if (!postsContainer.length) return;

    fetch(`data/posts.json?t=${Date.now()}`)
        .then(r => r.json())
        .then(posts => {
            if (!posts || !posts.length) {
                postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
                return;
            }

            // Show newest first
            const sorted = [...posts].reverse();

            sorted.forEach(post => {
                const images = post.images || [];

                // Build image display: first image large, rest in a small strip
                let imagesHtml = '';
                if (images.length === 1) {
                    imagesHtml = `
                        <a href="${imgUrl(images[0])}" class="fancybox" rel="post-${post.id}">
                            <img src="${imgUrl(images[0])}" alt="${escHtml(post.title)}" class="post-image">
                        </a>`;
                } else {
                    imagesHtml = `
                        <div class="post-image-grid">
                            ${images.map((img, i) => `
                                <a href="${imgUrl(img)}" class="fancybox post-grid-img" rel="post-${post.id}">
                                    <img src="${imgUrl(img)}" alt="${escHtml(post.title)} photo ${i + 1}">
                                    ${i === 2 && images.length > 3 ? `<div class="grid-more">+${images.length - 3}</div>` : ''}
                                </a>
                            `).slice(0, 4).join('')}
                        </div>`;
                }

                const date = post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

                const postHtml = `
                    <div class="col-md-6 mb-4">
                        <div class="owner-post-card">
                            ${imagesHtml}
                            <div class="post-content">
                                ${date ? `<span class="post-date"><i class="fa fa-calendar-days"></i> ${date}</span>` : ''}
                                <h4>${escHtml(post.title)}</h4>
                                <p>${escHtml(post.description)}</p>
                            </div>
                        </div>
                    </div>`;
                postsContainer.append(postHtml);
            });

            // Activate fancybox on the rendered images
            $('.fancybox').fancybox({
                padding: 0,
                openEffect: 'elastic',
                closeEffect: 'elastic',
                helpers: {
                    overlay: { css: { background: 'rgba(10,25,47,0.85)', 'backdrop-filter': 'blur(12px)' } }
                }
            });
        })
        .catch(() => {
            postsContainer.html('<p style="color:#888;padding:20px;">Could not load updates.</p>');
        });
});

function imgUrl(path) {
    // Serve directly (works on Netlify, or via GitHub raw when browsing locally)
    return path;
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
