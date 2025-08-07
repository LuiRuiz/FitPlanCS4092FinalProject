import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function FitNavbar() {
  console.log("nav, Loading")
  return (
    <Navbar className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="/">FitPlan</Navbar.Brand>
      </Container>
    </Navbar>
  )
};
export default FitNavbar;