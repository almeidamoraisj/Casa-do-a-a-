// ---- Configuração ----
const WHATSAPP_PHONE = "5566992600308"; // (66) 99260-0308 — troque se precisar

// ---- Catálogo ----
const MARMITAS = [
  { name: "Marmita Premium", desc: "Sonho de Valsa, Ouro Branco, Creme de Avelã e Creme de Ninho" },
  { name: "Marmita Verão", desc: "Kiwi, morango e banana" },
  { name: "Marmita Duplo Sabor Açaí e Cupuaçu", desc: "Metade açaí, metade cupuaçu", free: "Grátis granola" },
  { name: "Marmita da Felicidade", desc: "Creme de avelã, chocoball, disquete, ovomaltine e creme de ninho" },
  { name: "Marmita Tradição", desc: "Granola, leite condensado, leite em pó, paçoca e banana" },
  { name: "Marmita da Casa", desc: "Banana, morango, kiwi, creme de avelã e creme de ninho" },
  { name: "Marmita Cupuaçu", desc: "Cupuaçu puro e cremoso", free: "Grátis granola" },
];
const MARMITA_PRICE = 40;

const SIZES = [
  { label: "300ml", price: 20 },
  { label: "480ml", price: 25 },
  { label: "600ml", price: 27 },
];

const COPOS = [
  { name: "Copo Premium", desc: "Sonho de Valsa, Ouro Branco, Creme de Avelã e Creme de Ninho" },
  { name: "Copo Duplo Sabor Açaí e Cupuaçu", desc: "Metade açaí, metade cupuaçu", free: "Grátis granola" },
  { name: "Copo Verão", desc: "Kiwi, morango e banana" },
  { name: "Copo Tradição", desc: "Granola, leite condensado, leite em pó, paçoca e banana" },
  { name: "Copo Felicidade", desc: "Creme de avelã, chocoball, disquete, ovomaltine e creme de ninho" },
  { name: "Copo Cupuaçu", desc: "Cupuaçu puro e cremoso", free: "Grátis granola" },
];

const CASA = { name: "Copo da Casa", desc: "Banana, morango, kiwi, creme de avelã e creme de ninho", size: "600ml", price: 35 };

const ADICIONAIS = [
  { name: "Leite em pó", price: 3 },
  { name: "Leite condensado", price: 3 },
  { name: "Morango", price: 6 },
  { name: "Banana", price: 3 },
  { name: "Kiwi", price: 6 },
  { name: "Sonho de Valsa", price: 4 },
  { name: "Ouro Branco", price: 4 },
  { name: "Creme de Ninho", price: 5 },
  { name: "Paçoca", price: 2 },
  { name: "Chocoball", price: 3 },
  { name: "Disquete", price: 3 },
  { name: "Ovomaltine", price: 5 },
  { name: "Granola", price: 3 },
  { name: "Creme de Avelã", price: 6 },
];

// ---- Registro de itens (cada linha comprável vira um índice) ----
const ITEMS = []; // {label, price, category}
const cartQty = {}; // index -> qty

function regItem(label, price, category) {
  ITEMS.push({ label, price, category });
  return ITEMS.length - 1;
}

