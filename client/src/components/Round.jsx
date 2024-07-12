import React, { useEffect, useState } from "react";
import "./index.css";

function ProductValidation() {
  const [disabled, setDisabled] = useState(true);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productError, setProductError] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "product") {
      setProduct(value);
      if (value === "") {
        setProductError("Product name is required");
      } else {
        setProductError("");
      }
    } else if (name === "quantity") {
      setQuantity(value);
      if (value === "") {
        setQuantityError("Quantity is required");
      } else {
        setQuantityError("");
      }
    }
  };
  useEffect(()=>
  {
    if(product != "" && quantity!="")
    {
      setDisabled(false);
    }
    else setDisabled(true)
  },[quantity,product])

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "product" && value === "") {
      setProductError("Product name is required");
    }

    if (name === "quantity" && value === "") {
      setQuantityError("Quantity is required");
    }
  };

  return (
    <div className="layout-column justify-contents-center align-items-center">
      <section className="card pa-50">
        <form className="layout-column" noValidate>
          <label>
            <input
              type="text"
              name="product"
              value={product}
              onInput={handleInput}
              onBlur={handleBlur}
              data-testid="name-input"
              className={`white large outlined`}
              placeholder="Product name"
            />
            <p className="error-text form-hint" data-testid="name-input-error">
              {productError}
            </p>
          </label>
          <label>
            <input
              type="number"
              name="quantity"
              value={quantity}
              onInput={handleInput}
              onBlur={handleBlur}
              className={`white large outlined`}
              placeholder="Quantity"
              data-testid="quantity-input"
            />
            <p className="error-text form-hint" data-testid="quantity-input-error">
              {quantityError}
            </p>
          </label>
          <button className="mt-50" type="submit" data-testid="submit-button" disabled={disabled}>
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProductValidation;
