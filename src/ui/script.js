// Shared UI script for auth, books, book detail, profile and admin helpers.
const apiBase = '/api';

function getToken() {
  return localStorage.getItem('bm_token');
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('bm_user') || 'null');
}

function logoutAndRedirect() {
  localStorage.removeItem('bm_token');
  localStorage.removeItem('bm_user');
  location.href = 'login.html';
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US');
}

function ownerIdOf(book) {
  if (!book || !book.owner) return '';
  if (typeof book.owner === 'string') return book.owner;
  // populated owner may expose _id or id; normalize to string
  if (book.owner._id) return String(book.owner._id);
  if (book.owner.id) return String(book.owner.id);
  return String(book.owner);
}

function ownerNameOf(book) {
  if (!book || !book.owner) return 'Unknown';
  if (typeof book.owner === 'string') return 'Unknown';
  return book.owner.name || book.owner.email || 'Unknown';
}

function canManageBook(book, user) {
  if (!book || !user) return false;
  if (user.role === 'admin') return true;
  return ownerIdOf(book) && ownerIdOf(book) === user._id;
}

function renderNav() {
  const navAuth = document.getElementById('nav-auth');
  const navRight = document.querySelector('.nav-right');
  const user = getCurrentUser();

  if (navAuth && navRight && user) {
    navAuth.remove();

    if (user.role === 'admin') {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.className = 'nav-link';
      adminLink.textContent = 'Admin';
      navRight.appendChild(adminLink);
    }

    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.className = 'nav-link';
    profileLink.textContent = user.name || 'Profile';
    navRight.appendChild(profileLink);

    // My Books link for all authenticated users
    const myBooksLink = document.createElement('a');
    myBooksLink.href = 'my_books.html';
    myBooksLink.className = 'nav-link';
    myBooksLink.textContent = 'My Books';
    navRight.appendChild(myBooksLink);

    const logout = document.createElement('a');
    logout.href = '#';
    logout.className = 'nav-link';
    logout.textContent = 'Logout';
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      logoutAndRedirect();
    });
    navRight.appendChild(logout);
  }

  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const isRoot = href === '/' && (location.pathname === '/' || location.pathname.endsWith('/index.html'));
    const isActive = location.pathname.endsWith(href);
    if (isRoot || isActive) a.classList.add('active');
  });
}

