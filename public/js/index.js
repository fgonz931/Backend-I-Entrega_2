const socket = io();

const formNewProduct = document.getElementById("formNewProduct");
const productList = document.getElementById("productList");

formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  socket.emit("newProduct", productData);
  formNewProduct.reset();
});

if (productList) {
  productList.addEventListener("click", (e) => {
    if (e.target.classList.contains("deleteBtn")) {
      const id = e.target.dataset.id;
      socket.emit("deleteProduct", id);
    }
  });
}

socket.on("productsUpdated", (products) => {
  renderProducts(products);
});

function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${product.title} - $${product.price}
      <button class="deleteBtn" data-id="${product.id}">
        Eliminar
      </button>
    `;

    productList.appendChild(li);
  });
}
