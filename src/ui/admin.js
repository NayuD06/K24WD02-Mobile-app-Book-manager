const state = {
  users: [],
  books: [],
  reviews: [],
  currentView: 'dashboard',
};

const el = {
  status: document.getElementById('adminStatus'),
  welcome: document.getElementById('adminWelcome'),
  clock: document.getElementById('adminClock'),
  modalRoot: document.getElementById('modalRoot'),
  usersList: document.getElementById('usersList'),
  booksList: document.getElementById('booksListAdmin'),
  reviewsList: document.getElementById('reviewsListAdmin'),
  mUsers: document.getElementById('mUsers'),
  mBooks: document.getElementById('mBooks'),
  mReviews: document.getElementById('mReviews'),
  mAdmins: document.getElementById('mAdmins'),
  reviewPie: document.getElementById('reviewPie'),
  booksTableBody: document.getElementById('booksTableBody'),
  usersTableBody: document.getElementById('usersTableBody'),
  searchBooks: document.getElementById('searchBooks'),
  searchUsers: document.getElementById('searchUsers'),
  btnAddBook: document.getElementById('btnAddBook'),
  btnAddUser: document.getElementById('btnAddUser'),
};

function formatShortId(id) {
  return id ? id.slice(-6) : '-';
}

function buildUsernameFromEmail(email) {
  if (!email || !email.includes('@')) return 'unknown';
  return email.split('@')[0];
}

function getBookOwnerName(book) {
  if (!book || !book.owner) return 'Unknown';
  if (typeof book.owner === 'string') return 'Unknown';
  return book.owner.name || book.owner.email || 'Unknown';
}

function availabilityByBook(bookId) {
  const count = state.reviews.filter((r) => {
    if (!r.book) return false;
    if (typeof r.book === 'string') return r.book === bookId;
    return r.book._id === bookId;
  }).length;
  return count > 0 ? 'Borrowed' : 'Available';
}

function iconSvg(name) {
  const icons = {
    add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11zM21.41 6.34a1.25 1.25 0 0 0 0-1.77L19.43 2.6a1.25 1.25 0 0 0-1.77 0l-1.56 1.56 3.75 3.75 1.56-1.57z"/></svg>',
    delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12v2H6V7zm2 3h8l-1 10H9L8 10zm3-6h2l1 1h4v2H6V5h4l1-1z"/></svg>',
    view: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5 0 9 4 10 7-1 3-5 7-10 7S3 15 2 12c1-3 5-7 10-7zm0 2c-3.8 0-7 2.9-8 5 1 2.1 4.2 5 8 5s7-2.9 8-5c-1-2.1-4.2-5-8-5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4.5V20h14v-1.5C19 16 16 14 12 14z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a3 3 0 0 1 3-3h11v18H7a3 3 0 0 1-3-3V5zm3-1a1 1 0 0 0-1 1v12a3 3 0 0 1 1-.17h9V4H7z"/></svg>',
  };
  return icons[name] || '';
}

function modalTitle(text, iconName) {
  return `<div class="modal-title"><span class="modal-title-icon">${iconSvg(iconName)}</span><h3>${text}</h3></div>`;
}

function showModal(content) {
  el.modalRoot.innerHTML = `
    <div class="modal-overlay" data-close="true"></div>
    <div class="modal-box">${content}</div>
  `;
  el.modalRoot.classList.remove('hidden');

  el.modalRoot.querySelector('[data-close="true"]').addEventListener('click', closeModal);
  const closeBtn = el.modalRoot.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
}

function closeModal() {
  el.modalRoot.classList.add('hidden');
  el.modalRoot.innerHTML = '';
}

