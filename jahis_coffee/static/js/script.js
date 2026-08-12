// ==========================================================
// JAHIS COFFEE
// FILTER MENU + SHOPPING CART
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // FILTER MENU
    // ======================================================

    const categoryButtons =
        document.querySelectorAll(".category-button");

    const productCards =
        document.querySelectorAll(".product-card");

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const selectedCategory =
                button.dataset.category;

            productCards.forEach(card => {

                const category =
                    card.dataset.category;

                if (
                    selectedCategory === "Semua" ||
                    selectedCategory === category
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });


    // ======================================================
    // CART
    // ======================================================

    let cart = [];


    // ======================================================
    // ELEMENT CART YANG SUDAH ADA DI HTML
    // ======================================================

    const cartOverlay =
        document.querySelector(".cart-overlay");

    const cartDrawer =
        document.querySelector(".cart-drawer");

    const cartButton =
        document.querySelector(".cart-button");

    const cartClose =
        document.querySelector(".cart-close");

    const cartItems =
        document.querySelector(".cart-items");

    const cartEmpty =
        document.querySelector(".cart-empty");

    const cartTotalPrice =
        document.querySelector(".cart-total-price");

    const whatsappButton =
        document.querySelector(".whatsapp-order-button");


    // ======================================================
    // CEK ELEMENT
    // ======================================================

    if (!cartOverlay) {
        console.error("cart-overlay tidak ditemukan.");
        return;
    }

    if (!cartItems) {
        console.error("cart-items tidak ditemukan.");
        return;
    }


    // ======================================================
    // FORMAT RUPIAH
    // ======================================================

    function formatRupiah(number) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(number) || 0);

    }


    // ======================================================
    // AMANKAN TEXT HTML
    // ======================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;

    }


    // ======================================================
    // BUKA CART
    // ======================================================

    function openCart() {

        cartOverlay.classList.add("active");

        document.body.classList.add("cart-open");

    }


    // ======================================================
    // TUTUP CART
    // ======================================================

    function closeCart() {

        cartOverlay.classList.remove("active");

        document.body.classList.remove("cart-open");

    }


    // ======================================================
    // BUTTON PESANAN
    // ======================================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    // ======================================================
    // BUTTON CLOSE
    // ======================================================

    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );

    }


    // ======================================================
    // KLIK AREA LUAR DRAWER
    // ======================================================

    cartOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target === cartOverlay
            ) {
                closeCart();
            }

        }
    );


    // ======================================================
    // ESC UNTUK MENUTUP
    // ======================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeCart();
            }

        }
    );


    // ======================================================
    // TOMBOL TAMBAH PESANAN
    // ======================================================

    const addButtons =
        document.querySelectorAll(".add-button");

    addButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    String(button.dataset.id || "");

                const name =
                    String(button.dataset.name || "");

                const price =
                    Number(button.dataset.price);


                // Pastikan data lengkap
                if (
                    !id ||
                    !name ||
                    Number.isNaN(price)
                ) {

                    console.error(
                        "Data produk tidak lengkap:",
                        button.dataset
                    );

                    return;

                }


                // Cari produk
                const existing =
                    cart.find(
                        item => item.id === id
                    );


                // Kalau sudah ada
                if (existing) {

                    existing.quantity += 1;

                }

                // Kalau belum ada
                else {

                    cart.push({
                        id: id,
                        name: name,
                        price: price,
                        quantity: 1
                    });

                }


                // Update cart
                updateCart();


                // Buka cart
                openCart();


                // Animasi tombol
                const original =
                    button.innerHTML;

                button.classList.add("added");

                button.innerHTML = `
                    <span>✓</span>
                    Ditambahkan
                `;


                setTimeout(() => {

                    button.classList.remove(
                        "added"
                    );

                    button.innerHTML =
                        original;

                }, 900);

            }
        );

    });


    // ======================================================
    // UPDATE SEMUA CART
    // ======================================================

    function updateCart() {

        updateCartCount();

        renderCart();

        updateCartTotal();

    }


    // ======================================================
    // UPDATE ANGKA PESANAN
    // ======================================================

    function updateCartCount() {

        const totalItems =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        if (!cartButton) {
            return;
        }


        const count =
            cartButton.querySelector(".cart-count");


        if (count) {

            count.textContent =
                totalItems;

        }

        else {

            cartButton.innerHTML = `
                <span class="cart-button-label">
                    Pesanan
                </span>

                <span class="cart-count">
                    ${totalItems}
                </span>
            `;

        }

    }


    // ======================================================
    // TAMPILKAN ISI CART
    // ======================================================

    function renderCart() {

        cartItems.innerHTML = "";


        // ==============================
        // KOSONG
        // ==============================

        if (cart.length === 0) {

            if (cartEmpty) {
                cartEmpty.style.display = "flex";
            }

            cartItems.style.display = "none";

            if (whatsappButton) {
                whatsappButton.disabled = true;
            }

            return;

        }


        // ==============================
        // ADA ISI
        // ==============================

        if (cartEmpty) {
            cartEmpty.style.display = "none";
        }

        cartItems.style.display = "block";


        if (whatsappButton) {
            whatsappButton.disabled = false;
        }


        // ==============================
        // TAMPILKAN PRODUK
        // ==============================

        cart.forEach(item => {

            const subtotal =
                item.price *
                item.quantity;


            const element =
                document.createElement("div");

            element.className =
                "cart-item";

            element.dataset.id =
                item.id;


            element.innerHTML = `

                <div class="cart-item-top">

                    <div class="cart-item-info">

                        <span class="cart-item-label">
                            JAHIS COFFEE
                        </span>

                        <h3>
                            ${escapeHTML(item.name)}
                        </h3>

                        <p>
                            ${formatRupiah(item.price)}
                            / item
                        </p>

                    </div>


                    <button
                        type="button"
                        class="cart-remove"
                        data-id="${escapeHTML(item.id)}"
                    >
                        ×
                    </button>

                </div>


                <div class="cart-item-bottom">

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${escapeHTML(item.id)}"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${escapeHTML(item.id)}"
                        >
                            +
                        </button>

                    </div>


                    <strong>
                        ${formatRupiah(subtotal)}
                    </strong>

                </div>

            `;


            cartItems.appendChild(element);

        });

    }


    // ======================================================
    // TOTAL HARGA
    // ======================================================

    function updateCartTotal() {

        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    (
                        item.price *
                        item.quantity
                    ),
                0
            );


        if (cartTotalPrice) {

            cartTotalPrice.textContent =
                formatRupiah(total);

        }

    }


    // ======================================================
    // PLUS / MINUS / HAPUS
    // ======================================================

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const id =
                String(button.dataset.id || "");


            const product =
                cart.find(
                    item => item.id === id
                );


            if (!product) {
                return;
            }


            // PLUS
            if (
                button.classList.contains(
                    "quantity-plus"
                )
            ) {

                product.quantity += 1;

                updateCart();

                return;

            }


            // MINUS
            if (
                button.classList.contains(
                    "quantity-minus"
                )
            ) {

                product.quantity -= 1;


                if (
                    product.quantity <= 0
                ) {

                    cart =
                        cart.filter(
                            item =>
                                item.id !== id
                        );

                }


                updateCart();

                return;

            }


            // HAPUS
            if (
                button.classList.contains(
                    "cart-remove"
                )
            ) {

                cart =
                    cart.filter(
                        item =>
                            item.id !== id
                    );


                updateCart();

            }

        }
    );


    // ======================================================
    // WHATSAPP
    // ======================================================

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {
                    return;
                }


                const lines = [
                    "Halo Jahis Coffee, saya ingin memesan:",
                    ""
                ];


                cart.forEach(
                    (item, index) => {

                        const subtotal =
                            item.price *
                            item.quantity;


                        lines.push(
                            `${index + 1}. ${item.name}`
                        );

                        lines.push(
                            `${item.quantity} x ${formatRupiah(item.price)}`
                        );

                        lines.push(
                            `Subtotal: ${formatRupiah(subtotal)}`
                        );

                        lines.push("");

                    }
                );


                const total =
                    cart.reduce(
                        (sum, item) =>
                            sum +
                            (
                                item.price *
                                item.quantity
                            ),
                        0
                    );


                lines.push(
                    `TOTAL: ${formatRupiah(total)}`
                );


                lines.push("");

                lines.push(
                    "Terima kasih."
                );


                // nmr wa bree
                const whatsappNumber =
                    "6285126404400";


                const message =
                    encodeURIComponent(
                        lines.join("\n")
                    );


                const url =
                    `https://wa.me/${whatsappNumber}?text=${message}`;


                window.open(
                    url,
                    "_blank"
                );

            }
        );

    }


    // ======================================================
    // INITIAL
    // ======================================================

    updateCart();

});