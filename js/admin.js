// ─── CONFIG ───────────────────────────────────────────────────────────────────
const REPO_OWNER = 'abdigeleto';
const REPO_NAME = 'ethiohomes';
const BRANCH = 'main';
const POSTS_PATH = 'data/posts.json';
// Password is stored as a simple hash so it's not in plain text.
// Default password: EthioHomes2025  (change by running: btoa('your_new_password') in console)
const PASSWORD_HASH = btoa('Jo@123');

// ─── STATE ────────────────────────────────────────────────────────────────────
let selectedFiles = [];   // Array of File objects chosen by owner
let allPosts = [];   // Posts loaded from GitHub

// ─── GITHUB HELPERS ───────────────────────────────────────────────────────────
function getToken() {
    return localStorage.getItem('gh_token') || '';
}

async function ghGet(path) {
    const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, {
        headers: { Authorization: `token ${getToken()}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!r.ok) throw new Error(`GitHub GET failed: ${r.status} ${r.statusText}`);
    return r.json();
}

async function ghPut(path, content64, message, sha) {
    const body = { message, content: content64, branch: BRANCH };
    if (sha) body.sha = sha;
    const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'PUT',
        headers: { Authorization: `token ${getToken()}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify(body)
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e.message || r.statusText); }
    return r.json();
}

async function ghDelete(path, message, sha) {
    const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'DELETE',
        headers: { Authorization: `token ${getToken()}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({ message, sha, branch: BRANCH })
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e.message || r.statusText); }
}

// Compress & resize image using Canvas before uploading (max 1500px, quality 0.82)
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const MAX_PX = 1500;
        const QUALITY = 0.82;
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width > MAX_PX || height > MAX_PX) {
                if (width > height) { height = Math.round(height * MAX_PX / width); width = MAX_PX; }
                else { width = Math.round(width * MAX_PX / height); height = MAX_PX; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
            resolve(dataUrl.split(',')[1]); // return pure base64
        };
        img.onerror = reject;
        img.src = url;
    });
}

// Verify token has repo write access before doing uploads
async function verifyToken() {
    const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
        headers: { Authorization: `token ${getToken()}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!r.ok) throw new Error(`Token invalid or no repo access (${r.status}). Check your GitHub token has the "repo" scope.`);
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function doLogin() {
    const pw = document.getElementById('login-password').value;
    if (btoa(pw) === PASSWORD_HASH) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        if (!getToken()) {
            document.getElementById('settings-panel').classList.remove('hidden');
        }
        loadPosts();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function doLogout() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').style.display = 'none';
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function toggleSettings() {
    document.getElementById('settings-panel').classList.toggle('hidden');
}

function saveSettings() {
    const t = document.getElementById('gh-token').value.trim();
    if (!t) { showToast('Please enter a token first.', 'error'); return; }
    localStorage.setItem('gh_token', t);
    document.getElementById('settings-panel').classList.add('hidden');
    showToast('GitHub token saved!', 'success');
    loadPosts();
}

// ─── FILE HANDLING ────────────────────────────────────────────────────────────
function handleFiles(files) {
    for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        selectedFiles.push(f);
    }
    renderPreviews();
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
}

function renderPreviews() {
    const container = document.getElementById('image-previews');
    container.innerHTML = '';
    selectedFiles.forEach((f, idx) => {
        const url = URL.createObjectURL(f);
        container.innerHTML += `
            <div class="preview-item">
                <img src="${url}" alt="preview">
                <button class="remove-img" onclick="removeFile(${idx})" title="Remove"><i class="fa fa-xmark"></i></button>
            </div>`;
    });
}

function removeFile(idx) {
    selectedFiles.splice(idx, 1);
    renderPreviews();
}

// ─── LOAD POSTS ───────────────────────────────────────────────────────────────
async function loadPosts() {
    if (!getToken()) return;
    try {
        const data = await ghGet(POSTS_PATH);
        allPosts = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\n/g, '')))));
    } catch (e) { allPosts = []; }
    renderPostsList();
}

