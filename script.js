const foods = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:249,rating:"4.8",badge:"Bestseller",description:"Classic cheese, tomato and fresh basil.",image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Farmhouse Pizza",category:"Pizza",price:329,rating:"4.9",badge:"Popular",description:"Loaded with fresh veggies and cheese.",image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Classic Cheese Burger",category:"Burger",price:179,rating:"4.7",badge:"Fan favourite",description:"Juicy patty, cheese and our special sauce.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Crispy Veg Burger",category:"Burger",price:149,rating:"4.6",badge:"Crispy",description:"Crunchy veggie patty with fresh lettuce.",image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Hyderabadi Biryani",category:"Biryani",price:279,rating:"4.9",badge:"Chef's pick",description:"Aromatic rice with rich spices and herbs.",image:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Veg Dum Biryani",category:"Biryani",price:219,rating:"4.7",badge:"Comfort food",description:"Slow-cooked rice with fragrant spices.",image:"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Veg Hakka Noodles",category:"Chinese",price:189,rating:"4.6",badge:"Street style",description:"Wok-tossed noodles with crunchy vegetables.",image:"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Chilli Paneer",category:"Chinese",price:229,rating:"4.8",badge:"Spicy",description:"Soft paneer tossed in a tangy chilli sauce.",image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80"},
  {id:9,name:"Chocolate Brownie",category:"Dessert",price:129,rating:"4.9",badge:"Sweet treat",description:"Rich, fudgy chocolate goodness.",image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80},
  {id:10,name:"Strawberry Cheesecake",category:"Dessert",price:169,rating:"4.8",badge:"Must try",description:"Creamy cheesecake with strawberry topping.",image:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"}
];

let activeCategory = "All";
let cart = [];
const foodGrid = document.getElementById("food-grid");
const searchInput = document.getElementById("food-search");
const cartModal = document.getElementById("cart-modal");
const cartCount = document.getElementById("cart-count");
const money = value => "₹" + value.toLocaleString("en-IN");

function renderFoods() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = foods.filter(food => (activeCategory === "All" || food.category === activeCategory) &&
    (food.name.toLowerCase().includes(query) || food.category.toLowerCase().includes(query) || food.description.toLowerCase().includes(query)));
  foodGrid.innerHTML = filtered.map(food => `
    <article class="food-card">
      <div class="food-image"><img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80'"><span class="food-badge">★ ${food.rating} · ${food.badge}</span></div>
      <div class="food-info"><span class="food-category">${food.category}</span><h3>${food.name}</h3><p class="food-description">${food.description}</p><div class="food-bottom"><span class="food-price">${money(food.price)}</span><button class="add-button" data-add="${food.id}" aria-label="Add ${food.name} to cart">+</button></div></div>
    </article>`).join("");
  document.getElementById("empty-state").hidden = filtered.length > 0;
}

function addToCart(id) {
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity += 1;
  else cart.push({id, quantity:1});
  updateCart();
  showToast("Added to your cart!");
}

function updateQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const food = foods.find(food => food.id === item.id);
    return sum + food.price * item.quantity;
  }, 0);
  cartCount.textContent = count;
  document.getElementById("cart-items").innerHTML = cart.map(item => {
    const food = foods.find(food => food.id === item.id);
    return `<div class="cart-row"><img src="${food.image}" alt=""><div><h4>${food.name}</h4><small>${money(food.price)} each</small><div class="quantity-control"><button data-quantity="${food.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${food.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><span class="cart-row-price">${money(food.price * item.quantity)}</span></div>`;
  }).join("");
  document.getElementById("cart-empty").hidden = count > 0;
  document.getElementById("cart-summary").hidden = count === 0;
  document.getElementById("cart-subtotal").textContent = money(subtotal);
  document.getElementById("cart-total").textContent = money(subtotal);
}

function openCart() {
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  document.getElementById("close-cart").focus();
}
function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Smooth-scroll all in-page links and account for the sticky header.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", link.getAttribute("href"));
  });
});

document.getElementById("category-list").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
  renderFoods();
});
foodGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
searchInput.addEventListener("input", renderFoods);
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("continue-shopping").addEventListener("click", () => { closeCart(); document.getElementById("menu").scrollIntoView({behavior:"smooth"}); });
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-quantity]");
  if (button) updateQuantity(Number(button.dataset.quantity), Number(button.dataset.change));
});
cartModal.addEventListener("click", event => { if (event.target === cartModal) closeCart(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
document.getElementById("checkout-button").addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  updateCart();
  closeCart();
  showToast("Thank you! This was a demo order.");
});
document.getElementById("year").textContent = new Date().getFullYear();
renderFoods();
updateCart();
