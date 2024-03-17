import NavBar from "../features/navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";

function UserOrdersPage(){
    return (
        <NavBar>
             <UserOrders></UserOrders>
        </NavBar>
    )
}
export default UserOrdersPage;