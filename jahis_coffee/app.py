from flask import Flask, render_template
import mysql.connector


# Class ini datra bsenya


class Database:

    def __init__(self):
        self.host = "localhost"
        self.user = "jahisuser"
        self.password = "zgrayscoded"
        self.database = "jahis_coffee"

    def connect(self):
        return mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )

    def get_products(self):
        conn = self.connect()
        cursor = conn.cursor(dictionary=True)

        try:
            cursor.execute("""
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
            """)

            return cursor.fetchall()

        finally:
            cursor.close()
            conn.close()



# bgian object


db = Database()



# Frame work menggunaklan flask


app = Flask(__name__)


# HOME


@app.route("/")
def home():
    products = db.get_products()

    return render_template(
        "index.html",
        products=products
    )



# untuk nge run apknya

if __name__ == "__main__":
    app.run(debug=True)
