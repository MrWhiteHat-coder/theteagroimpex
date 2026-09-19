/*
  Product detail page logic.
  Reads the slug from /products/<slug>, renders the product from
  window.PRODUCTS_DATA, sets dynamic SEO tags + Product JSON-LD,
  and wires the enquiry modal and related products.
*/
(function () {
  const PRODUCTS = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];

  function getSlug() {
    const match = window.location.pathname.match(/\/products\/([^\/?#]+)/i);
    return match ? decodeURIComponent(match[1]).toLowerCase() : '';
  }

  const slug = getSlug();
  const product = PRODUCTS.find((p) => p.slug.toLowerCase() === slug);
  const root = document.getElementById('productDetailRoot');
  const notFound = document.getElementById('productNotFound');

  if (!product) {
    if (root) root.style.display = 'none';
    if (notFound) notFound.removeAttribute('hidden');
    return;
  }

  const SITE_URL = 'https://theteagroimpex.in';
  const canonical = `${SITE_URL}/products/${product.slug}`;

  /* ---------------- Dynamic SEO + social metadata ---------------- */
  document.title = `${product.name} Exporter from India | Thete Agro Impex`;
  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', 'content', `${product.shortDescription} Sourced in Maharashtra and exported by Thete Agro Impex, Nashik, India.`);
  setMeta('link[rel="canonical"]', 'href', canonical);
  setMeta('meta[property="og:title"]', 'content', `${product.name} — Exporter from India | Thete Agro Impex`);
  setMeta('meta[property="og:description"]', 'content', product.shortDescription);
  setMeta('meta[property="og:url"]', 'content', canonical);
  setMeta('meta[property="og:image"]', 'content', product.image);
  setMeta('meta[name="twitter:title"]', 'content', `${product.name} — Exporter from India | Thete Agro Impex`);
  setMeta('meta[name="twitter:description"]', 'content', product.shortDescription);
  setMeta('meta[name="twitter:image"]', 'content', product.image);

  /* ---------------- Product structured data ---------------- */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    category: product.category,
    description: product.shortDescription,
    image: [product.image],
    brand: { '@type': 'Brand', name: 'Thete Agro Impex' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Thete Agro Impex',
      url: SITE_URL + '/',
      email: 'support@theteagroimpex.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Office No.3, Morya V2S4 Building, Chandshi, Jalalpur',
        addressLocality: 'Nashik',
        addressRegion: 'Maharashtra',
        postalCode: '422003',
        addressCountry: 'IN'
      }
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Origin', value: product.origin },
      { '@type': 'PropertyValue', name: 'Packaging', value: product.packaging },
      { '@type': 'PropertyValue', name: 'Availability', value: product.availability }
    ]
  });
  document.head.appendChild(ld);

  /* ---------------- BreadcrumbList structured data ---------------- */
  const bcLd = document.createElement('script');
  bcLd.type = 'application/ld+json';
  bcLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: SITE_URL + '/products' },
      { '@type': 'ListItem', position: 3, name: product.category, item: `${SITE_URL}/products?category=${encodeURIComponent(product.category)}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: canonical }
    ]
  });
  document.head.appendChild(bcLd);

  /* ---------------- Gallery (main image + thumbnails) ---------------- */
  const gallery = [product.image];
  if (product.thumb && product.thumb !== product.image) gallery.push(product.thumb);

  /* ---------------- Render ---------------- */
  function render() {
    const breadcrumbs = document.getElementById('productBreadcrumb');
    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <a href="index.html">Home</a> <span>/</span>
        <a href="products.html">Products</a> <span>/</span>
        <a href="products.html?category=${encodeURIComponent(product.category)}">${product.category}</a> <span>/</span>
        <span aria-current="page">${product.name}</span>`;
    }

    root.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-gallery">
          <div class="product-gallery-main" id="galleryMain" style="background-image: linear-gradient(160deg, rgba(13,57,38,.03), rgba(13,57,38,.35)), url('${product.image}');" role="img" aria-label="${product.name}"></div>
          <div class="product-gallery-thumbs" id="galleryThumbs">
            ${gallery.map((img, i) => `
              <button type="button" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${img}" aria-label="View image ${i + 1} of ${product.name}"></button>`).join('')}
          </div>
        </div>

        <div class="product-detail-info">
          <span class="product-cat-pill">${product.category}</span>
          <h1 class="product-detail-title">${product.name}</h1>
          <p class="product-detail-short">${product.shortDescription}</p>

          <div class="detail-specs">
            <div class="spec-row"><span class="spec-label">Origin</span><span class="spec-value">${product.origin}</span></div>
            <div class="spec-row"><span class="spec-label">Packaging</span><span class="spec-value">${product.packaging}</span></div>
            <div class="spec-row"><span class="spec-label">Availability</span><span class="spec-value">${product.availability}</span></div>
          </div>

          <div class="product-detail-actions">
            <button type="button" class="button button-lime" id="detailEnquireBtn">Enquire Now <span>↗</span></button>
            <a class="text-link" href="products.html">Back to catalogue <span>→</span></a>
          </div>
        </div>
      </div>

      <div class="product-detail-lower">
        <div class="detail-block">
          <h2>Product overview</h2>
          <p>${product.description}</p>
        </div>
        <div class="detail-block">
          <h2>Specifications</h2>
          <ul class="spec-list">
            ${(product.specifications || []).map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="detail-block">
          <h2>Export &amp; packaging information</h2>
          <ul class="spec-list">
            <li><strong>Origin:</strong> ${product.origin}</li>
            <li><strong>Packaging:</strong> ${product.packaging}</li>
            <li><strong>Availability:</strong> ${product.availability}</li>
          </ul>
        </div>
      </div>`;

    /* Gallery switching */
    const main = document.getElementById('galleryMain');
    root.querySelectorAll('.gallery-thumb').forEach((btn) => {
      btn.addEventListener('click', () => {
        main.style.backgroundImage = `linear-gradient(160deg, rgba(13,57,38,.03), rgba(13,57,38,.35)), url('${btn.dataset.img}')`;
        root.querySelectorAll('.gallery-thumb').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* Enquiry modal wiring */
    const enquireBtn = document.getElementById('detailEnquireBtn');
    const modal = document.getElementById('enquiryModal');
    const modalProduct = document.getElementById('m-product');
    if (enquireBtn && modal) {
      enquireBtn.addEventListener('click', () => {
        if (modalProduct) modalProduct.value = product.name;
        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');
        const first = modal.querySelector('input[name="name"]');
        if (first) first.focus();
      });
    }

    /* Related products */
    const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
    const relatedSection = document.getElementById('relatedSection');
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedSection && relatedGrid) {
      if (related.length > 0) {
        relatedSection.removeAttribute('hidden');
        window.renderProductCards(relatedGrid, related);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