function fmtBRL(n) {
  return "R$ " + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// ---- Construção do cardápio (HTML gerado a partir dos dados) ----
function stepperHtml(i) {
  const qty = cartQty[i] || 0;
  return `
    <div class="stepper">
      <button type="button" id="minus-${i}" ${qty === 0 ? 'disabled' : ''} onclick="changeQty(${i}, -1)">−</button>
      <span class="qty-count" id="qty-${i}">${qty}</span>
      <button type="button" onclick="changeQty(${i}, 1)">+</button>
    </div>`;
}

function buildMarmitas() {
  const grid = document.getElementById('marmitasGrid');
  grid.innerHTML = MARMITAS.map(m => {
    const i = regItem(`${m.name} (750ml)`, MARMITA_PRICE, 'Marmitas');
    return `
      <div class="item-card">
        <h3>${m.name}</h3>
        <p class="item-desc">${m.desc}</p>
        ${m.free ? `<span class="free-topping">${m.free}</span>` : ''}
        <div class="item-rows">
          <div class="item-row">
            <div class="item-row-info">
              <span class="item-row-size">750ml</span>
              <span class="item-row-price">${fmtBRL(MARMITA_PRICE)}</span>
            </div>
            <div id="stepper-${i}">${stepperHtml(i)}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function buildCopos() {
  const grid = document.getElementById('coposGrid');
  grid.innerHTML = COPOS.map(c => {
    const rows = SIZES.map(s => {
      const i = regItem(`${c.name} (${s.label})`, s.price, 'Copos');
      return `
        <div class="item-row">
          <div class="item-row-info">
            <span class="item-row-size">${s.label}</span>
            <span class="item-row-price">${fmtBRL(s.price)}</span>
          </div>
          <div id="stepper-${i}">${stepperHtml(i)}</div>
        </div>`;
    }).join('');
    return `
      <div class="item-card">
        <h3>${c.name}</h3>
        <p class="item-desc">${c.desc}</p>
        ${c.free ? `<span class="free-topping">${c.free}</span>` : ''}
        <div class="item-rows">${rows}</div>
      </div>`;
  }).join('');
}

function buildCasa() {
  const i = regItem(`${CASA.name} (${CASA.size})`, CASA.price, 'Copo da Casa');
  document.getElementById('casaFeature').innerHTML = `
    <div class="casa-feature-info">
      <h3>${CASA.name}</h3>
      <p>${CASA.desc}</p>
    </div>
    <div class="casa-feature-price">
      <span class="price-tag">${fmtBRL(CASA.price)}<small>${CASA.size}</small></span>
      <div id="stepper-${i}">${stepperHtml(i)}</div>
    </div>`;
}

function buildAdicionais() {
  const grid = document.getElementById('adicionaisGrid');
  grid.innerHTML = ADICIONAIS.map(a => {
    const i = regItem(a.name, a.price, 'Adicionais');
    return `
      <div class="add-row">
        <div class="add-row-info">
          <span class="add-row-name">${a.name}</span>
          <span class="add-row-price">${fmtBRL(a.price)}</span>
        </div>
        <div id="stepper-${i}">${stepperHtml(i)}</div>
      </div>`;
  }).join('');
}

// ---- Estado do carrinho ----
function changeQty(i, delta) {
  const next = Math.max(0, (cartQty[i] || 0) + delta);
  if (next === 0) delete cartQty[i];
  else cartQty[i] = next;
  renderAll();
}

function cartCount() {
  return Object.values(cartQty).reduce((sum, q) => sum + q, 0);
}

function cartTotal() {
  return Object.entries(cartQty).reduce((sum, [i, q]) => sum + q * ITEMS[i].price, 0);
}

// ---- Atualiza apenas os números/estados dos steppers no cardápio ----
function updateMenuSteppers() {
  ITEMS.forEach((item, i) => {
    const qtyEl = document.getElementById(`qty-${i}`);
    const minusEl = document.getElementById(`minus-${i}`);
    if (qtyEl) qtyEl.textContent = cartQty[i] || 0;
    if (minusEl) minusEl.disabled = !cartQty[i];
  });
}

// ---- Renderiza a lista do carrinho ----
function renderCartItems() {
  const itemsEl = document.getElementById('cartItems');
  const indices = Object.keys(cartQty);

  if (indices.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.<br>Escolhe um açaí no cardápio 🍇</div>`;
    return;
  }

  itemsEl.innerHTML = indices.map(i => {
    const item = ITEMS[i];
    const qty = cartQty[i];
    return `
      <div class="cart-line">
        <div class="cart-line-info">
          <h4>${item.label}</h4>
          <span>${fmtBRL(item.price)} cada · ${fmtBRL(item.price * qty)}</span>
        </div>
        <div class="stepper">
          <button type="button" onclick="changeQty(${i}, -1)">−</button>
          <span class="qty-count">${qty}</span>
          <button type="button" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>`;
  }).join('');
}

// ---- Habilita/desabilita o botão de confirmar ----
function updateConfirmState() {
  const hasItems = cartCount() > 0;
  const name = document.getElementById('custName').value.trim();
  const payment = document.getElementById('custPayment').value;

  document.getElementById('cartTotal').textContent = fmtBRL(cartTotal());
  document.getElementById('cartConfirmBtn').disabled = !(hasItems && name && payment);
}

// ---- Barra flutuante ----
function renderCartBar() {
  const count = cartCount();
  const bar = document.getElementById('cartBar');
  document.getElementById('cartBarCount').textContent = count;
  document.getElementById('cartBarTotal').textContent = fmtBRL(cartTotal());
  bar.classList.toggle('visible', count > 0);
}

function renderAll() {
  updateMenuSteppers();
  renderCartItems();
  renderCartBar();
  updateConfirmState();
}

// ---- Abrir / fechar painel ----
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Monta a mensagem agrupada por categoria e abre o WhatsApp ----
function confirmOrder() {
  const indices = Object.keys(cartQty);
  if (indices.length === 0) return;

  const name = document.getElementById('custName').value.trim();
  const payment = document.getElementById('custPayment').value;
  const note = document.getElementById('custNote').value.trim();
  if (!name || !payment) return;

  const categories = ['Marmitas', 'Copos', 'Copo da Casa', 'Adicionais'];
  let msg = "Olá! Quero fazer um pedido:\n";

  categories.forEach(cat => {
    const catIndices = indices.filter(i => ITEMS[i].category === cat);
    if (catIndices.length === 0) return;
    msg += `\n*${cat}*\n`;
    catIndices.forEach(i => {
      const item = ITEMS[i];
      const qty = cartQty[i];
      msg += `• ${qty}x ${item.label} — ${fmtBRL(item.price * qty)}\n`;
    });
  });

  msg += `\nTotal: ${fmtBRL(cartTotal())}`;
  msg += `\n\nNome: ${name}`;
  msg += `\nForma de pagamento: ${payment}`;
  msg += `\nObservação: ${note ? note : "-"}`;
  msg += `\n\n📍 Vou enviar minha localização em seguida, aqui pelo WhatsApp.`;

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

// ---- Inicialização ----
buildMarmitas();
buildCopos();
buildCasa();
buildAdicionais();
renderAll();