async function login(email, password) {
  const res = await fetch(`${apiBase}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function registerUser(name, email, password) {
  const res = await fetch(`${apiBase}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchProfile(token = getToken()) {
  const res = await fetch(`${apiBase}/users/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchBooks(query = '') {
  const url = query ? `${apiBase}/books?${query}` : `${apiBase}/books`;
  const res = await fetch(url, { headers: authHeaders() });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchBook(bookId) {
  const res = await fetch(`${apiBase}/books/${bookId}`, { headers: authHeaders() });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchBookReviews(bookId) {
  const res = await fetch(`${apiBase}/books/${bookId}/reviews`, { headers: authHeaders() });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function createBook(payload) {
  const res = await fetch(`${apiBase}/books`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function updateBook(bookId, payload) {
  const res = await fetch(`${apiBase}/books/${bookId}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function deleteBook(bookId) {
  const res = await fetch(`${apiBase}/books/${bookId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function createReview(payload) {
  const res = await fetch(`${apiBase}/reviews`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function updateReview(reviewId, payload) {
  const res = await fetch(`${apiBase}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function deleteReview(reviewId) {
  const res = await fetch(`${apiBase}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchReviews() {
  const res = await fetch(`${apiBase}/reviews`, { headers: authHeaders() });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function fetchUsers() {
  const res = await fetch(`${apiBase}/users`, { headers: authHeaders() });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function changeUserRole(userId, newRole) {
  const res = await fetch(`${apiBase}/users/${userId}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ role: newRole }),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

async function deleteUser(userId) {
  const res = await fetch(`${apiBase}/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const payload = await res.json();
  if (!res.ok) throw payload;
  return payload;
}

function renderStarRating(value = 0) {
  const score = Math.max(0, Math.min(5, Number(value) || 0));
  return '★★★★★'.slice(0, score) + '☆☆☆☆☆'.slice(0, 5 - score);
}

function renderBooksPage() {
  const booksWrap = document.getElementById('booksWrap');
  const booksGrid = document.getElementById('booksList');
  const booksStatus = document.getElementById('booksStatus');
  const searchInput = document.getElementById('booksSearch');
  const genreSelect = document.getElementById('booksGenre');
  const mineOnlyToggle = document.getElementById('mineOnlyToggle');
  const refreshBtn = document.getElementById('refreshBtn');
  const createBtn = document.getElementById('createBookBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const user = getCurrentUser();

  if (!booksGrid || !booksStatus) return;

  if (createBtn) {
    createBtn.style.display = getToken() ? 'inline-flex' : 'none';
  }

  const state = {
    books: [],
  };

  function filteredBooks() {
    const term = (searchInput?.value || '').trim().toLowerCase();
    const genre = (genreSelect?.value || '').trim().toLowerCase();
    const mineOnly = mineOnlyToggle?.checked;

    return state.books.filter((book) => {
      const blob = `${book.title || ''} ${book.author || ''} ${book.genre || ''} ${ownerNameOf(book)}`.toLowerCase();
      const matchesTerm = !term || blob.includes(term);
      const matchesGenre = !genre || (book.genre || '').toLowerCase().includes(genre);
      const matchesMine = !mineOnly || (user && ownerIdOf(book) === user._id);
      return matchesTerm && matchesGenre && matchesMine;
    });
  }

  function renderCards() {
    const books = filteredBooks();
    booksGrid.innerHTML = '';

    if (!books.length) {
      booksStatus.textContent = 'No matching books found.';
      return;
    }

    books.forEach((book) => {
      const canManage = canManageBook(book, user);
      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `
        <div class="book-cover-wrap">
          <img class="book-cover" src="${escapeHtml(book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80')}" alt="${escapeHtml(book.title || 'Book cover')}" />
        </div>
        <div class="book-card-body">
          <div class="book-card-top">
            <span class="book-chip">${escapeHtml(book.genre || 'General')}</span>
            <span class="book-chip book-chip-soft">${escapeHtml(ownerNameOf(book))}</span>
          </div>
          <h3>${escapeHtml(book.title || 'Untitled')}</h3>
          <p class="book-author">${escapeHtml(book.author || 'Unknown author')}</p>
          <p class="book-desc">${escapeHtml(book.description || 'No description yet')}</p>
          <div class="book-card-actions">
            <a class="btn btn-primary" href="book_detail.html?id=${book._id}">View details</a>
            ${canManage ? `<a class="btn btn-secondary" href="book_form.html?id=${book._id}">Edit</a>` : ''}
            ${canManage ? `<button class="btn btn-danger" data-delete-book="${book._id}">Delete</button>` : ''}
          </div>
        </div>
      `;
      booksGrid.appendChild(card);
    });

    booksGrid.querySelectorAll('[data-delete-book]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!confirm('Delete this book?')) return;
        try {
          await deleteBook(button.dataset.deleteBook);
          await loadBooks();
        } catch (err) {
          alert(err.message || 'Failed to delete book');
        }
      });
    });
  }

  async function loadBooks() {
    booksStatus.textContent = 'Loading books...';
    try {
      state.books = await fetchBooks();
      booksStatus.textContent = '';
      renderCards();
    } catch (err) {
      booksStatus.textContent = err.message || 'Failed to load books';
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', loadBooks);
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAndRedirect);
  searchInput?.addEventListener('input', renderCards);
  genreSelect?.addEventListener('change', renderCards);
  mineOnlyToggle?.addEventListener('change', renderCards);

  loadBooks();
}

function renderBookFormPage() {
  const form = document.getElementById('bookForm');
  const status = document.getElementById('bookStatus');
  const title = document.getElementById('formTitle');
  const token = getToken();

  if (!form || !status) return;
  if (!token) {
    status.textContent = 'Please sign in before creating or editing a book.';
    return;
  }

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  async function fillForm() {
    if (!id) return;
    try {
      const book = await fetchBook(id);
      if (title) title.textContent = 'Edit Book';
      document.getElementById('b_title').value = book.title || '';
      document.getElementById('b_author').value = book.author || '';
      document.getElementById('b_description').value = book.description || '';
      document.getElementById('b_genre').value = book.genre || '';
      const preview = document.getElementById('coverPreview');
      if (book.coverImage && preview) {
        preview.innerHTML = `<img src="${escapeHtml(book.coverImage)}" alt="cover" class="preview-img"/>`;
      }
      document.getElementById('b_publishedDate').value = book.publishedDate ? String(book.publishedDate).slice(0, 10) : '';
    } catch (err) {
      status.textContent = err.message || 'Could not load the book';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', document.getElementById('b_title').value);
    fd.append('author', document.getElementById('b_author').value);
    fd.append('description', document.getElementById('b_description').value);
    fd.append('genre', document.getElementById('b_genre').value);
    fd.append('publishedDate', document.getElementById('b_publishedDate').value);
    const fileInput = document.getElementById('b_coverFile');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      fd.append('cover', fileInput.files[0]);
    }

    try {
      const url = id ? `${apiBase}/books/${id}` : `${apiBase}/books`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw data;
      status.textContent = id ? 'Book updated successfully' : 'Book created successfully';
      setTimeout(() => (location.href = 'books.html'), 500);
    } catch (err) {
      status.textContent = err.message || 'Failed to save book';
    }
  });

  fillForm();
}

function renderBookDetailPage() {
  const detail = document.getElementById('bookDetail');
  const reviewsList = document.getElementById('bookReviews');
  const reviewStatus = document.getElementById('reviewStatus');
  const reviewForm = document.getElementById('reviewForm');
  const pageStatus = document.getElementById('bookDetailStatus');
  const params = new URLSearchParams(location.search);
  const bookId = params.get('id');
  const user = getCurrentUser();

  if (!detail || !bookId) return;

  async function load() {
    if (pageStatus) pageStatus.textContent = 'Loading book...';
    try {
      const book = await fetchBook(bookId);
      const reviews = await fetchBookReviews(bookId);
      const canManage = canManageBook(book, user);

      detail.innerHTML = `
        <div class="detail-grid">
          <div class="detail-cover">
            <img src="${escapeHtml(book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80')}" alt="${escapeHtml(book.title || 'Book cover')}" />
          </div>
          <div class="detail-copy">
            <span class="book-chip">${escapeHtml(book.genre || 'General')}</span>
            <h1>${escapeHtml(book.title || 'Untitled')}</h1>
            <p class="detail-meta">Author: <strong>${escapeHtml(book.author || '-')}</strong></p>
            <p class="detail-meta">Owner: <strong>${escapeHtml(ownerNameOf(book))}</strong></p>
            <p class="detail-meta">Created: ${formatDate(book.createdAt)}</p>
            <p class="detail-desc">${escapeHtml(book.description || 'No description yet')}</p>
            <div class="detail-actions">
              <a class="btn btn-primary" href="books.html">Back to books</a>
              ${canManage ? `<a class="btn btn-secondary" href="book_form.html?id=${book._id}">Edit book</a>` : ''}
            </div>
          </div>
        </div>
        <section class="rating-card">
          <div>
            <span class="rating-score">${Number(book.ratingAverage || 0).toFixed(1)}</span>
            <span class="rating-label">/ 5</span>
          </div>
          <p>${book.ratingCount || 0} reviews</p>
        </section>
      `;

      reviewsList.innerHTML = '';
      if (!reviews.length) {
        reviewsList.innerHTML = '<li class="empty-state">No reviews yet.</li>';
      } else {
        reviews.forEach((review) => {
          const reviewItem = document.createElement('li');
          const reviewer = review.user && typeof review.user === 'object' ? review.user : null;
          const reviewerName = reviewer ? reviewer.name || reviewer.email : 'Unknown';
          const canDeleteReview = user && (user.role === 'admin' || String(review.user?._id || review.user) === user._id);
          reviewItem.className = 'review-item';
          reviewItem.innerHTML = `
            <div class="review-head">
              <strong>${escapeHtml(reviewerName)}</strong>
              <span>${renderStarRating(review.rating)}</span>
            </div>
            <p>${escapeHtml(review.comment || '')}</p>
            <small>${formatDate(review.createdAt)}</small>
            ${canDeleteReview ? `<button class="btn btn-danger review-delete-btn" data-review-delete="${review._id}">Delete review</button>` : ''}
          `;
          reviewsList.appendChild(reviewItem);
        });
      }

      if (reviewForm) {
        if (!user) {
          reviewForm.classList.add('hidden');
        } else {
          reviewForm.classList.remove('hidden');
          reviewStatus.textContent = '';
        }
      }

      if (pageStatus) pageStatus.textContent = '';

      reviewsList.querySelectorAll('[data-review-delete]').forEach((button) => {
        button.addEventListener('click', async () => {
          if (!confirm('Delete this review?')) return;
          try {
            await deleteReview(button.dataset.reviewDelete);
            await load();
          } catch (err) {
            alert(err.message || 'Failed to delete review');
          }
        });
      });
    } catch (err) {
      if (pageStatus) pageStatus.textContent = err.message || 'Could not load the book';
    }
  }

  reviewForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!user) {
      reviewStatus.textContent = 'Please sign in to leave a review.';
      return;
    }

    const payload = {
      bookId,
      rating: document.getElementById('reviewRating').value,
      comment: document.getElementById('reviewComment').value,
    };

    try {
      await createReview(payload);
      reviewStatus.textContent = 'Review created successfully';
      reviewForm.reset();
      await load();
    } catch (err) {
      reviewStatus.textContent = err.message || 'Failed to create review';
    }
  });

  load();
}

function renderProfilePage() {
  const profileForm = document.getElementById('profileForm');
  const profileStatus = document.getElementById('profileStatus');
  if (!profileForm || !profileStatus) return;

  const avatarPreview = document.getElementById('avatarPreview');
  const avatarInput = document.getElementById('p_avatar');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');

  function renderAvatarPreview(src) {
    if (!avatarPreview) return;
    if (!src) {
      avatarPreview.innerHTML = '<span class="avatar-placeholder">No avatar</span>';
      return;
    }
    avatarPreview.innerHTML = `<img src="${escapeHtml(src)}" alt="Avatar" class="avatar-image" />`;
  }

  (async function initProfile() {
    try {
      const token = getToken();
      if (!token) {
        profileStatus.textContent = 'Please sign in.';
        return;
      }
      const profile = await fetchProfile(token);
      document.getElementById('p_name').value = profile.name || '';
      document.getElementById('p_email').value = profile.email || '';
      renderAvatarPreview(profile.avatar || '');

      avatarInput?.addEventListener('change', () => {
        const file = avatarInput.files && avatarInput.files[0];
        if (!file) {
          renderAvatarPreview(profile.avatar || '');
          return;
        }
        renderAvatarPreview(URL.createObjectURL(file));
      });

      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('p_name').value;
        const email = document.getElementById('p_email').value;
        const password = document.getElementById('p_password').value;
        const avatarFile = avatarInput && avatarInput.files ? avatarInput.files[0] : null;

        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        if (password && password.trim()) {
          fd.append('password', password);
        }
        if (avatarFile) {
          fd.append('avatar', avatarFile);
        }

        try {
          const res = await fetch(`${apiBase}/users/${profile._id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: fd,
          });
          const updated = await res.json();
          if (!res.ok) throw updated;
          localStorage.setItem('bm_user', JSON.stringify({ ...getCurrentUser(), ...updated }));
          if (updated.avatar) {
            renderAvatarPreview(updated.avatar);
          }
          if (avatarInput) {
            avatarInput.value = '';
          }
          document.getElementById('p_password').value = '';
          profileStatus.textContent = 'Profile updated successfully';
        } catch (err) {
          profileStatus.textContent = err.message || 'Failed to update profile';
        }
      });

      deleteAccountBtn?.addEventListener('click', async () => {
        if (!confirm('Delete your account? This will remove your books and reviews too.')) return;

        try {
          await deleteUser(profile._id);
          localStorage.removeItem('bm_token');
          localStorage.removeItem('bm_user');
          window.location.href = '/';
        } catch (err) {
          profileStatus.textContent = err.message || 'Failed to delete account';
        }
      });
    } catch (err) {
      profileStatus.textContent = err.message || 'Failed to load profile';
    }
  })();
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const status = document.getElementById('status');
      status.textContent = 'Signing in...';

      try {
        const auth = await login(email, password);
        localStorage.setItem('bm_token', auth.token);

        try {
          const profile = await fetchProfile(auth.token);
          localStorage.setItem('bm_user', JSON.stringify(profile));
        } catch {
          localStorage.setItem(
            'bm_user',
            JSON.stringify({ _id: auth._id, name: auth.name, email: auth.email })
          );
        }

        status.textContent = 'Signed in successfully, redirecting...';
        setTimeout(() => {
          const u = getCurrentUser();
          location.href = u && u.role === 'admin' ? 'admin.html' : 'books.html';
        }, 450);
      } catch (err) {
        status.textContent = err.message || 'Sign in failed';
      }
    });
  }

  renderBooksPage();
  renderMyBooksPage();
  renderBookFormPage();
  renderBookDetailPage();
  renderProfilePage();
});

