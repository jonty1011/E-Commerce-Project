import PropTypes from 'prop-types';
import { Container, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ProductData } from "../../context/ProductContext";
import Home from "../../pages/Home";
import AdminOrders from "./AdminOrder";
import AllData from "./AllData";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  if (user?.role !== "admin") {
    navigate("/");
    return null; // Make sure to return null after navigating to avoid rendering the rest of the component
  }

  const { adminProducts } = ProductData();
  return (
    <Container>
      <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey={"home"} title={"Dashboard"}>
          <Home products={adminProducts} />
        </Tab>
        <Tab eventKey={"data"} title={"All Data"}>
          <AllData products={adminProducts} />
        </Tab>
        <Tab eventKey={"orders"} title={"Orders"}>
          <AdminOrders />
        </Tab>
      </Tabs>
    </Container>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default Dashboard;
