const products = [
  {
    id: 1,
    name: "Chicago / LA Shield",
    category: "layners",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Bordado 3D premium con acabado urbano y textura de alto impacto.",
    badge: "New Drop"
  },
  {
    id: 2,
    name: "NYC Basketball 3D",
    category: "layners",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Acabado textil premium con diseño exclusivo para día y noche.",
    badge: "Limited"
  },
  {
    id: 3,
    name: "Nike Swoosh Clásica",
    category: "gorras",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1521369909026-2afc0b7c5b8f?auto=format&fit=crop&w=900&q=80",
    description: "Visera curva en varios tonos con estilo clásico y sobrio.",
    badge: "Top"
  },
  {
    id: 4,
    name: "Adidas / Puma Visera Plana",
    category: "gorras",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    description: "Modelo urbano con corte moderno y excelente comodidad.",
    badge: "Classic"
  },
  {
    id: 5,
    name: "Overshirt Street",
    category: "urbano",
    price: 17000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Prenda ligera ideal para looks diarios con personalidad.",
    badge: "Best Seller"
  },
  {
    id: 6,
    name: "Canguro Essential",
    category: "urbano",
    price: 17000,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description: "Diseño casual y funcional para un outfit moderno y cómodo.",
    badge: "Fresh"
  },
  {
    id: 7,
    name: "Buzo DROP CBA",
    category: "urbano",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Buzo oversize con diseño premium para looks diarios y callejeros.",
    badge: "New"
  },
  {
    id: 8,
    name: "Los Angeles Legacy",
    category: "gorras",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    description: "Gorra premium con bordado vintage estilo L.A. y color cálido urbano.",
    badge: "Premium"
  },
  {
    id: 9,
    name: "NYC Heritage",
    category: "gorras",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1521369909026-2afc0b7c5b8f?auto=format&fit=crop&w=900&q=80",
    description: "Modelo de perfil clásico con acabado premium y visión de la ciudad.",
    badge: "Heritage"
  },
  {
    id: 10,
    name: "Chicago Core",
    category: "gorras",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description: "Gorra con bordado sobrio y diseño urbano para uso diario.",
    badge: "Classic"
  }
];

const cartKey = "dropcba-cart";
const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
const WHATSAPP_NUMBER = "5493518631873";

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartPanel = document.getElementById("cartPanel");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

let activeCategory = "all";

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function getVisibleProducts() {
  return activeCategory === "all"
    ? products
    : products.filter((product) => product.category === activeCategory);
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <img class="product-image" src="${product.image}" alt="${product.name}" />
          <div class="product-body">
            <span class="product-badge">${product.badge}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <span class="product-price">$${product.price.toLocaleString("es-AR")}</span>
              <button class="add-btn" data-id="${product.id}">Agregar</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      const product = products.find((item) => item.id === productId);
      addToCart(product);
    });
  });
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;
  let count = 0;

  cartItems.innerHTML = cart
    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      count += item.quantity;

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="item-controls">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">Eliminar</button>
          </div>
          <div class="item-price">$${subtotal.toLocaleString("es-AR")}</div>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `$${total.toLocaleString("es-AR")}`;
  cartCount.textContent = count;

  document.querySelectorAll(".qty-btn, .remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      const action = button.dataset.action;

      if (action === "plus") changeQuantity(productId, 1);
      if (action === "minus") changeQuantity(productId, -1);
      if (action === "remove") removeItem(productId);
    });
  });
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  cartPanel.classList.add("open");
}

function changeQuantity(productId, amount) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeItem(productId);
    return;
  }

  saveCart();
  renderCart();
}

function removeItem(productId) {
  const index = cart.findIndex((product) => product.id === productId);
  if (index === -1) return;

  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("active", btn === button);
      });

      renderProducts();
    });
  });
}

function setupCartInteractions() {
  cartButton.addEventListener("click", () => cartPanel.classList.toggle("open"));
  closeCart.addEventListener("click", () => cartPanel.classList.remove("open"));

  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) return;

    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const text = encodeURIComponent(
      `Hola DROP CBA, quiero finalizar mi compra.\n\n${cart
        .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString("es-AR")}`)
        .join("\n")}\n\nTotal: $${total.toLocaleString("es-AR")}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  });
}

setupFilters();
setupCartInteractions();
renderProducts();
renderCart();
