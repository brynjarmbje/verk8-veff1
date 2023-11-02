import { createCartLine, showCartContent } from './lib/ui.js';

/**
 * @typedef {object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];


/** 
 * Bæta vöru í körfu 
* @param {Product} product
 * @param {number} quantity
 */

function calculateTotal() {
  const cartRows = document.querySelectorAll('.cart table tbody tr');
  let total = 0;

  cartRows.forEach((row) => {
    const priceElement = row.querySelector('.price');
    const quantityElement = row.querySelector('input[type="number"]');
    const price = Number(priceElement.textContent.replace(' kr.-', '').replace('.', ''));
    const quantity = Number(quantityElement.value);

    total += price * quantity;
  });

  return total;
}

function updateTotal() {
  const totalElement = document.querySelector('.cart tfoot .price');
  const total = calculateTotal();
  totalElement.textContent = `${total.toLocaleString('is-IS')} kr.-`;
}

function showOrderForm() {
  const orderForm = document.querySelector('.klara-pontun');
  orderForm.classList.remove('hidden');
}

function addProductToCart(product, quantity) {
 const cartTableBodyElement = document.querySelector('.cart table tbody');
 
  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart table');
    return;
  }
  
  // Athuga hvort lína fyrir vöruna sé þegar til
  const existingProductRow = cartTableBodyElement.querySelector(`[data-cart-product-id="${product.id}"]`);
  
  if (existingProductRow) {
    const currentQuantity = Number(existingProductRow.querySelector('.quantity').textContent);
    existingProductRow.querySelector('.quantity').textContent = currentQuantity + quantity;
  } else {
    const cartLine = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(cartLine);
  }
  // Sýna efni körfu
  showCartContent(true);
  showOrderForm();

  // Sýna/uppfæra samtölu körfu
  updateTotal();
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr');

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product){
    return;
  }

  // Finna fjölda sem á að bæta við körfu með því að athuga á input
  const inputElement = parent.querySelector('input[type="number"]');
  const quantity = inputElement ? Number(inputElement.value) : 1;

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

document.querySelector('.cart table tbody').addEventListener('input', (e) => {
  if (e.target.type === 'number') {
    updateTotal();
  }
});

// Bæta við event handler á form sem submittar pöntun
document.querySelector('section.cart form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const cartSection = document.querySelector('section.cart');
  cartSection.classList.add('hidden');
  
  const receiptSection = document.querySelector('section.receipt');
  receiptSection.classList.remove('hidden');
});

document.querySelector('.klara-pontun').addEventListener('submit', (e) => {
  e.preventDefault();

  // Fela Nafn og heimilisfang
  document.querySelector('section.cart').classList.add('hidden');
  
  // Syna Nafn og heimilisfang
  document.querySelector('section.receipt').classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  updateTotal();
});