function renderPostsList() {
    const container = document.getElementById('posts-list');
    document.getElementById('posts-count').textContent = allPosts.length;

    if (!allPosts.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa fa-box-open"></i><p>No posts yet. Create your first post above!</p></div>`;
        return;
    }

    // newest first
    const sorted = [...allPosts].reverse();
    container.innerHTML = sorted.map(post => {
        const thumbs = post.images.slice(0, 2).map(img =>
            `<img src="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${img}" onerror="this.style.display='none'">`
        ).join('');
        const extra = post.images.length > 2 ? `<div class="more-count">+${post.images.length - 2}</div>` : '';
        const date = new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return `
        <div class="post-item" id="post-${post.id}">
            <div class="post-thumb">${thumbs}${extra}</div>
            <div class="post-info">
                <h4>${escHtml(post.title)}</h4>
                <p>${escHtml(post.description)}</p>
                <div class="post-meta"><i class="fa fa-calendar-days"></i>${date} &nbsp;·&nbsp; <i class="fa fa-images"></i>${post.images.length} photo${post.images.length !== 1 ? 's' : ''}</div>
            </div>
            <div class="post-actions">
                <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

// ─── SUBMIT POST ──────────────────────────────────────────────────────────────
async function submitPost() {
    const title = document.getElementById('post-title').value.trim();
    const desc = document.getElementById('post-desc').value.trim();

    if (!getToken()) { showToast('Please set your GitHub token in Settings first.', 'error'); toggleSettings(); return; }
    if (!title) { showToast('Please add a title.', 'error'); return; }
    if (!selectedFiles.length) { showToast('Please select at least one image.', 'error'); return; }

    const btn = document.getElementById('submit-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Publishing...';
    setProgress(true, 0, 'Verifying access...');

    try {
        await verifyToken();

        const postId = 'post-' + Date.now();
        const folder = `images/updates/${postId}`;
        const imagesPaths = [];

        // Compress & upload each image
        for (let i = 0; i < selectedFiles.length; i++) {
            const f = selectedFiles[i];
            setProgress(true, Math.round((i / selectedFiles.length) * 75), `Compressing image ${i + 1} of ${selectedFiles.length}...`);
            const b64 = await compressImage(f);
            const path = `${folder}/image-${i + 1}.jpg`;
            setProgress(true, Math.round(((i + 0.5) / selectedFiles.length) * 75), `Uploading image ${i + 1} of ${selectedFiles.length}...`);
            await ghPut(path, b64, `Upload image for ${postId}`);
            imagesPaths.push(path);
        }

        setProgress(true, 85, 'Saving post data...');

        // Load current posts.json sha
        let sha = undefined;
        try {
            const existing = await ghGet(POSTS_PATH);
            sha = existing.sha;
            allPosts = JSON.parse(atob(existing.content.replace(/\n/g, '')));
        } catch (e) { allPosts = []; }

        const newPost = { id: postId, title, description: desc, images: imagesPaths, date: new Date().toISOString() };
        allPosts.push(newPost);

        const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(allPosts, null, 2))));
        setProgress(true, 95, 'Committing to GitHub...');
        await ghPut(POSTS_PATH, jsonB64, `Add post: ${title}`, sha);

        setProgress(true, 100, 'Done!');
        showToast('Post published successfully! 🎉', 'success');

        // Reset form
        document.getElementById('post-title').value = '';
        document.getElementById('post-desc').value = '';
        selectedFiles = [];
        renderPreviews();
        renderPostsList();

    } catch (err) {
        console.error(err);
        showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa fa-paper-plane"></i> Publish Post';
        setTimeout(() => setProgress(false), 1500);
    }
}

// ─── DELETE POST ──────────────────────────────────────────────────────────────
async function deletePost(postId) {
    if (!confirm('Delete this post and all its images? This cannot be undone.')) return;

    showToast('Deleting...', 'success');

    try {
        // Find the post
        const post = allPosts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        // Delete each image file from GitHub
        for (const imgPath of post.images) {
            try {
                const fileData = await ghGet(imgPath);
                await ghDelete(imgPath, `Remove image from ${postId}`, fileData.sha);
            } catch (e) { /* file may already be gone */ }
        }

        // Remove from allPosts and save
        allPosts = allPosts.filter(p => p.id !== postId);

        const existing = await ghGet(POSTS_PATH);
        const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(allPosts, null, 2))));
        await ghPut(POSTS_PATH, jsonB64, `Delete post: ${postId}`, existing.sha);

        renderPostsList();
        showToast('Post deleted.', 'success');

    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
function setProgress(show, pct, label) {
    const wrap = document.getElementById('progress-wrap');
    const bar = document.getElementById('progress-bar');
    const lbl = document.getElementById('progress-label');
    wrap.style.display = show ? 'block' : 'none';
    if (show) { bar.style.width = pct + '%'; lbl.textContent = label; }
}

let toastTimeout;
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('i');
    document.getElementById('toast-msg').textContent = msg;
    toast.className = `toast ${type} show`;
    icon.className = type === 'success' ? 'fa fa-circle-check' : 'fa fa-circle-exclamation';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
}

function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
