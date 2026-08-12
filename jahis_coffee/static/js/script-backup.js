// ==========================================================
// JAHIS COFFEE
// FILTER MENU + MODERN SHOPPING CART
// ==========================================================


// ==========================================================
// 1. FILTER KATEGORI
// ==========================================================

const categoryButtons = document.querySelectorAll(".category-button");
const productCards = document.querySelectorAll(".product-card");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        productCards.forEach(card => {

            const productCategory = card.dataset.category;

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


// ==========================================================
// 2. DATA KERANJANG
// ==========================================================

let cart = [];

const addButtons = document.querySelectorAll(".add-button");
const cartButton = document.querySelector(".cart-button");


// ==========================================================
// 3. MEMBUAT CART DRAWER OTOMATIS
// ==========================================================

const cartOverlay = document.createElement("div");
cartOverlay.className = "cart-overlay";

cartOverlay.innerHTML = `
    <aside class="cart-drawer">

        <div class="cart-header">
            <div>
                <span class="cart-eyebrow">JAHIS COFFEE</span>
                <h2>Pesanan Anda</h2>
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
                <div class="empty-icon">J</div>

                <h3>Keranjang masih kosong</h3>

                <p>
                    Pilih kopi favorit Anda dari menu Jahis Coffee.
                </p>
            </div>

            <div class="cart-items"></div>

        </div>


        <div class="cart-footer">

            <div class="cart-total">
                <div>
                    <span>Total Pesanan</span>
                    <small>Belum termasuk biaya lainnya</small>
                </div>

                <strong class="cart-total-price">
                    Rp0
                </strong>
            </div>

            <button
                type="button"
                class="whatsapp-order-button"
            >
                <span>Pesan via WhatsApp</span>
                <span class="order-arrow">→</span>
            </button>

            <p class="cart-footer-note">
                Pesanan akan diteruskan ke WhatsApp Jahis Coffee.
            </p>

        </div>

    </aside>
`;

document.body.appendChild(cartOverlay);


const cartDrawer = document.querySelector(".cart-drawer");
const cartClose = document.querySelector(".cart-close");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartTotalPrice = document.querySelector(".cart-total-price");
const whatsappButton = document.querySelector(".whatsapp-order-button");


// ==========================================================
// 4. FORMAT RUPIAH
// ==========================================================

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);

}


// ==========================================================
// 5. BUKA KERANJANG
// ==========================================================

function openCart() {

    cartOverlay.classList.add("active");

    document.body.classList.add("cart-open");

}


// ==========================================================
// 6. TUTUP KERANJANG
// ==========================================================

function closeCart() {

    cartOverlay.classList.remove("active");

    document.body.classList.remove("cart-open");

}


if (cartButton) {

    cartButton.addEventListener("click", openCart);

}


cartClose.addEventListener("click", closeCart);


// Klik area gelap untuk menutup
cartOverlay.addEventListener("click", event => {

    if (event.target === cartOverlay) {
        closeCart();
    }

});


// ESC untuk menutup
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeCart();
    }

});


// ==========================================================
// 7. TOMBOL + PESAN
// ==========================================================

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);


        if (!id || !name || Number.isNaN(price)) {

            console.error(
                "Data produk tidak lengkap:",
                button.dataset
            );

            return;
        }


        const existingProduct = cart.find(item => {
            return item.id === id;
        });


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                id,
                name,
                price,
                quantity: 1
            });

        }


        updateCart();


        // ==============================================
        // ANIMASI TOMBOL BERHASIL
        // ==============================================

        const originalHTML = button.innerHTML;

        button.classList.add("added");

        button.innerHTML = `
            <span>✓</span>
            Ditambahkan
        `;


        setTimeout(() => {

            button.classList.remove("added");

            button.innerHTML = originalHTML;

        }, 900);


        // ==============================================
        // ANIMASI BADGE KERANJANG
        // ==============================================

        if (cartButton) {

            cartButton.classList.remove("cart-bump");

            void cartButton.offsetWidth;

            cartButton.classList.add("cart-bump");

        }


        // ==============================================
        // BUKA DRAWER OTOMATIS
        // ==============================================

        setTimeout(() => {

            openCart();

            highlightCartItem(id);

        }, 250);

    });

});


// ==========================================================
// 8. UPDATE SELURUH KERANJANG
// ==========================================================

function updateCart() {

    updateCartCount();

    renderCart();

    updateCartTotal();

}


