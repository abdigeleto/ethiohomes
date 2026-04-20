// Owner Posts – fetched live from GitHub API so posts appear instantly after publishing.

const GH_POSTS_URL = 'https://api.github.com/repos/abdigeleto/ethiohomes/contents/data/posts.json?ref=main';
const GH_RAW_BASE = 'https://raw.githubusercontent.com/abdigeleto/ethiohomes/main/';

function ghImgUrl(path) {
    return path.startsWith('http') ? path : GH_RAW_BASE + path;
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Inject modal markup once ────────────────────────────────────────────────
$(document).ready(function () {

    $('body').append(`
        <div id="post-modal-overlay" onclick="closePostModal()">
            <div id="post-modal" onclick="event.stopPropagation()">
                <button class="pmo-close" onclick="closePostModal()"><i class="fa fa-xmark"></i></button>
                <div id="pmo-gallery"></div>
                <div id="pmo-body">
                    <span id="pmo-date"></span>
                    <h2 id="pmo-title"></h2>
                    <p id="pmo-desc"></p>
                    <a id="pmo-cta" href="https://rodcards.com.et/profiles/yosef" class="pmo-cta-btn" target="_blank">
                        <i class="fa fa-phone"></i> Contact Us Now
                    </a>
                </div>
            </div>
        </div>
    `);

    // ── Load posts ──────────────────────────────────────────────────────────
    const postsContainer = $('#posts-container');
    if (!postsContainer.length) return;

    fetch(GH_POSTS_URL, { headers: { Accept: 'application/vnd.github.v3+json' } })
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
                const images = (post.images || []).map(ghImgUrl);
                const firstImg = images[0] || '';
                const date = post.date
                    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';
                const photoLabel = images.length === 1 ? '1 photo' : `${images.length} photos`;

                postsContainer.append(`
                    <div class="col-md-4 mb-4">
                        <div class="owner-post-card" onclick="openPostModal('${post.id}')" style="cursor:pointer;">
                            <div class="opc-img-wrap">
                                ${firstImg ? `<img src="${firstImg}" alt="${escHtml(post.title)}" class="opc-cover">` : '<div class="opc-no-img"><i class="fa fa-image"></i></div>'}
                                <span class="opc-badge"><i class="fa fa-images"></i> ${photoLabel}</span>
                            </div>
                            <div class="opc-body">
                                ${date ? `<span class="opc-date"><i class="fa fa-calendar-days"></i> ${date}</span>` : ''}
                                <h4 class="opc-title">${escHtml(post.title)}</h4>
                                <p class="opc-desc">${escHtml(post.description)}</p>
                                <span class="opc-more">View Gallery <i class="fa fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>`);
            });

            // Store posts globally for modal access
            window._postsData = sorted;
        })
        .catch(err => {
            console.warn('Could not load posts:', err);
            postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
        });
});

// ── Modal open / close ──────────────────────────────────────────────────────
function openPostModal(postId) {
    const post = (window._postsData || []).find(p => p.id === postId);
    if (!post) return;

    const images = (post.images || []).map(ghImgUrl);
    const date = post.date
        ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    // Build gallery grid
    const imgStyle = 'width:100%;height:100%;object-fit:cover;display:block;';
    const H = images.length === 1 ? '340px' : '220px';
    const cols = images.length === 1 ? 1 : 2;
    let galleryHtml = `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;border-radius:16px;overflow:hidden;">`;

    images.forEach((img, i) => {
        galleryHtml += `
            <a href="${img}" class="fancybox" rel="modal-gallery-${postId}"
               title="${escHtml(post.title)} – ${i + 1} of ${images.length}"
               style="display:block;overflow:hidden;">
                <div style="width:100%;height:${H};overflow:hidden;">
                    <img src="${img}" alt="Photo ${i + 1}" style="${imgStyle}transition:transform 0.4s ease;"
                         onmouseover="this.style.transform='scale(1.06)'"
                         onmouseout="this.style.transform='scale(1)'">
                </div>
            </a>`;
    });
    galleryHtml += '</div>';

    $('#pmo-gallery').html(galleryHtml);
    $('#pmo-date').html(date ? `<i class="fa fa-calendar-days"></i> ${date} &nbsp;·&nbsp; <i class="fa fa-images"></i> ${images.length} photo${images.length !== 1 ? 's' : ''}` : '');
    $('#pmo-title').text(post.title);
    $('#pmo-desc').text(post.description);

    $('#post-modal-overlay').addClass('active');
    $('body').addClass('modal-open');

    // Init fancybox for this modal's gallery
    setTimeout(() => {
        $('.fancybox').fancybox({
            padding: 0,
            openEffect: 'elastic',
            closeEffect: 'elastic',
            helpers: { overlay: { css: { background: 'rgba(0,0,0,0.92)' } } }
        });
    }, 50);
}

function closePostModal() {
    $('#post-modal-overlay').removeClass('active');
    $('body').removeClass('modal-open');
}

// Close on Escape key
$(document).on('keydown', function (e) {
    if (e.key === 'Escape') closePostModal();
});
