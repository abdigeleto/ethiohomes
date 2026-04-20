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

// ── Custom lightbox state ───────────────────────────────────────────────────
let _lbImages = [], _lbIndex = 0;

function openLightbox(images, index) {
    _lbImages = images;
    _lbIndex = index;
    document.getElementById('lb-img').src = images[index];
    document.getElementById('lb-counter').textContent = `${index + 1} / ${images.length}`;
    document.getElementById('lb-prev').style.display = images.length > 1 ? 'flex' : 'none';
    document.getElementById('lb-next').style.display = images.length > 1 ? 'flex' : 'none';
    document.getElementById('post-lightbox').classList.add('active');
}
function closeLightbox() {
    document.getElementById('post-lightbox').classList.remove('active');
}
function lbStep(dir) {
    _lbIndex = (_lbIndex + dir + _lbImages.length) % _lbImages.length;
    const img = document.getElementById('lb-img');
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = _lbImages[_lbIndex];
        img.style.opacity = 1;
        document.getElementById('lb-counter').textContent = `${_lbIndex + 1} / ${_lbImages.length}`;
    }, 150);
}

// ── Inject modal + lightbox markup once ─────────────────────────────────────
$(document).ready(function () {

    $('body').append(`
        <!-- Post detail modal -->
        <div id="post-modal-overlay" onclick="closePostModal()">
            <div id="post-modal" onclick="event.stopPropagation()">
                <button class="pmo-close" onclick="closePostModal()"><i class="fa fa-xmark"></i></button>
                <div id="pmo-gallery"></div>
                <div id="pmo-body">
                    <span id="pmo-date"></span>
                    <h2 id="pmo-title"></h2>
                    <p id="pmo-desc"></p>
                    <div style="text-align:center;">
                        <a id="pmo-cta" href="https://rodcards.com.et/profiles/yosef"
                           class="pmo-cta-btn" target="_blank">
                            <i class="fa fa-phone"></i> Contact Us Now
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Custom lightbox (always above everything) -->
        <div id="post-lightbox" onclick="closeLightbox()">
            <button class="lb-close" onclick="closeLightbox()"><i class="fa fa-xmark"></i></button>
            <button class="lb-nav lb-prev" id="lb-prev" onclick="event.stopPropagation();lbStep(-1)">
                <i class="fa fa-chevron-left"></i>
            </button>
            <div class="lb-img-wrap" onclick="event.stopPropagation()">
                <img id="lb-img" src="" alt="">
            </div>
            <button class="lb-nav lb-next" id="lb-next" onclick="event.stopPropagation();lbStep(1)">
                <i class="fa fa-chevron-right"></i>
            </button>
            <span class="lb-counter" id="lb-counter"></span>
        </div>
    `);

    // Keyboard nav for lightbox
    $(document).on('keydown', function (e) {
        const lb = document.getElementById('post-lightbox');
        if (lb.classList.contains('active')) {
            if (e.key === 'ArrowLeft') lbStep(-1);
            if (e.key === 'ArrowRight') lbStep(1);
            if (e.key === 'Escape') closeLightbox();
        } else if (e.key === 'Escape') {
            closePostModal();
        }
    });

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

            window._postsData = [...posts].reverse();

            window._postsData.forEach(post => {
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
                                ${firstImg
                        ? `<img src="${firstImg}" alt="${escHtml(post.title)}" class="opc-cover">`
                        : '<div class="opc-no-img"><i class="fa fa-image"></i></div>'}
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
        })
        .catch(err => {
            console.warn('Could not load posts:', err);
            postsContainer.html('<p style="color:#888;padding:20px;">No updates posted yet.</p>');
        });
});

// ── Modal open/close ─────────────────────────────────────────────────────────
function openPostModal(postId) {
    const post = (window._postsData || []).find(p => p.id === postId);
    if (!post) return;

    const images = (post.images || []).map(ghImgUrl);
    const date = post.date
        ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    // Single-column gallery — one image per row, full width
    const imgH = '260px';
    let galleryHtml = '<div class="pmo-gallery-grid">';
    images.forEach((img, i) => {
        galleryHtml += `
            <div class="pmo-gallery-cell" onclick="openLightbox(window._currentImages,${i})">
                <div style="width:100%;height:${imgH};overflow:hidden;">
                    <img src="${img}" alt="Photo ${i + 1}"
                         style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease;"
                         onmouseover="this.style.transform='scale(1.06)'"
                         onmouseout="this.style.transform='scale(1)'">
                </div>
            </div>`;
    });
    galleryHtml += '</div>';

    window._currentImages = images;

    $('#pmo-gallery').html(galleryHtml);
    $('#pmo-date').html(date
        ? `<i class="fa fa-calendar-days"></i> ${date} &nbsp;·&nbsp; <i class="fa fa-images"></i> ${images.length} photo${images.length !== 1 ? 's' : ''}`
        : '');
    $('#pmo-title').text(post.title);
    $('#pmo-desc').text(post.description);

    $('#post-modal-overlay').addClass('active');
    $('body').addClass('modal-open');
}

function closePostModal() {
    $('#post-modal-overlay').removeClass('active');
    $('body').removeClass('modal-open');
}
