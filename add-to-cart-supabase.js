// Remove duplicate declarations if this file is loaded multiple times or after other scripts.
// Only declare SUPABASE_URL, SUPABASE_ANON_KEY, and supabase if they are not already defined.

// Fix: Use let instead of var and wrap in a block to avoid global redeclaration
(() => {
    if (typeof SUPABASE_URL === "undefined") {
        window.SUPABASE_URL = "https://hitvxuwbqhlrpqekubva.supabase.co";
    }
    if (typeof SUPABASE_ANON_KEY === "undefined") {
        window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdHZ4dXdicWhscnBxZWt1YnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNDU1MzIsImV4cCI6MjA2MTgyMTUzMn0.tcUQhLDO8wM3qZd21QYDd_6F1-HTPOyQmVdcdYZX0Iw";
    }
    if (typeof supabase === "undefined") {
        window.supabase = window.supabase?.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
})();

// Call this function to add a product to cart and store in Supabase
async function addProductToCart(productId, quantity = 1) {
    if (!window.supabase || !supabase) {
        alert("Supabase client not initialized.");
        return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in.");
        return;
    }

    // Check if product_id and users_id are valid numbers
    if (isNaN(productId) || isNaN(userId)) {
        alert("Invalid productId or userId.");
        return;
    }

    // Check if product_id exists in products table before insert
    const { data: productExists, error: productError } = await supabase
        .from("products")
        .select("product_id")
        .eq("product_id", parseInt(productId))
        .maybeSingle();

    if (productError) {
        alert("Error checking product: " + productError.message);
        console.error("Product lookup error:", productError);
        return;
    }
    if (!productExists) {
        alert("Product does not exist in products table (foreign key violation).");
        return;
    }

    // Try inserting and log the full response
    const response = await supabase.from("cart_items").insert([
        {
            product_id: parseInt(productId),
            users_id: parseInt(userId),
            quantity: quantity
            // added_at will be set automatically by the database
        }
    ]);
    console.log("Supabase insert response:", response);

    if (response.error) {
        alert("Failed to add to cart: " + response.error.message);
        console.error("Supabase insert error:", response.error.message);
    } else {
        alert("Product added to cart and stored in Supabase.");
        console.log("Insert result:", response.data);
    }
}

// Example usage: addProductToCart(123, 2);
// You can call this function from your UI event (e.g., button click)
