// Owner Posts – fetched live from GitHub API so posts appear instantly after publishing.

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
            const json = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
            const posts = JSON.parse(json);

            if (!posts || !posts.length) {
                postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
                return;
            }

            const sorted = [...posts].reverse();

            sorted.forEach(post => {
                const images = post.images || [];
                const firstImg = images.length ? ghImgUrl(images[0]) : '';
                const date = post.date
                    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';

                // Thumbnail strip (show up to 3 images with +N badge)
                const thumbs = images.slice(0, 3).map((img, i) => {
                    const isLast = i === 2 && images.length > 3;
                    return `<div class="post-thumb-item" style="background-image:url('${ghImgUrl(img)}')">
                    ${isLast ? `<div class="post-thumb-more">+${images.length - 3}</div>` : ''}
                </div>`;
                }).join('');

                const photoLabel = images.length === 1 ? '1 photo' : `${images.length} photos`;

                const postHtml = `
                <div class="col-md-6 mb-4">
                    <div class="owner-post-card post-clickable"
                         data-postid="${post.id}"
                         data-href="request-quote.html?postId=${encodeURIComponent(post.id)}"
                         style="cursor:pointer;">
                        <div class="post-thumb-strip">${thumbs}</div>
                        <div class="post-content">
                            ${date ? `<span class="post-date"><i class="fa fa-calendar-days"></i> ${date} &nbsp;·&nbsp; <i class="fa fa-images"></i> ${photoLabel}</span>` : ''}
                            <h4>${escHtml(post.title)}</h4>
                            <p>${escHtml(post.description)}</p>
                            <span class="post-view-btn">View & Request Quote <i class="fa fa-arrow-right"></i></span>
                        </div>
                    </div>
                </div>`;
                postsContainer.append(postHtml);
            });

            // Make cards navigable
            $(document).on('click', '.post-clickable', function () {
                window.location.href = $(this).data('href');
            });
        })
        .catch(err => {
            console.warn('Could not load posts:', err);
            postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
        });
});

function ghImgUrl(path) {
    if (path.startsWith('http')) return path;
    return GH_RAW_BASE + path;
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
