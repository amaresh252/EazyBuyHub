import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";


export default function Home(){
    return(
        <NavBar>
            <ProductList></ProductList>
        </NavBar>
    )
}