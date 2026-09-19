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
            <a class="button button-outline-dark detail-wa-btn" target="_blank" rel="noopener" aria-label="Enquire about ${product.name} on WhatsApp" href="https://wa.me/917378781899?text=${encodeURIComponent('Hi Thete Agro Impex, I would like to enquire about ' + product.name + '.')}">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="wa-icon"><path d="M20.5 3.5A11 11 0 0 0 3.2 17.4L2 22l4.7-1.2A11 11 0 1 0 20.5 3.5Zm-8.4 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.7.8-2.7-.2-.3A9 9 0 1 1 12.1 20.5Zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.3 8 8 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.6s.3-.3.4-.5.1-.3 0-.5-.7-1.7-1-2.3-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.4c.7.3 1.2.4 1.7.5a4 4 0 0 0 1.8-.1 3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.3Z"/></svg>
              WhatsApp Enquiry
            </a>
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
