// Supabase Initialization
const SUPABASE_URL = "https://hitvxuwbqhlrpqekubva.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdHZ4dXdicWhscnBxZWt1YnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNDU1MzIsImV4cCI6MjA2MTgyMTUzMn0.tcUQhLDO8wM3qZd21QYDd_6F1-HTPOyQmVdcdYZX0Iw";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const user = localStorage.getItem("user");

    // Redirect to login if no user info
    if (!!user) {
        window.location.href = "login.html";
        return;
    }

    // Load products from Supabase and render them
    async function loadProducts() {
        const { data: products, error } = await supabase
            .from("products")
            .select("*");

        const grid = document.getElementById("product-grid");
        if (!grid) return;

        if (error) {
            console.error("Error fetching products:", error.message);
            grid.innerHTML = "<p>Failed to load products.</p>";
            return;
        }

        grid.innerHTML = "";

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.dataset.id = product.product_id;
            productDiv.dataset.name = product.name;
            productDiv.dataset.price = product.price;

            productDiv.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" style="width:150px; height:auto;">
                <h3>${product.name}</h3>
                <p class="price">₱${product.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;

            grid.appendChild(productDiv);
        });
    }

    await loadProducts();
});