function wireSidebar() {
  const sideLinks = document.querySelectorAll('[data-view]');
  sideLinks.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentView = btn.dataset.view;
      document.querySelectorAll('.admin-view').forEach((v) => v.classList.remove('is-active'));
      document.getElementById(`view-${state.currentView}`).classList.add('is-active');
      sideLinks.forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function wireTopButtons() {
  document.getElementById('sideLogout').addEventListener('click', () => {
    window.apiHelpers.logoutAndRedirect();
  });

  el.btnAddBook.addEventListener('click', openAddBookModal);
  el.btnAddUser.addEventListener('click', openAddUserModal);
  el.searchBooks.addEventListener('input', renderBookTable);
  el.searchUsers.addEventListener('input', renderUserTable);
}

function renderClock() {
  const now = new Date();
  el.clock.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

function renderDashboard() {
  el.mUsers.textContent = String(state.users.length).padStart(3, '0');
  el.mBooks.textContent = String(state.books.length).padStart(3, '0');
  el.mReviews.textContent = String(state.reviews.length).padStart(3, '0');
  el.mAdmins.textContent = String(state.users.filter((u) => u.role === 'admin').length).padStart(3, '0');

  const low = state.reviews.filter((r) => Number(r.rating) <= 2).length;
  const pctLow = state.reviews.length ? Math.round((low / state.reviews.length) * 100) : 0;
  el.reviewPie.style.background = `conic-gradient(#141414 0 ${pctLow}%, #7b7b7b ${pctLow}% 100%)`;

  el.usersList.innerHTML = '';
  state.users.slice(0, 6).forEach((u) => {
    const li = document.createElement('li');
    li.textContent = `${u.name} (${u.role})`;
    el.usersList.appendChild(li);
  });

  el.booksList.innerHTML = '';
  state.books.slice(0, 6).forEach((b) => {
    const li = document.createElement('li');
    li.textContent = `${b.title} - ${getBookOwnerName(b)}`;
    el.booksList.appendChild(li);
  });

  el.reviewsList.innerHTML = '';
  state.reviews.slice(0, 6).forEach((r) => {
    const li = document.createElement('li');
    const title = r.book && r.book.title ? r.book.title : 'Unknown book';
    const userName = r.user && r.user.name ? r.user.name : 'Unknown user';
    li.textContent = `${title} • ${userName} • ${r.rating}/5`;
    el.reviewsList.appendChild(li);
  });
}

function renderBookTable() {
  const kw = (el.searchBooks.value || '').toLowerCase().trim();
  const filtered = state.books.filter((b) => {
    const blob = `${b._id} ${b.title} ${b.genre || ''} ${b.author || ''}`.toLowerCase();
    return !kw || blob.includes(kw);
  });

  el.booksTableBody.innerHTML = '';
  filtered.forEach((b) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatShortId(b._id)}</td>
      <td>${b.title}</td>
      <td>${b.genre || 'General'}</td>
      <td>${getBookOwnerName(b)}</td>
      <td>${availabilityByBook(b._id)}</td>
      <td>
        <div class="table-actions">
          <button class="icon-btn" data-book-edit="${b._id}" title="Edit" aria-label="Edit">${iconSvg('edit')}</button>
          <button class="icon-btn" data-book-del="${b._id}" title="Delete" aria-label="Delete">${iconSvg('delete')}</button>
          <button class="icon-btn" data-book-view="${b._id}" title="View" aria-label="View">${iconSvg('view')}</button>
        </div>
      </td>
    `;
    el.booksTableBody.appendChild(tr);
  });

  document.querySelectorAll('[data-book-view]').forEach((btn) => {
    btn.addEventListener('click', () => openViewBookModal(btn.dataset.bookView));
  });
  document.querySelectorAll('[data-book-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openEditBookModal(btn.dataset.bookEdit));
  });
  document.querySelectorAll('[data-book-del]').forEach((btn) => {
    btn.addEventListener('click', () => openDeleteBookModal(btn.dataset.bookDel));
  });
}

function renderUserTable() {
  const kw = (el.searchUsers.value || '').toLowerCase().trim();
  const filtered = state.users.filter((u) => {
    const blob = `${u._id} ${u.name} ${u.email} ${u.role}`.toLowerCase();
    return !kw || blob.includes(kw);
  });

  el.usersTableBody.innerHTML = '';
  filtered.forEach((u) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatShortId(u._id)}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${buildUsernameFromEmail(u.email)}</td>
      <td>${u.role}</td>
      <td>
        <div class="table-actions">
          <button class="icon-btn" data-user-edit="${u._id}" title="Edit" aria-label="Edit">${iconSvg('edit')}</button>
          <button class="icon-btn" data-user-del="${u._id}" title="Delete" aria-label="Delete">${iconSvg('delete')}</button>
          <button class="icon-btn" data-user-view="${u._id}" title="View" aria-label="View">${iconSvg('view')}</button>
        </div>
      </td>
    `;
    el.usersTableBody.appendChild(tr);
  });

  document.querySelectorAll('[data-user-view]').forEach((btn) => {
    btn.addEventListener('click', () => openViewUserModal(btn.dataset.userView));
  });
  document.querySelectorAll('[data-user-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openEditUserModal(btn.dataset.userEdit));
  });
  document.querySelectorAll('[data-user-del]').forEach((btn) => {
    btn.addEventListener('click', () => openDeleteUserModal(btn.dataset.userDel));
  });
}

