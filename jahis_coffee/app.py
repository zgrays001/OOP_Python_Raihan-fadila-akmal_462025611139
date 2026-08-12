from flask import Flask, render_template
import mysql.connector


class DatabaseError(Exception):
    pass


class ProductError(Exception):
    pass


class InvalidQuantityError(Exception):
    pass


class Product:
    def __init__(self, product_id, name, price, description="", stock=0, category="Umum"):
        self.__id = product_id
        self.__name = name
        self.__price = float(price)
        self.__description = description
        self.__stock = int(stock)
        self.__category = category

    @property
    def id(self):
        return self.__id

    @property
    def name(self):
        return self.__name

    @property
    def price(self):
        return self.__price

    @property
    def description(self):
        return self.__description

    @property
    def stock(self):
        return self.__stock

    @property
    def category(self):
        return self.__category

    def tampil_info(self):
        return f"{self.__name} | Rp{self.__price:,.0f} | Stok: {self.__stock}"

    def cek_stok(self, jumlah):
        if jumlah <= 0:
            raise InvalidQuantityError("Jumlah pesanan harus lebih dari 0.")

        if jumlah > self.__stock:
            raise ProductError(
                f"Stok {self.__name} tidak mencukupi. Stok tersedia: {self.__stock}"
            )

        return True

    def hitung_subtotal(self, jumlah):
        self.cek_stok(jumlah)
        return self.__price * jumlah

    @staticmethod
    def format_rupiah(nominal):
        return f"Rp{nominal:,.0f}".replace(",", ".")

    def __str__(self):
        return f"{self.__name} - {self.format_rupiah(self.__price)}"

    def __repr__(self):
        return f"Product(id={self.__id}, name='{self.__name}', price={self.__price})"


class Coffee(Product):
    def tampil_info(self):
        return f"[COFFEE] {self.name} | {self.format_rupiah(self.price)} | Stok: {self.stock}"


class Matcha(Product):
    def tampil_info(self):
        return f"[MATCHA] {self.name} | {self.format_rupiah(self.price)} | Stok: {self.stock}"


class Database:
    def __init__(self):
        self.__host = "localhost"
        self.__user = "jahisuser"
        self.__password = "zgrayscoded"
        self.__database = "jahis_coffee"
        self.__connection = None

    def connect(self):
        try:
            self.__connection = mysql.connector.connect(
                host=self.__host,
                user=self.__user,
                password=self.__password,
                database=self.__database
            )

            if not self.__connection.is_connected():
                raise DatabaseError("Database tidak berhasil terhubung.")

            return self.__connection

        except mysql.connector.Error as error:
            raise DatabaseError(f"Gagal terhubung ke database: {error}")

    def get_products(self):
        connection = None
        cursor = None

        try:
            connection = self.connect()
            cursor = connection.cursor(dictionary=True)

            query = """
                SELECT
                    p.id_product,
                    p.product_name,
                    p.price,
                    p.description,
                    p.image,
                    p.stock,
                    c.category_name
                FROM product p
                JOIN category c
                    ON p.id_category = c.id_category
                ORDER BY p.id_category, p.id_product
            """

            cursor.execute(query)
            return cursor.fetchall()

        except mysql.connector.Error as error:
            raise DatabaseError(f"Gagal mengambil data produk: {error}")

        finally:
            if cursor is not None:
                cursor.close()

            if connection is not None and connection.is_connected():
                connection.close()

    def __str__(self):
        return f"Database: {self.__database}"


class ProductFactory:
    @staticmethod
    def create_product(data):
        category = data.get("category_name", "Umum")
        category_lower = category.lower()

        if "matcha" in category_lower:
            return Matcha(
                data["id_product"],
                data["product_name"],
                data["price"],
                data.get("description", ""),
                data.get("stock", 0),
                category
            )

        if (
            "coffee" in category_lower
            or "espresso" in category_lower
            or "manual brew" in category_lower
        ):
            return Coffee(
                data["id_product"],
                data["product_name"],
                data["price"],
                data.get("description", ""),
                data.get("stock", 0),
                category
            )

        return Product(
            data["id_product"],
            data["product_name"],
            data["price"],
            data.get("description", ""),
            data.get("stock", 0),
            category
        )


