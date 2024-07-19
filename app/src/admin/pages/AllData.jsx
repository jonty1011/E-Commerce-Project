import { Container, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import BarChart from "../../components/BarChart";
import { useState, useEffect } from "react";

const AllData = ({ products }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p>No products available.</p>
      </Container>
    );
  }

  const title = products.map((product) => product.title);
  const sold = products.map((product) => product.sold);

  return (
    <Container>
      <h3>Products Sold</h3>
      <BarChart sold={sold} title={title} />
    </Container>
  );
};

AllData.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      sold: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AllData;