async function refreshAll() {
  const [users, books, reviews] = await Promise.all([
    window.adminHelpers.fetchUsers(),
    window.apiHelpers.fetchBooks(),
    window.apiHelpers.fetchReviews(),
  ]);
  state.users = users;
  state.books = books;
  state.reviews = reviews;

  renderDashboard();
  renderBookTable();
  renderUserTable();
}

function openAddBookModal() {
  showModal(`
    <div class="modal-header">${modalTitle('Add Book', 'book')}<button class="modal-close">x</button></div>
    <form id="bookAddForm" class="modal-form">
      <input name="title" placeholder="Title" required />
      <input name="author" placeholder="Author" required />
      <input name="genre" placeholder="Genre" required />
      <input name="coverImage" placeholder="Cover image URL" />
      <input name="publishedDate" type="date" />
      <textarea name="description" placeholder="Description"></textarea>
      <div class="modal-actions">
        <button type="button" class="light-btn modal-close">Cancel</button>
        <button type="submit" class="dark-btn">Add</button>
      </div>
    </form>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((b) => b.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#bookAddForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const token = localStorage.getItem('bm_token');
    const res = await fetch(`${window.apiHelpers.apiBase}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Create failed');
    closeModal();
    await refreshAll();
    el.status.textContent = 'Tạo sách thành công.';
    setTimeout(() => { el.status.textContent = ''; }, 3000);
  });
}

function openEditBookModal(bookId) {
  const b = state.books.find((x) => x._id === bookId);
  if (!b) return;

  showModal(`
    <div class="modal-header">${modalTitle('Update Book', 'book')}<button class="modal-close">x</button></div>
    <form id="bookEditForm" class="modal-form">
      <input name="title" placeholder="Title" value="${b.title || ''}" required />
      <input name="author" placeholder="Author" value="${b.author || ''}" required />
      <input name="genre" placeholder="Genre" value="${b.genre || ''}" required />
      <input name="coverImage" placeholder="Cover image URL" value="${b.coverImage || ''}" />
      <input name="publishedDate" type="date" value="${b.publishedDate ? String(b.publishedDate).slice(0, 10) : ''}" />
      <textarea name="description" placeholder="Description">${b.description || ''}</textarea>
      <div class="modal-actions">
        <button type="button" class="light-btn modal-close">Cancel</button>
        <button type="submit" class="dark-btn">Update</button>
      </div>
    </form>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#bookEditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const token = localStorage.getItem('bm_token');
    const res = await fetch(`${window.apiHelpers.apiBase}/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Update failed');
    closeModal();
    await refreshAll();
  });
}

