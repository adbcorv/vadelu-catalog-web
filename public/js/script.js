document.addEventListener("DOMContentLoaded", () => {

    // LOADER
    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader?.classList.add("hide");
        }, 500);
    });

    // NAVBAR
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle?.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    navLinks?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });
    });

    window.addEventListener("scroll", () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 50);
    });


    // SEARCH
    const searchToggle = document.getElementById("searchToggle");
    const searchPanel = document.getElementById("searchPanel");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");

    searchToggle?.addEventListener("click", () => {
        searchPanel.classList.toggle("show");
        searchInput.focus();
    });

    searchClose?.addEventListener("click", () => {
        searchPanel.classList.remove("show");
        searchInput.value = "";
        filterProducts();
    });

    searchInput?.addEventListener("input", filterProducts);


    // PRODUCT FILTER
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterIndicator = document.getElementById("filterIndicator");
    const productCards = document.querySelectorAll(".product-card");
    const emptyMessage = document.getElementById("emptyMessage");

    let activeCategory = "all";

    function updateIndicator(button) {
        if (!button || !filterIndicator) return;

        filterIndicator.style.width = `${button.offsetWidth}px`;
        filterIndicator.style.transform = `translateX(${button.offsetLeft - 5}px)`;
    }

    function filterProducts() {
        const keyword = searchInput?.value.toLowerCase() || "";
        let visibleCount = 0;

        productCards.forEach(card => {
            const category = card.dataset.category;
            const name = card.dataset.name.toLowerCase();

            const categoryMatch =
                activeCategory === "all" || category === activeCategory;

            const searchMatch = name.includes(keyword);

            const visible = categoryMatch && searchMatch;

            card.classList.toggle("hidden", !visible);

            if (visible) visibleCount++;
        });

        if (emptyMessage) {
            emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            activeCategory = button.dataset.category;

            updateIndicator(button);
            filterProducts();
        });
    });

    updateIndicator(document.querySelector(".filter-btn.active"));

    window.addEventListener("resize", () => {
        updateIndicator(document.querySelector(".filter-btn.active"));
    });


    // PRODUCT SLIDER
    document.querySelectorAll(".product-card").forEach(card => {

        const slides = card.querySelectorAll(".product-slide");
        const dots = card.querySelectorAll(".slide-dot");

        const prev = card.querySelector(".slide-arrow.prev");
        const next = card.querySelector(".slide-arrow.next");

        if (!slides.length) return;

        let currentSlide = 0;

        function showSlide(index) {

            currentSlide = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === currentSlide);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentSlide);
            });

        }

        prev?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            showSlide(currentSlide - 1);
        });

        next?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            showSlide(currentSlide + 1);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                showSlide(index);
            });
        });

    });


    // SHOPPING BAG
    const bagToggle = document.getElementById("bagToggle");
    const bagClose = document.getElementById("bagClose");
    const bagDrawer = document.getElementById("bagDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");

    const bagItemsContainer = document.getElementById("bagItems");
    const bagCount = document.getElementById("bagCount");
    const drawerCount = document.getElementById("drawerCount");
    const bagTotal = document.getElementById("bagTotal");

    const checkoutBtn = document.getElementById("checkoutBtn");

    let cart = [];

    function openBag() {
        bagDrawer.classList.add("show");
        drawerOverlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }

    function closeBag() {
        bagDrawer.classList.remove("show");
        drawerOverlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    bagToggle?.addEventListener("click", openBag);
    bagClose?.addEventListener("click", closeBag);
    drawerOverlay?.addEventListener("click", closeBag);

    function formatPrice(price) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(price);
    }

    function updateCart() {

        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        bagCount.textContent = totalQuantity;
        drawerCount.textContent = totalQuantity;
        bagTotal.textContent = formatPrice(totalPrice);

        if (cart.length === 0) {
            bagItemsContainer.innerHTML = `
                <p class="bag-empty">
                    Your bag is currently empty.
                </p>
            `;
            return;
        }

        bagItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="bag-item">

                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity-control">
                        <button class="quantity-minus" data-index="${index}">−</button>

                        <span>${item.quantity}</span>

                        <button class="quantity-plus" data-index="${index}">+</button>
                    </div>

                </div>

                <button class="remove-item" data-index="${index}">
                    REMOVE
                </button>

            </div>
        `).join("");

        bagItemsContainer.querySelectorAll(".quantity-minus").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart[index].quantity--;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                updateCart();
            });
        });

        bagItemsContainer.querySelectorAll(".quantity-plus").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart[index].quantity++;

                updateCart();
            });
        });

        bagItemsContainer.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                cart.splice(index, 1);

                updateCart();
            });
        });

    }

    function addToCart(product, size = "M") {

        const existing = cart.find(item =>
            item.name === product.name && item.size === size
        );

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                ...product,
                size,
                quantity: 1
            });
        }

        updateCart();
    }

    document.querySelectorAll(".product-card").forEach(card => {

        const addButton = card.querySelector(".add-to-bag");

        addButton?.addEventListener("click", () => {

            const product = {
                name: card.dataset.name,
                price: Number(card.dataset.price),
                image: card.dataset.image
            };

            addToCart(product);

            openBag();

        });

    });


    // QUICK VIEW
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");

    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalDescription = document.getElementById("modalDescription");

    const modalSize = document.getElementById("modalSize");
    const modalAdd = document.getElementById("modalAdd");

    let selectedProduct = null;

    function openModal(product) {

        selectedProduct = product;

        modalImage.src = product.image;
        modalName.textContent = product.name;
        modalPrice.textContent = formatPrice(product.price);
        modalDescription.textContent = product.description;

        modalOverlay.classList.add("show");
        document.body.classList.add("no-scroll");

    }

    function closeModal() {
        modalOverlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    document.querySelectorAll(".quick-view").forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const card = button.closest(".product-card");

            const product = {
                name: card.dataset.name,
                price: Number(card.dataset.price),
                image: card.dataset.image,
                description: card.dataset.description
            };

            openModal(product);

        });

    });

    modalClose?.addEventListener("click", closeModal);

    modalOverlay?.addEventListener("click", event => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    modalAdd?.addEventListener("click", () => {

        if (!selectedProduct) return;

        addToCart(selectedProduct, modalSize.value);

        closeModal();
        openBag();

    });


    // CHECKOUT DEMO
    checkoutBtn?.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your shopping bag is empty.");
            return;
        }

        alert("Thank you for exploring VATRA DE LUCIEN! Checkout feature is coming soon.");

    });


    // REVEAL ANIMATION
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });


    // ESCAPE KEY
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeBag();
            closeModal();
            searchPanel?.classList.remove("show");
            navLinks?.classList.remove("show");
        }

    });

});