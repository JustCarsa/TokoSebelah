// Admin Panel — TOKOSEBELAH
// Dummy navigation only, no real backend logic.

(function () {
  'use strict';

  // ============= Page navigation =============
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const pages = document.querySelectorAll('.page');
  const sidebar = document.getElementById('sidebar');
  const btnToggle = document.getElementById('btnToggle');

  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-page');

      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      pages.forEach(p => {
        p.style.display = p.id === 'page-' + target ? 'block' : 'none';
      });

      // Close sidebar on mobile after click
      if (window.innerWidth < 992) {
        sidebar.classList.remove('open');
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ============= Sidebar toggle (mobile) =============
  if (btnToggle) {
    btnToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  document.addEventListener('click', function (e) {
    if (window.innerWidth >= 992) return;
    if (!sidebar.contains(e.target) && !btnToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // ============= Edit buttons → open modal =============

  // PRODUCT TABLE: edit pencil icons inside product rows
  document.querySelectorAll('.product-table .icon-action').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon && icon.classList.contains('fa-edit')) {
      btn.addEventListener('click', function () {
        // Get product name from the same row (for nicer feel)
        const row = btn.closest('tr');
        const prodName = row ? row.querySelector('.prod-name') : null;

        // Update modal title
        const title = document.getElementById('productModalTitle');
        const saveBtn = document.getElementById('productModalSave');
        if (title) title.textContent = prodName
          ? 'Edit Produk: ' + prodName.textContent
          : 'Edit Produk';
        if (saveBtn) saveBtn.textContent = 'Simpan Perubahan';

        // Show modal (Bootstrap 4 jQuery API)
        $('#productModal').modal('show');
      });
    }
  });

  // Reset modal title when "Tambah Produk" button opens it
  document.querySelectorAll('[data-target="#productModal"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const title = document.getElementById('productModalTitle');
      const saveBtn = document.getElementById('productModalSave');
      if (title) title.textContent = 'Tambah Produk Baru';
      if (saveBtn) saveBtn.textContent = 'Simpan Produk';
    });
  });

  // CATEGORY CARDS: edit buttons
  document.querySelectorAll('#page-categories .cat-card').forEach(card => {
    const editBtn = card.querySelector('.btn-outline-pink');
    if (editBtn) {
      editBtn.addEventListener('click', function () {
        const catTitle = card.querySelector('h5');
        const catNameInput = document.getElementById('catName');
        if (catNameInput && catTitle) {
          catNameInput.value = catTitle.textContent.trim();
        }
        $('#categoryModal').modal('show');
      });
    }
  });

  // BANNER CARDS: edit buttons
  document.querySelectorAll('#page-banners .banner-card').forEach(card => {
    const editBtn = card.querySelector('.btn-outline-pink');
    if (editBtn) {
      editBtn.addEventListener('click', function () {
        const bannerTitle = card.querySelector('strong');
        const bannerTitleInput = document.getElementById('bannerTitle');
        if (bannerTitleInput && bannerTitle) {
          bannerTitleInput.value = bannerTitle.textContent.trim();
        }
        $('#bannerModal').modal('show');
      });
    }
  });

})();