function openViewBookModal(bookId) {
  const b = state.books.find((x) => x._id === bookId);
  if (!b) return;

  showModal(`
    <div class="modal-header">${modalTitle('View Book', 'book')}<button class="modal-close">x</button></div>
    <div class="view-grid">
      <p><strong>Book ID:</strong> ${b._id}</p>
      <p><strong>Name:</strong> ${b.title || '-'}</p>
      <p><strong>Language:</strong> ${b.author || '-'}</p>
      <p><strong>Type:</strong> ${b.genre || '-'}</p>
      <p><strong>Owner:</strong> ${getBookOwnerName(b)}</p>
      <p><strong>Cover:</strong> ${b.coverImage || '-'}</p>
      <p><strong>Published:</strong> ${b.publishedDate ? String(b.publishedDate).slice(0, 10) : '-'}</p>
      <p><strong>Availability:</strong> ${availabilityByBook(b._id)}</p>
    </div>
    <div class="modal-actions single"><button type="button" class="dark-btn modal-close">Close</button></div>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
}

function openDeleteBookModal(bookId) {
  showModal(`
    <div class="modal-header">${modalTitle('Delete Confirmation', 'delete')}<button class="modal-close">x</button></div>
    <p class="delete-text">Are you certain you wish to proceed with deleting this book?</p>
    <div class="modal-actions single"><button id="confirmDeleteBook" class="dark-btn">Confirm</button></div>
  `);
  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#confirmDeleteBook').addEventListener('click', async () => {
    try {
      await window.apiHelpers.deleteBook(bookId);
      closeModal();
      await refreshAll();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  });
}

function openAddUserModal() {
  showModal(`
    <div class="modal-header">${modalTitle('Add User', 'user')}<button class="modal-close">x</button></div>
    <form id="userAddForm" class="modal-form">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <select name="role">
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <div class="modal-actions">
        <button type="button" class="light-btn modal-close">Cancel</button>
        <button type="submit" class="dark-btn">Add</button>
      </div>
    </form>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#userAddForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    const createRes = await fetch(`${window.apiHelpers.apiBase}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const createData = await createRes.json();
    if (!createRes.ok) return alert(createData.message || 'Create user failed');

    if (payload.role === 'admin') {
      const token = localStorage.getItem('bm_token');
      await fetch(`${window.apiHelpers.apiBase}/users/${createData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: 'admin' }),
      });
    }

    closeModal();
    await refreshAll();
  });
}

function openEditUserModal(userId) {
  const u = state.users.find((x) => x._id === userId);
  if (!u) return;

  showModal(`
    <div class="modal-header">${modalTitle('Update User', 'user')}<button class="modal-close">x</button></div>
    <form id="userEditForm" class="modal-form">
      <input name="name" placeholder="Name" value="${u.name || ''}" required />
      <input name="email" type="email" placeholder="Email" value="${u.email || ''}" required />
      <input name="password" type="password" placeholder="Password (leave empty to keep)" />
      <select name="role">
        <option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option>
        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
      </select>
      <div class="modal-actions">
        <button type="button" class="light-btn modal-close">Cancel</button>
        <button type="submit" class="dark-btn">Update</button>
      </div>
    </form>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#userEditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    if (!payload.password) delete payload.password;

    const token = localStorage.getItem('bm_token');
    const res = await fetch(`${window.apiHelpers.apiBase}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Update user failed');

    closeModal();
    await refreshAll();
  });
}

function openViewUserModal(userId) {
  const u = state.users.find((x) => x._id === userId);
  if (!u) return;

  showModal(`
    <div class="modal-header">${modalTitle('View User', 'user')}<button class="modal-close">x</button></div>
    <div class="view-grid">
      <p><strong>User ID:</strong> ${u._id}</p>
      <p><strong>Name:</strong> ${u.name || '-'}</p>
      <p><strong>Email:</strong> ${u.email || '-'}</p>
      <p><strong>Username:</strong> ${buildUsernameFromEmail(u.email)}</p>
      <p><strong>Role:</strong> ${u.role}</p>
    </div>
    <div class="modal-actions single"><button type="button" class="dark-btn modal-close">Close</button></div>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
}

function openDeleteUserModal(userId) {
  showModal(`
    <div class="modal-header">${modalTitle('Delete Confirmation', 'delete')}<button class="modal-close">x</button></div>
    <p class="delete-text">Are you certain you wish to proceed with deleting this user?</p>
    <div class="modal-actions single"><button id="confirmDeleteUser" class="dark-btn">Confirm</button></div>
  `);

  el.modalRoot.querySelectorAll('.modal-close').forEach((x) => x.addEventListener('click', closeModal));
  el.modalRoot.querySelector('#confirmDeleteUser').addEventListener('click', async () => {
    try {
      await window.adminHelpers.deleteUser(userId);
      closeModal();
      await refreshAll();
    } catch (err) {
      alert(err.message || 'Delete user failed');
    }
  });
}

async function init() {
  const currentUser = window.apiHelpers.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    el.status.textContent = 'You need admin access to open this page.';
    return;
  }

  el.welcome.textContent = `${currentUser.name || currentUser.email} • ${currentUser.role}`;
  renderClock();
  setInterval(renderClock, 1000);

  wireSidebar();
  wireTopButtons();

  try {
    el.status.textContent = 'Loading data...';
    await refreshAll();
    el.status.textContent = '';
  } catch (err) {
    el.status.textContent = err.message || 'Could not load the dashboard';
  }
}

init();