// ==========================================================
// 9. UPDATE JUMLAH ITEM
// ==========================================================

function updateCartCount() {

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);


    if (cartButton) {

        cartButton.innerHTML = `
            <span class="cart-button-label">Pesanan</span>
            <span class="cart-count">${totalItems}</span>
        `;

    }

}


// ==========================================================
// 10. TAMPILKAN ISI KERANJANG
// ==========================================================

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartEmpty.style.display = "flex";

        cartItems.style.display = "none";

        whatsappButton.disabled = true;

        return;

    }


    cartEmpty.style.display = "none";

    cartItems.style.display = "block";

    whatsappButton.disabled = false;


    cart.forEach(item => {

        const subtotal = item.price * item.quantity;


        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.dataset.id = item.id;


        itemElement.innerHTML = `

            <div class="cart-item-top">

                <div class="cart-item-info">

                    <span class="cart-item-label">
                        JAHIS COFFEE
                    </span>

                    <h3>${escapeHTML(item.name)}</h3>

                    <p>${formatRupiah(item.price)} / item</p>

                </div>


                <button
                    type="button"
                    class="cart-remove"
                    data-id="${item.id}"
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
                        data-id="${item.id}"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-plus"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>


                <strong>
                    ${formatRupiah(subtotal)}
                </strong>

            </div>

        `;


        cartItems.appendChild(itemElement);

    });

}


// ==========================================================
// 11. TOTAL HARGA
// ==========================================================

function updateCartTotal() {

    const total = cart.reduce((sum, item) => {

        return sum + (item.price * item.quantity);

    }, 0);


    cartTotalPrice.textContent = formatRupiah(total);

}


// ==========================================================
// 12. PLUS / MINUS / HAPUS
// ==========================================================

cartItems.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }


    const id = button.dataset.id;

    const product = cart.find(item => item.id === id);


    if (
        button.classList.contains("quantity-plus") &&
        product
    ) {

        product.quantity += 1;

        updateCart();

        highlightCartItem(id);

    }


    if (
        button.classList.contains("quantity-minus") &&
        product
    ) {

        product.quantity -= 1;


        if (product.quantity <= 0) {

            cart = cart.filter(item => item.id !== id);

        }


        updateCart();

        if (product.quantity > 0) {
            highlightCartItem(id);
        }

    }


    if (button.classList.contains("cart-remove")) {

        const itemElement = button.closest(".cart-item");


        if (itemElement) {

            itemElement.classList.add("removing");


            setTimeout(() => {

                cart = cart.filter(item => item.id !== id);

                updateCart();

            }, 280);

        }

    }

});


// ==========================================================
// 13. HIGHLIGHT PRODUK YANG BARU DITAMBAHKAN
// ==========================================================

function highlightCartItem(id) {

    setTimeout(() => {

        const item = document.querySelector(
            `.cart-item[data-id="${CSS.escape(id)}"]`
        );


        if (!item) {
            return;
        }


        item.classList.remove("highlight");

        void item.offsetWidth;

        item.classList.add("highlight");


        item.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


        setTimeout(() => {

            item.classList.remove("highlight");

        }, 1200);

    }, 80);

}


// ==========================================================
// 14. ESCAPE HTML
// ==========================================================

function escapeHTML(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;

}


// ==========================================================
// 15. WHATSAPP ORDER
// ==========================================================

whatsappButton.addEventListener("click", () => {

    if (cart.length === 0) {
        return;
    }


    let message = "Halo Jahis Coffee, saya ingin memesan:%0A%0A";


    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        message += `${index + 1}. ${encodeURIComponent(item.name)}%0A`;
        message += `   ${item.quantity} x ${formatRupiah(item.price)}%0A`;
        message += `   Subtotal: ${formatRupiah(subtotal)}%0A%0A`;

    });


    const total = cart.reduce((sum, item) => {

        return sum + (item.price * item.quantity);

    }, 0);


    message += `TOTAL: ${formatRupiah(total)}%0A%0A`;
    message += "Terima kasih.";


    /*
       NOMOR WHATSAPP

       Nanti ganti angka di bawah dengan nomor resmi Jahis Coffee.

       Format:
       628xxxxxxxxxx

       Jangan menggunakan:
       +62
       spasi
       tanda -
    */

    const whatsappNumber = "6280000000000";


    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

});


// ==========================================================
// 16. INISIALISASI
// ==========================================================

updateCart();
