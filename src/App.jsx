import { useEffect, useState  } from "react";
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Products from './Components/Products';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Basket from "./Components/Basket";
import Checkout from "./Components/Checkout";

const App = () => {
  const [products, setProducts] = useState([]);
  const [basketData, setBasketData] = useState([]);

  const fetchProducts = async () => {
    const response = await commerce.products.list();
    setProducts((response && response.data) || []);
  };

  const fetchBasketData = async () => {
    const response = await commerce.cart.retrieve();
    setBasketData(response);
  };

  useEffect(() => {
    fetchProducts();
    fetchBasketData();
  }, []);

  const addProduct = async (productId, quantity) => {
    const response = await commerce.cart.add(productId, quantity);
    setBasketData(response.cart);
  };

  const RemoveItemFromBasket = async (itemId) => {
    const response = await commerce.cart.remove(itemId);
    setBasketData(response.cart);
  };

  const handleEmptyBasket = async () => {
    const response = await commerce.cart.empty();
    setBasketData(response.cart);
  };

  const updateProduct = async (productId, quantity) => {
    const response = await commerce.cart.update(productId, { quantity });
    setBasketData(response.cart);
  };

  console.log("basketData ===>>>>>", basketData);

  return (
    <Router>
      <div>
        <NavBar basketItems={basketData.total_items} totalCost={
            (basketData.subtotal &&
              basketData.subtotal.formatted_with_symbol) ||
            "00.00"
          } />
        <Switch>
          <Route exact path="/">
            <Products products={products} addProduct={addProduct}/>
          </Route>
          <Route exact path="/basket">
            <Basket
              basketData={basketData}
              updateProduct={updateProduct}
              handleEmptyBasket={handleEmptyBasket}
              RemoveItemFromBasket={RemoveItemFromBasket}
            />  
          </Route>
          <Route exact path="/checkout">
            <Checkout basketData={basketData} />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