class Order:
    def __init__(self):
        self.__items = []

    def tambah_produk(self, product, quantity):
        product.cek_stok(quantity)

        self.__items.append({
            "product": product,
            "quantity": quantity
        })

    def hitung_total(self):
        total = 0

        for item in self.__items:
            total += item["product"].price * item["quantity"]

        return total

    def tampilkan_struk(self):
        print()
        print("=" * 55)
        print("                 JAHIS COFFEE")
        print("                    STRUK")
        print("=" * 55)

        if not self.__items:
            print("Belum ada pesanan.")
            return

        for item in self.__items:
            product = item["product"]
            quantity = item["quantity"]
            subtotal = product.price * quantity

            print(
                f"{product.name} x{quantity} = "
                f"{Product.format_rupiah(subtotal)}"
            )

        print("-" * 55)
        print(
            f"TOTAL : {Product.format_rupiah(self.hitung_total())}"
        )
        print("=" * 55)
        print("Terima kasih telah memesan di Jahis Coffee!")
        print("=" * 55)

    def __str__(self):
        return f"Order dengan {len(self.__items)} jenis produk"


app = Flask(__name__)
database = Database()


@app.route("/")
def home():
    try:
        raw_products = database.get_products()
        products = []

        for data in raw_products:
            product = ProductFactory.create_product(data)

            products.append({
                "id_product": product.id,
                "product_name": product.name,
                "price": product.price,
                "description": product.description,
                "image": data.get("image"),
                "stock": product.stock,
                "category_name": product.category
            })

        return render_template(
            "index.html",
            products=products
        )

    except DatabaseError as error:
        return (
            f"""
            <h1>Terjadi Kesalahan</h1>
            <p>{error}</p>
            """,
            500
        )


def jalankan_terminal():
    print()
    print("=" * 60)
    print("             JAHIS COFFEE - TERMINAL")
    print("=" * 60)

    try:
        raw_products = database.get_products()

        if not raw_products:
            print("Tidak ada produk di database.")
            return

        products = [
            ProductFactory.create_product(data)
            for data in raw_products
        ]

        print("\nDAFTAR MENU:")

        for index, product in enumerate(products, start=1):
            print(f"{index}. {product.tampil_info()}")

        pilihan = input("\nPilih nomor menu (ketik 0 untuk keluar): ")

        if pilihan == "0":
            print("Program selesai.")
            return

        try:
            pilihan = int(pilihan)
        except ValueError:
            raise ProductError("Pilihan harus berupa angka.")

        if pilihan < 1 or pilihan > len(products):
            raise ProductError("Nomor menu tidak tersedia.")

        product = products[pilihan - 1]

        print("\nProduk dipilih:")
        print(product)

        try:
            jumlah = int(input("Masukkan jumlah pesanan: "))
        except ValueError:
            raise InvalidQuantityError("Jumlah harus berupa angka.")

        product.cek_stok(jumlah)

        subtotal = product.hitung_subtotal(jumlah)

        print("\n" + "-" * 50)
        print(f"Produk   : {product.name}")
        print(f"Harga    : {Product.format_rupiah(product.price)}")
        print(f"Jumlah   : {jumlah}")
        print(f"Subtotal : {Product.format_rupiah(subtotal)}")
        print("-" * 50)

        order = Order()
        order.tambah_produk(product, jumlah)
        order.tampilkan_struk()

    except DatabaseError as error:
        print(f"\n[DATABASE ERROR] {error}")

    except InvalidQuantityError as error:
        print(f"\n[INPUT ERROR] {error}")

    except ProductError as error:
        print(f"\n[PRODUCT ERROR] {error}")

    except Exception as error:
        print(f"\n[ERROR] {error}")


if __name__ == "__main__":
    import sys

    if "--terminal" in sys.argv:
        jalankan_terminal()
    else:
        app.run(debug=True)
