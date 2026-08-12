// ==========================================================
// JAHIS COFFEE
// SCRIPT.JS — FILTER + SHOPPING CART + WHATSAPP
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // 1. FILTER KATEGORI
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

                const productCategory =
                    card.dataset.category;

                if (
                    selectedCategory === "Semua" ||
                    selectedCategory === productCategory
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });


    // ======================================================
    // 2. DATA KERANJANG
    // ======================================================

    let cart = [];

    const addButtons =
        document.querySelectorAll(".add-button");

    const cartButton =
        document.querySelector(".cart-button");


    // ======================================================
    // 3. BUAT CART DRAWER
    // ======================================================

    const cartOverlay =
        document.createElement("div");

    cartOverlay.className = "cart-overlay";

    cartOverlay.innerHTML = `
        <aside class="cart-drawer">

            <div class="cart-header">

                <div>
                    <span class="cart-eyebrow">
                        JAHIS COFFEE
                    </span>

                    <h2>
                        Pesanan Anda
                    </h2>
                </div>

                <button
                    type="button"
                    class="cart-close"
                    aria-label="Tutup keranjang"
                >
                    ×
                </button>

            </div>


            <div class="cart-body">

                <div class="cart-empty">

                    <div class="empty-icon">
                        J
                    </div>

                    <h3>
                        Keranjang masih kosong
                    </h3>

                    <p>
                        Pilih kopi favorit Anda
                        dari menu Jahis Coffee.
                    </p>

                </div>


                <div class="cart-items"></div>

            </div>


            <div class="cart-footer">

                <div class="cart-total">

                    <div>

                        <span>
                            Total Pesanan
                        </span>

                        <small>
                            Belum termasuk biaya lainnya
                        </small>

                    </div>

                    <strong class="cart-total-price">
                        Rp0
                    </strong>

                </div>


                <button
                    type="button"
                    class="whatsapp-order-button"
                >
                    <span>
                        Pesan via WhatsApp
                    </span>

                    <span class="order-arrow">
                        →
                    </span>
                </button>


                <p class="cart-footer-note">
                    Pesanan akan diteruskan
                    ke WhatsApp Jahis Coffee.
                </p>

            </div>

        </aside>
    `;

    document.body.appendChild(cartOverlay);


    // ======================================================
    // 4. ELEMENT CART
    // ======================================================

    const cartClose =
        cartOverlay.querySelector(".cart-close");

    const cartItems =
        cartOverlay.querySelector(".cart-items");

    const cartEmpty =
        cartOverlay.querySelector(".cart-empty");

    const cartTotalPrice =
        cartOverlay.querySelector(".cart-total-price");

    const whatsappButton =
        cartOverlay.querySelector(".whatsapp-order-button");


    // ======================================================
    // 5. FORMAT RUPIAH
    // ======================================================

    function formatRupiah(number) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(number) || 0);

    }


    // ======================================================
    // 6. ESCAPE HTML
    // ======================================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    // ======================================================
    // 7. BUKA KERANJANG
    // ======================================================

    function openCart() {

        cartOverlay.classList.add("active");

        document.body.classList.add("cart-open");

    }


    // ======================================================
    // 8. TUTUP KERANJANG
    // ======================================================

    function closeCart() {

        cartOverlay.classList.remove("active");

        document.body.classList.remove("cart-open");

    }


    // ======================================================
    // 9. EVENT CART BUTTON
    // ======================================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    // ======================================================
    // 10. TUTUP CART
    // ======================================================

    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );

    }


    // Klik area luar drawer
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


    // ESC
    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeCart();
            }

        }
    );


    // ======================================================
    // 11. TAMBAHKAN PRODUK
    // ======================================================

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


                // Validasi
                if (
                    !id ||
                    !name ||
                    Number.isNaN(price)
                ) {

                    console.error(
                        "Data produk tidak lengkap:",
                        {
                            id,
                            name,
                            price,
                            dataset: button.dataset
                        }
                    );

                    return;

                }


                // Cari produk yang sudah ada
                const existingProduct =
                    cart.find(
                        item => item.id === id
                    );


                if (existingProduct) {

                    existingProduct.quantity += 1;

                } else {

                    cart.push({
                        id: id,
                        name: name,
                        price: price,
                        quantity: 1
                    });

                }


                // Update tampilan
                updateCart();


                // ==================================================
                // ANIMASI BUTTON
                // ==================================================

                const originalHTML =
                    button.innerHTML;

                button.classList.add("added");

                button.innerHTML = `
                    <span>✓</span>
                    Ditambahkan
                `;


                setTimeout(() => {

                    button.classList.remove("added");

                    button.innerHTML =
                        originalHTML;

                }, 900);


                // ==================================================
                // ANIMASI CART
                // ==================================================

                if (cartButton) {

                    cartButton.classList.remove(
                        "cart-bump"
                    );

                    void cartButton.offsetWidth;

                    cartButton.classList.add(
                        "cart-bump"
                    );

                }


                // ==================================================
                // BUKA CART
                // ==================================================

                setTimeout(() => {

                    openCart();

                    highlightCartItem(id);

                }, 250);

            }
        );

    });


    // ======================================================
    // 12. UPDATE CART
    // ======================================================

    function updateCart() {

        updateCartCount();

        renderCart();

        updateCartTotal();

    }


    // ======================================================
    // 13. UPDATE JUMLAH CART
    // ======================================================

    function updateCartCount() {

        const totalItems =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        if (cartButton) {

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
    // 14. RENDER CART
    // ======================================================

    function renderCart() {

        if (!cartItems) {
            return;
        }

        cartItems.innerHTML = "";


        // ==========================
        // CART KOSONG
        // ==========================

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


        // ==========================
        // CART ADA ISI
        // ==========================

        if (cartEmpty) {
            cartEmpty.style.display = "none";
        }

        cartItems.style.display = "block";


        if (whatsappButton) {
            whatsappButton.disabled = false;
        }


        // ==========================
        // RENDER SETIAP PRODUK
        // ==========================

        cart.forEach(item => {

            const subtotal =
                item.price * item.quantity;


            const itemElement =
                document.createElement("div");

            itemElement.className =
                "cart-item";

            itemElement.dataset.id =
                item.id;


            itemElement.innerHTML = `

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
                        aria-label="Hapus ${escapeHTML(item.name)}"
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


            cartItems.appendChild(
                itemElement
            );

        });

    }


    // ======================================================
    // 15. TOTAL HARGA
    // ======================================================

    function updateCartTotal() {

        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    ),
                0
            );


        if (cartTotalPrice) {

            cartTotalPrice.textContent =
                formatRupiah(total);

        }

    }


    // ======================================================
    // 16. PLUS / MINUS / HAPUS
    // ======================================================

    if (cartItems) {

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


                // ==========================
                // PLUS
                // ==========================

                if (
                    button.classList.contains(
                        "quantity-plus"
                    )
                ) {

                    product.quantity += 1;

                    updateCart();

                    highlightCartItem(id);

                    return;

                }


                // ==========================
                // MINUS
                // ==========================

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

                    if (
                        product.quantity > 0
                    ) {

                        highlightCartItem(id);

                    }

                    return;

                }


                // ==========================
                // HAPUS
                // ==========================

                if (
                    button.classList.contains(
                        "cart-remove"
                    )
                ) {

                    const itemElement =
                        button.closest(
                            ".cart-item"
                        );


                    if (itemElement) {

                        itemElement.classList.add(
                            "removing"
                        );

                    }


                    setTimeout(() => {

                        cart =
                            cart.filter(
                                item =>
                                    item.id !== id
                            );

                        updateCart();

                    }, 280);

                }

            }
        );

    }


    // ======================================================
    // 17. HIGHLIGHT PRODUK
    // ======================================================

    function highlightCartItem(id) {

        setTimeout(() => {

            const item =
                document.querySelector(
                    `.cart-item[data-id="${CSS.escape(id)}"]`
                );


            if (!item) {
                return;
            }


            item.classList.remove(
                "highlight"
            );


            void item.offsetWidth;


            item.classList.add(
                "highlight"
            );


            item.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });


            setTimeout(() => {

                item.classList.remove(
                    "highlight"
                );

            }, 1200);

        }, 80);

    }


    // ======================================================
    // 18. WHATSAPP
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


                // nmr wa jahisss bree

                const whatsappNumber =
                    "6280000000000";


                const message =
                    encodeURIComponent(
                        lines.join("\n")
                    );


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${message}`;


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    // ======================================================
    // 19. INISIALISASI
    // ======================================================

    updateCart();

});