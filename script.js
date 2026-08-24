const products=[
{name:"Elegant Satin Dress",price:38000,cat:"women",img:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85"},
{name:"Premium Men's Set",price:45000,cat:"men",img:"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=85"},
{name:"Luxury Handbag",price:28000,cat:"accessories",img:"https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85"},
{name:"Classic Stiletto Heel",price:32000,cat:"accessories",img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"},
{name:"Gold Statement Watch",price:26000,cat:"accessories",img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"},
{name:"Chic Everyday Blouse",price:18000,cat:"women",img:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85"},
{name:"Classic Black Blazer",price:42000,cat:"men",img:"https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=900&q=85"},
{name:"Signature Mini Bag",price:24000,cat:"accessories",img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"}
];

let cart=JSON.parse(localStorage.getItem("wealthyCart")||"[]");
let activeFilter="all";

const money=n=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);
const grid=document.getElementById("productGrid");

function renderProducts(){
  const list=activeFilter==="all"?products:products.filter(p=>p.cat===activeFilter);
  grid.innerHTML=list.map((p,i)=>`
    <article class="product">
      <div class="product-img" style="background-image:url('${p.img}')" data-index="${products.indexOf(p)}">
        <button class="heart" aria-label="Add to wishlist">♡</button>
      </div>
      <div class="product-info">
        <small>${p.cat}</small>
        <h3>${p.name}</h3>
        <strong>${money(p.price)}</strong>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".product-img").forEach(el=>el.addEventListener("click",e=>{
    if(e.target.classList.contains("heart"))return;
    openProduct(products[+el.dataset.index]);
  }));
  grid.querySelectorAll(".heart").forEach(b=>b.addEventListener("click",e=>{
    e.stopPropagation(); b.textContent=b.textContent==="♡"?"♥":"♡";
  }));
}
renderProducts();

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); activeFilter=btn.dataset.filter; renderProducts();
}));

function save(){localStorage.setItem("wealthyCart",JSON.stringify(cart));renderCart();}
function addToCart(p){const item=cart.find(x=>x.name===p.name);item?item.qty++:cart.push({...p,qty:1});save();openCart();}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById("cartItems");
  box.innerHTML=cart.length?cart.map((p,i)=>`
    <div class="cart-row">
      <img src="${p.img}" alt="${p.name}">
      <div><h4>${p.name}</h4><small>${p.qty} × ${money(p.price)}</small></div>
      <button class="remove" data-i="${i}">Remove</button>
    </div>`).join(""):`<p class="empty">Your bag is waiting for something beautiful.</p>`;
  box.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.i,1);save()});
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
renderCart();

const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

const modal=document.getElementById("productModal");
let currentProduct=null;
function openProduct(p){
  currentProduct=p;
  document.getElementById("modalImage").style.backgroundImage=`url('${p.img}')`;
  document.getElementById("modalCategory").textContent=p.cat.toUpperCase();
  document.getElementById("modalName").textContent=p.name;
  document.getElementById("modalPrice").textContent=money(p.price);
  document.getElementById("modalWhatsapp").href=`https://wa.me/2348039090007?text=${encodeURIComponent("Hello Wealthy Boutique, I'm interested in the "+p.name+" ("+money(p.price)+").")}`;
  modal.classList.add("open");
}
document.getElementById("modalClose").onclick=()=>modal.classList.remove("open");
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
document.getElementById("modalAdd").onclick=()=>{addToCart(currentProduct);modal.classList.remove("open")};

document.getElementById("menuToggle").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("open"));

document.getElementById("searchBtn").onclick=()=>{
  const q=prompt("What are you looking for? (e.g. dress, bag, men's)");
  if(!q)return;
  const term=q.toLowerCase();
  const found=products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(term));
  grid.innerHTML=found.length?found.map((p)=>`<article class="product"><div class="product-img" style="background-image:url('${p.img}')" data-index="${products.indexOf(p)}"></div><div class="product-info"><small>${p.cat}</small><h3>${p.name}</h3><strong>${money(p.price)}</strong></div></article>`).join(""):`<p>No matching pieces found. Try another search.</p>`;
  grid.querySelectorAll(".product-img").forEach(el=>el.onclick=()=>openProduct(products[+el.dataset.index]));
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
};

document.getElementById("accountBtn").onclick=()=>alert("Customer account area is ready for integration with your preferred login/database service.");
document.getElementById("wishlistBtn").onclick=()=>alert("Wishlist is available in the product cards. Full account sync can be added when the store backend is connected.");
document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){alert("Your bag is empty.");return}
  alert("Checkout demo: connect Paystack/Flutterwave and your delivery system here when the store goes live.");
};

document.getElementById("newsletterForm").onsubmit=e=>{
  e.preventDefault();
  document.getElementById("newsletterMsg").textContent="Thank you — you're on the list.";
  e.target.reset();
};

// Multi-page behavior
const pageCartCount=document.getElementById("cartCount");
if(pageCartCount) pageCartCount.textContent=cart.reduce((s,x)=>s+x.qty,0);

const cartPageItems=document.getElementById("cartPageItems");
if(cartPageItems){
  function renderCartPage(){
    const data=JSON.parse(localStorage.getItem("wealthyCart")||"[]");
    cartPageItems.innerHTML=data.length?data.map((p,i)=>`<div class="cart-page-row"><img src="${p.img}" alt="${p.name}"><div><h3>${p.name}</h3><small>${p.qty} × ${money(p.price)}</small></div><button data-remove="${i}">Remove</button></div>`).join(""):`<p class="empty">Your bag is empty. <a href="shop.html">Continue shopping →</a></p>`;
    const total=data.reduce((s,x)=>s+x.price*x.qty,0);
    const totalEl=document.getElementById("cartPageTotal"); if(totalEl) totalEl.textContent=money(total);
    cartPageItems.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{data.splice(+b.dataset.remove,1);localStorage.setItem("wealthyCart",JSON.stringify(data));renderCartPage();if(pageCartCount)pageCartCount.textContent=data.reduce((s,x)=>s+x.qty,0)});
  }
  renderCartPage();
  const cb=document.getElementById("checkoutBtn"); if(cb) cb.onclick=()=>{const data=JSON.parse(localStorage.getItem("wealthyCart")||"[]");alert(data.length?"Checkout demo: connect Paystack/Flutterwave and your delivery system here when the store goes live.":"Your bag is empty.")};
}

const contactForm=document.getElementById("contactForm");
if(contactForm) contactForm.onsubmit=e=>{e.preventDefault();document.getElementById("contactMsg").textContent="Thank you. Your message has been received.";contactForm.reset()};

document.querySelectorAll(".auth-tabs button").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".auth-tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  document.getElementById("loginForm").classList.toggle("hidden",btn.dataset.auth!=="login");
  document.getElementById("registerForm").classList.toggle("hidden",btn.dataset.auth!=="register");
});
const loginForm=document.getElementById("loginForm");
if(loginForm) loginForm.onsubmit=e=>{e.preventDefault();document.getElementById("loginMsg").textContent="Demo login successful. Connect your authentication backend to make accounts live.";};
const registerForm=document.getElementById("registerForm");
if(registerForm) registerForm.onsubmit=e=>{e.preventDefault();document.getElementById("registerMsg").textContent="Demo account created. Connect your database/auth service to save accounts.";};

if(document.getElementById("accountBtn")) document.getElementById("accountBtn").onclick=()=>location.href="login.html";
