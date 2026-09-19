/*
  Shared catalogue logic.
  - Renders product cards into any grid (home preview, catalogue, related).
  - Powers the /products page: search + category filters working together.
  Product data lives in products-data.js (window.PRODUCTS_DATA).
*/
(function () {
  const PRODUCTS = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
  const CATEGORIES = Array.isArray(window.PRODUCT_CATEGORIES) ? window.PRODUCT_CATEGORIES : [];

  function detailUrl(slug, withEnquire) {
    return '/products/' + encodeURIComponent(slug) + (withEnquire ? '?enquire=1' : '');
  }

  function cardHtml(p) {
    const img = p.thumb || p.image;
    return `
    <article class="product-card catalog-card">
      <a class="product-photo" href="${detailUrl(p.slug)}" style="background-image: linear-gradient(160deg, rgba(13, 57, 38, .03), rgba(13, 57, 38, .4)), url('${img}');" aria-label="View details of ${p.name}">
        <span class="photo-label">${p.tag || p.category}</span>
      </a>
      <div class="product-card-body">
        <div class="product-card-header">
          <span class="product-cat-pill">${p.category}</span>
        </div>
        <h3><a href="${detailUrl(p.slug)}" class="card-title-link">${p.name}</a></h3>
        <p class="product-desc">${p.shortDescription}</p>
        <div class="product-card-footer">
          <span class="product-origin"><span class="origin-pin">📍</span> ${p.origin}</span>
          <div class="product-card-actions">
            <a href="${detailUrl(p.slug)}" class="button button-outline-dark button-sm">View Details</a>
            <a href="${detailUrl(p.slug, true)}" class="button button-lime button-sm" data-product="${p.name}">Enquire</a>
          </div>
        </div>
      </div>
    </article>`;
  }

  // Render a list of products into a grid container
  window.renderProductCards = function (container, products) {
    if (!container) return;
    container.innerHTML = products.map(cardHtml).join('');
  };

  /* ---------------- Catalogue page ---------------- */
  const grid = document.getElementById('productsGrid');
  const filtersContainer = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('productSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const emptyState = document.getElementById('emptyState');
  const catalogMeta = document.getElementById('catalogMeta');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  let currentCategory = 'All';
  let searchQuery = '';

  function initCategoryFilters() {
    if (!filtersContainer) return;
    const categories = ['All', ...CATEGORIES];
    filtersContainer.innerHTML = categories
      .map((cat) => `
        <button type="button" class="filter-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}" aria-pressed="${cat === currentCategory}">
          ${cat}
        </button>`)
      .join('');

    filtersContainer.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category') || 'All';
        filtersContainer.querySelectorAll('.filter-btn').forEach((b) => {
          const isActive = b.getAttribute('data-category') === currentCategory;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });
        renderProducts();
      });
    });
  }

  function getFilteredProducts() {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = currentCategory === 'All' || p.category === currentCategory;
      const searchable = [
        p.name, p.category, p.shortDescription, p.description,
        p.origin, p.tag, (p.keywords || []).join(' ')
      ].join(' ').toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      return matchesCategory && matchesSearch;
    });
  }

  function renderProducts() {
    if (!grid || !catalogMeta) return;
    const filtered = getFilteredProducts();
    const total = PRODUCTS.length;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      if (emptyState) emptyState.removeAttribute('hidden');
      catalogMeta.textContent = `No products found (0 of ${total})`;
      return;
    }

    if (emptyState) emptyState.setAttribute('hidden', '');
    grid.style.display = 'grid';
    window.renderProductCards(grid, filtered);

    let statusText = total === filtered.length
      ? `${total} products`
      : `${filtered.length} of ${total} products`;
    if (currentCategory !== 'All') statusText += ` in ${currentCategory}`;
    if (searchQuery.trim()) statusText += ` matching "${searchQuery.trim()}"`;
    catalogMeta.textContent = statusText;
  }

  // Deep link support: products.html?category=Rice
  if (grid) {
    const urlCategory = new URLSearchParams(window.location.search).get('category');
    if (urlCategory && CATEGORIES.includes(urlCategory)) currentCategory = urlCategory;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (searchQuery.length > 0) clearSearchBtn.removeAttribute('hidden');
        else clearSearchBtn.setAttribute('hidden', '');
      }
      renderProducts();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      searchQuery = '';
      clearSearchBtn.setAttribute('hidden', '');
      renderProducts();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      searchQuery = '';
      currentCategory = 'All';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.setAttribute('hidden', '');
      if (filtersContainer) {
        filtersContainer.querySelectorAll('.filter-btn').forEach((b) => {
          const isAll = b.getAttribute('data-category') === 'All';
          b.classList.toggle('active', isAll);
          b.setAttribute('aria-pressed', String(isAll));
        });
      }
      renderProducts();
    });
  }

  /* ---------------- Home preview grid ---------------- */
  const homeGrid = document.getElementById('homeProductsGrid');
  if (homeGrid) {
    window.renderProductCards(homeGrid, PRODUCTS.slice(0, 6));
  }

  /* ---------------- Product <datalist> for enquiry forms ---------------- */
  const datalist = document.getElementById('productList');
  if (datalist) {
    datalist.innerHTML = PRODUCTS.map((p) => `<option value="${p.name}"></option>`).join('');
  }

  function init() {
    initCategoryFilters();
    renderProducts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
