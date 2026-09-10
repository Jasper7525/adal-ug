export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adal Uganda Company Limited | LPG Cooking Gas Distribution Mbarara</title>
  <meta name="description" content="Official LPG cooking gas cylinder distribution in Mbarara, Uganda. Fast delivery, 3kg, 6kg, 12.5kg, 38kg complete cylinders and refills with certified accessories." />
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts: Outfit & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              dark: '#0f172a',
              cyan: '#0891b2',
              cyanDark: '#0e7490',
              flame: '#f97316',
              amber: '#f59e0b',
            }
          },
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, h4, .font-display { font-family: 'Outfit', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white">

  <!-- Top Announcement Bar -->
  <div class="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold text-[11px] border border-orange-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
          Express Mbarara Dispatch
        </span>
        <span>Fast 30–45 min gas refills across Kakoba, Kamukuzi, Booma, Nyamitanga & Ruharo</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+256772123456" class="font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
          <i data-lucide="phone" class="w-3.5 h-3.5"></i>
          Hotline: +256 772 123 456
        </a>
      </div>
    </div>
  </div>

  <!-- Glassmorphic Sticky Header -->
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <svg class="w-10 h-10 shrink-0 select-none" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 80L50.5 29C52.4 25.6 56.8 24.8 59.8 27.2L62.2 29.2C64.2 30.8 64.8 33.7 63.5 36L35.2 80.5C33.8 82.7 31.4 84 28.8 84H22C20.3 84 19.2 82.2 20 80.7L22 80Z" fill="#0B2953"/>
          <path d="M64 26.5C65.8 24.8 68.7 25.1 70.2 27.1L98.5 66.2C100.2 68.6 99.8 72 97.6 73.9L87.5 82.5C85.5 84.2 82.6 84.3 80.4 82.8L76.2 80C74.2 78.6 73 76.3 73 73.8V71C73 69.3 73.8 67.8 75.2 66.8L84.8 59.8C86.4 58.6 86.8 56.3 85.7 54.6L68.8 29.8C67.7 28.2 65.9 27.2 64 26.5Z" fill="#2BA829"/>
          <path d="M57 41.5C58.6 39.2 62 39.2 63.6 41.5L74.8 57.8C76.6 60.4 75.1 64 71.9 64H48.7C45.5 64 44 60.4 45.8 57.8L57 41.5Z" fill="#F58220"/>
          <path d="M53.5 59H73C75.2 59 77.2 60.3 78.1 62.3L86.2 78.8C87.3 81.1 85.9 83.8 83.4 84.4L80.5 85.1C78.2 85.7 75.8 84.6 74.8 82.5L67.5 67.8C66.8 66.4 65.4 65.5 63.8 65.5H51.5C49 65.5 47.3 62.9 48.4 60.6L49.5 58.5C50.3 56.8 52 59 53.5 59Z" fill="#F58220"/>
          <polygon points="60.3,47 53.5,57 67.1,57" fill="#F58220"/>
        </svg>
        <div>
          <div class="flex items-baseline gap-1 font-display font-black text-xl tracking-wider">
            <span class="text-[#0B2953]">ADAL</span>
            <span class="text-[#2BA829]">ENERGIES</span>
          </div>
          <p class="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase -mt-0.5">Towards Clean Energy • Mbarara</p>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
        <a href="#home" class="hover:text-cyan-700 transition-colors">Home</a>
        <a href="#catalog" class="hover:text-cyan-700 transition-colors">Cylinders & Prices</a>
        <a href="#features" class="hover:text-cyan-700 transition-colors">Why Adal</a>
        <a href="#order" class="hover:text-cyan-700 transition-colors">Quick Order</a>
        <a href="#contact" class="hover:text-cyan-700 transition-colors">Contact & Depot</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="#order" class="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Order Now</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="home" class="relative bg-slate-900 text-white pt-12 pb-20 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold">
            <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i>
            Official UNBS Certified LPG Distributor in Mbarara City
          </div>
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-tight text-white">
            Pure Flame, Safe Cooking Gas <span class="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Delivered in 30 Mins</span> Across Mbarara.
          </h1>
          <p class="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Adal Uganda supplies genuine, high-efficiency LPG cylinders and refills for homes, hostels, and hotels. Enjoy verified digital scale weight, smokeless blue heat, and complimentary doorstep leak tests.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="#order" class="px-7 py-4 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-300 hover:to-amber-400 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2">
              <i data-lucide="flame" class="w-5 h-5 fill-slate-950"></i>
              <span>Instant Quick Order</span>
            </a>
            <a href="#catalog" class="px-6 py-4 rounded-2xl text-base font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center">
              <span>View Cylinders & Prices</span>
            </a>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="relative rounded-3xl p-6 bg-slate-800/80 border border-slate-700 shadow-2xl space-y-4">
            <h3 class="text-xl font-bold font-display text-white flex items-center gap-2">
              <i data-lucide="truck" class="w-5 h-5 text-cyan-400"></i>
              Mbarara Fast Delivery Hub
            </h3>
            <p class="text-xs text-slate-300">Riders deployed across Kakoba, Kamukuzi, Booma, Nyamitanga, Ruharo, Katete & Biharwe.</p>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">Domestic & Commercial Sizes</p>
                <p class="text-sm font-bold text-white">3kg • 6kg • 12.5kg • 38kg</p>
              </div>
              <span class="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                From UGX 28,000
              </span>
            </div>
            <div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 shrink-0"></i>
              <span>Free digital scale test on arrival + complimentary soapy water leak check.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Order Form Component -->
  <section id="order" class="py-20 bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-3xl font-extrabold font-display">Place Your Delivery Order</h2>
        <p class="text-sm text-slate-400 mt-2">Select your cylinder size, enter your delivery landmark in Mbarara, and our rider will arrive promptly.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-6">
          <h3 class="text-lg font-bold font-display">1. Choose LPG Items</h3>
          
          <div class="grid grid-cols-2 gap-3" id="cylinder-options">
            <button onclick="selectItem('6kg Refill', 52000)" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-left transition">
              <span class="text-xs font-bold text-orange-400 block">6kg Household Refill</span>
              <span class="text-sm font-extrabold text-white">UGX 52,000</span>
            </button>
            <button onclick="selectItem('12.5kg Refill', 110000)" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-left transition">
              <span class="text-xs font-bold text-cyan-400 block">12.5kg Family Refill</span>
              <span class="text-sm font-extrabold text-white">UGX 110,000</span>
            </button>
            <button onclick="selectItem('3kg Refill', 28000)" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-left transition">
              <span class="text-xs font-bold text-slate-300 block">3kg Student Refill</span>
              <span class="text-sm font-extrabold text-white">UGX 28,000</span>
            </button>
            <button onclick="selectItem('38kg Commercial Refill', 320000)" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-left transition">
              <span class="text-xs font-bold text-amber-400 block">38kg Commercial Refill</span>
              <span class="text-sm font-extrabold text-white">UGX 320,000</span>
            </button>
          </div>

          <h3 class="text-lg font-bold font-display pt-4 border-t border-slate-700">2. Delivery Location in Mbarara</h3>
          <div class="space-y-4">
            <input type="text" id="order-name" placeholder="Full Name" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <input type="tel" id="order-phone" placeholder="Phone Number (e.g. 0772 123 456)" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <select id="order-zone" onchange="updateTotal()" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="0">Mbarara City Center & High Street (FREE Delivery)</option>
              <option value="2000">Kamukuzi & Booma Hill (+UGX 2,000)</option>
              <option value="2000">Kakoba & Ntare (+UGX 2,000)</option>
              <option value="3000">Nyamitanga & Katete (+UGX 3,000)</option>
              <option value="3000">Ruharo & Bwizibwera Rd (+UGX 3,000)</option>
              <option value="5000">Biharwe & Eclipse Monument (+UGX 5,000)</option>
            </select>
            <input type="text" id="order-address" placeholder="Specific House, Hostel or Nearby Landmark" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        <!-- Sticky Summary -->
        <div class="lg:col-span-5 bg-slate-800/95 rounded-2xl p-6 border border-slate-700 space-y-4">
          <h3 class="text-base font-bold text-white font-display border-b border-slate-700 pb-3">Order Summary</h3>
          <div class="text-xs space-y-2 text-slate-300">
            <div class="flex justify-between">
              <span>Selected Item:</span>
              <span id="summary-item" class="font-bold text-white">6kg Household Refill</span>
            </div>
            <div class="flex justify-between">
              <span>Gas Price:</span>
              <span id="summary-price" class="font-bold text-white">UGX 52,000</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee:</span>
              <span id="summary-delivery" class="font-bold text-white">FREE</span>
            </div>
            <div class="flex justify-between">
              <span>Leak Test & Setup:</span>
              <span class="text-emerald-400 font-bold">FREE</span>
            </div>
            <div class="pt-3 border-t border-slate-700 flex justify-between items-baseline">
              <span class="text-sm font-bold text-white uppercase">Total Payable:</span>
              <span id="summary-total" class="text-2xl font-extrabold text-orange-400 font-display">UGX 52,000</span>
            </div>
          </div>
          <button onclick="placeOrder()" class="w-full py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-300 hover:to-amber-400 transition font-display">
            Confirm Delivery Order
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact & Mbarara Depot -->
  <footer id="contact" class="bg-slate-950 text-slate-400 text-xs py-16 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 class="text-sm font-bold text-white mb-2">Adal Uganda Company Limited</h4>
        <p class="text-slate-400 leading-relaxed">Western Uganda's trusted LPG cooking gas distribution hub. Direct doorstep deliveries across all divisions of Mbarara City.</p>
      </div>
      <div>
        <h4 class="text-sm font-bold text-white mb-2">Mbarara Depot</h4>
        <p class="text-slate-400 leading-relaxed">Plot 14, Mbarara-Masaka Highway, Near Shell Malindi & Central Market, Mbarara City, Uganda.</p>
        <p class="mt-2 text-orange-400 font-semibold">Hotline: +256 772 123 456</p>
      </div>
      <div>
        <h4 class="text-sm font-bold text-white mb-2">Safety Standards</h4>
        <p class="text-slate-400">UNBS US EAS 900 Certified Cylinders with authentic digital scale verification upon delivery.</p>
      </div>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    let currentItem = '6kg Household Refill';
    let currentPrice = 52000;

    function selectItem(name, price) {
      currentItem = name;
      currentPrice = price;
      document.getElementById('summary-item').textContent = name;
      document.getElementById('summary-price').textContent = 'UGX ' + price.toLocaleString();
      updateTotal();
    }

    function updateTotal() {
      const zoneFee = parseInt(document.getElementById('order-zone').value, 10);
      const deliveryEl = document.getElementById('summary-delivery');
      if (zoneFee === 0) {
        deliveryEl.textContent = 'FREE';
      } else {
        deliveryEl.textContent = 'UGX ' + zoneFee.toLocaleString();
      }
      const total = currentPrice + zoneFee;
      document.getElementById('summary-total').textContent = 'UGX ' + total.toLocaleString();
    }

    function placeOrder() 
      const name = document.getElementById('order-name').value;
      const phone = document.getElementById('order-phone').value;
      const address = document.getElementById('order-address').value;
      if (!name || !phone || !address) {
        alert('Please fill in your name, phone number, and delivery address in Mbarara.');
        return;
      }
      const ref = 'ADAL-MBR-' + Math.floor(1000 + Math.random() * 9000);
      const text = encodeURIComponent('Order Ref #' + ref + ' for ' + name + ' (' + phone + '): ' + currentItem + ' to ' + address + ' in Mbarara.');
      window.open('https://wa.me/256772123456?text=' + text, '_blank');
    }
  </script>
</body>
</html>`;