// wire admin-style side logout button if present
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!target) return;
  if (target.id === 'sideLogout' || target.closest && target.closest('#sideLogout')) {
    e.preventDefault();
    logoutAndRedirect();
  }
});

// Mobile admin sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!menuBtn) return;
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const shell = document.querySelector('.admin-shell');
    if (!shell) return;
    shell.classList.toggle('mobile-sidebar-open');
  });
  // close when clicking overlay area
  document.addEventListener('click', (ev) => {
    const shell = document.querySelector('.admin-shell');
    if (!shell || !shell.classList.contains('mobile-sidebar-open')) return;
    const sidebar = document.querySelector('.admin-sidebar');
    const topbar = document.querySelector('.admin-topbar');
    const clickedInside = ev.target.closest && (ev.target.closest('.admin-sidebar') || ev.target.closest('#mobileMenuBtn') || ev.target.closest('.admin-topbar'));
    if (!clickedInside) {
      shell.classList.remove('mobile-sidebar-open');
    }
  });
});

function renderMyBooksPage() {
  const wrap = document.getElementById('myBooksWrap');
  const tableBody = document.getElementById('myBooksTableBody');
  const status = document.getElementById('myBooksStatus');
  let user = getCurrentUser();

  if (!wrap || !tableBody || !status) return;

  const welcome = document.getElementById('myBooksWelcome');
  if (welcome) welcome.textContent = user ? (`Welcome, ${user.name || user.email}`) : 'Loading...';

  async function load() {
    status.textContent = 'Loading...';
    try {
      // ensure we have current user info; try to recover from token if missing
      if (!user) {
        const token = getToken();
        if (token) {
          try {
            const profile = await fetchProfile(token);
            localStorage.setItem('bm_user', JSON.stringify(profile));
            user = profile;
            if (welcome) welcome.textContent = `Welcome, ${user.name || user.email}`;
          } catch (pfErr) {
            // token invalid or profile fetch failed
            console.warn('MyBooks: failed to fetch profile using token', pfErr);
            status.textContent = 'Please sign in to view My Books.';
            return;
          }
        } else {
          status.textContent = 'Please sign in to view My Books.';
          return;
        }
      }

      const books = await fetchBooks();
      const currentId = user && (user._id || user.id || user);
      console.debug('MyBooks.load currentUser:', user);
      console.debug('MyBooks.load fetched books count:', Array.isArray(books) ? books.length : typeof books, books);
      const mine = books.filter((b) => {
        const oid = ownerIdOf(b);
        // debug owners
        // console.debug('book owner id', oid, 'book._id', b._id);
        return oid && currentId && String(oid) === String(currentId);
      });
      console.debug('MyBooks.load mine count:', mine.length, mine.map(b=>({id:b._id,title:b.title,owner:ownerIdOf(b)})));
      let usedFallback = false;
      // fallback: try matching by populated owner email or name when id matching fails
      if (!mine.length) {
        const email = user && (user.email || (user._doc && user._doc.email));
        const name = user && (user.name || (user._doc && user._doc.name));
        const byEmail = books.filter((b) => b.owner && b.owner.email && email && String(b.owner.email).toLowerCase() === String(email).toLowerCase());
        const byName = books.filter((b) => b.owner && b.owner.name && name && String(b.owner.name).toLowerCase() === String(name).toLowerCase());
        if (byEmail.length) {
          usedFallback = true;
          mine.push(...byEmail);
        } else if (byName.length) {
          usedFallback = true;
          mine.push(...byName);
        }
      }
      console.debug('MyBooks.load after fallback mine count:', mine.length, 'fallbackUsed=', usedFallback);
      // also render a simple on-page debug panel for users who don't open DevTools
      try {
        const debugWrap = document.getElementById('myBooksDebug');
        const debugPre = document.getElementById('myBooksDebugPre');
        if (debugWrap && debugPre) {
          debugWrap.style.display = 'block';
          const summary = {
            currentUser: user,
            totalFetched: Array.isArray(books) ? books.length : 0,
            mineCount: mine.length,
            owners: Array.isArray(books) ? books.map(b=>({id:b._id,title:b.title,owner:ownerIdOf(b)})) : [],
            fallbackUsed: usedFallback,
          };
          debugPre.textContent = JSON.stringify(summary, null, 2);
        }
      } catch (e) {
        /* ignore */
      }
      tableBody.innerHTML = '';
      if (!Array.isArray(books)) {
        status.textContent = 'Error: the server returned invalid data.';
        return;
      }

      if (!mine.length) {
        tableBody.innerHTML = '<tr><td colspan="6">No books yet.</td></tr>';
      } else {
        mine.forEach((book) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${escapeHtml(book._id)}</td>
            <td>${escapeHtml(book.title || '')}</td>
            <td>${escapeHtml(book.genre || '')}</td>
            <td>${escapeHtml(ownerNameOf(book))}</td>
            <td>${escapeHtml(book.status || 'active')}</td>
            <td>
              <a class="btn btn-secondary" href="book_form.html?id=${book._id}">Edit</a>
              <a class="btn btn-primary" href="book_detail.html?id=${book._id}">View</a>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
      status.textContent = '';
    } catch (err) {
      console.error('MyBooks.load error', err);
      status.textContent = err && err.message ? err.message : 'Failed to load books';
    }
  }

  load();
}

window.apiHelpers = {
  apiBase,
  login,
  registerUser,
  fetchProfile,
  fetchBooks,
  fetchBook,
  fetchBookReviews,
  createBook,
  updateBook,
  deleteBook,
  createReview,
  updateReview,
  deleteReview,
  fetchReviews,
  fetchUsers,
  changeUserRole,
  deleteUser,
  getCurrentUser,
  logoutAndRedirect,
  canManageBook,
};

window.adminHelpers = { fetchUsers, changeUserRole, deleteUser };
