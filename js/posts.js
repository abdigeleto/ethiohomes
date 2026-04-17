// Owner Posts – fetched live from GitHub API so posts appear instantly after publishing.
// No need to wait for Netlify to redeploy.

const GH_POSTS_URL = 'https://api.github.com/repos/abdigeleto/ethiohomes/contents/data/posts.json?ref=main';
const GH_RAW_BASE = 'https://raw.githubusercontent.com/abdigeleto/ethiohomes/main/';

$(document).ready(function () {
    const postsContainer = $('#posts-container');
    if (!postsContainer.length) return;

    fetch(GH_POSTS_URL, {
        headers: { Accept: 'application/vnd.github.v3+json' }
    })
        .then(r => r.json())
        .then(data => {
            // GitHub API returns base64-encoded content
            const json = atob(data.content.replace(/\n/g, ''));
            const posts = JSON.parse(json);

            if (!posts || !posts.length) {
                postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
                return;
            }

            // Show newest first
            const sorted = [...posts].reverse();

            sorted.forEach(post => {
                const images = post.images || [];

                // Build image HTML — single image or multi-image grid
                let imagesHtml = '';
                if (images.length === 1) {
                    imagesHtml = `
                    <a href="${ghImgUrl(images[0])}" class="fancybox" rel="post-${post.id}">
                        <img src="${ghImgUrl(images[0])}" alt="${escHtml(post.title)}" class="post-image">
                    </a>`;
                } else {
                    // Instagram-style grid: first image tall on left, up to 3 more on right
                    const shown = images.slice(0, 4);
                    const remaining = images.length - 4;
                    imagesHtml = `
                    <div class="post-image-grid">
                        ${shown.map((img, i) => `
                            <a href="${ghImgUrl(img)}" class="fancybox post-grid-img" rel="post-${post.id}">
                                <img src="${ghImgUrl(img)}" alt="${escHtml(post.title)} photo ${i + 1}">
                                ${i === 3 && remaining > 0 ? `<div class="grid-more">+${remaining}</div>` : ''}
                            </a>
                        `).join('')}
                    </div>
                    <!-- Hidden anchors so Fancybox gallery includes all images -->
                    ${images.slice(4).map(img => `<a href="${ghImgUrl(img)}" class="fancybox" rel="post-${post.id}" style="display:none"></a>`).join('')}`;
                }

                const date = post.date
                    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';

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

            // Activate Fancybox on all post images
            if (typeof $.fn.fancybox === 'function') {
                $('.fancybox').fancybox({
                    padding: 0,
                    openEffect: 'elastic',
                    closeEffect: 'elastic',
                    helpers: {
                        overlay: { css: { background: 'rgba(10,25,47,0.85)', 'backdrop-filter': 'blur(12px)' } }
                    }
                });
            }
        })
        .catch(err => {
            console.warn('Could not load posts:', err);
            postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
        });
});

// Always serve images via GitHub raw URL so they appear immediately after publish
function ghImgUrl(path) {
    if (path.startsWith('http')) return path;
    return GH_RAW_BASE + path;
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
