const cart = JSON.parse(localStorage.getItem('dropcba-cart')) || [];

const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartButton = document.getElementById('cartButton');
const closeCart = document.getElementById('closeCart');

function saveCart() {
  localStorage.setItem('dropcba-cart', JSON.stringify(cart));
}

function updateCart() {
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
    cartTotal.textContent = '$0';
    cartCount.textContent = '0';
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    total += item.price * item.quantity;
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
        <div class="item-price">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
      </div>
    `;
  }).join('');

  cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
  cartCount.textContent = count;
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart();
  updateCart();
  cartPanel.classList.add('open');
}

function changeQuantity(id, action) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  if (action === 'plus') {
    item.quantity += 1;
  }

  if (action === 'minus') {
    item.quantity -= 1;
  }

  if (item.quantity <= 0) {
    const index = cart.findIndex(product => product.id === id);
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeItem(id) {
  const index = cart.findIndex(product => product.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function setupEvents() {
  document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const id = Number(card.dataset.id);
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      addToCart(id, name, price);
    });
  });

  cartButton.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const { action, id } = button.dataset;
    const productId = Number(id);

    if (action === 'plus') changeQuantity(productId, 'plus');
    if (action === 'minus') changeQuantity(productId, 'minus');
    if (action === 'remove') removeItem(productId);
  });
}

setupEvents();
updateCart();
