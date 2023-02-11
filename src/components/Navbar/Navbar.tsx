import { NavLink } from 'react-router-dom';
import BootstrapNavBar from 'react-bootstrap/Navbar';
import { navbarLinks } from './Navbar.constants';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../App';
import { useContext } from 'react';
import { logout } from '../../helpers/auth';

export default function Navbar() {
  const { isAuthenticated, setIsLoading } = useContext(AuthContext);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  return (
    <BootstrapNavBar bg="dark" variant="dark" expand="sm">
      <Container style={{ maxWidth: '920px' }}>
        <BootstrapNavBar.Brand key={'/'} as={NavLink} to={'/'}>
          Blog CMS
        </BootstrapNavBar.Brand>
        <BootstrapNavBar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavBar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-flex flex-fill  justify-content-center">
            {navbarLinks.map((link) => (
              <Nav.Link key={link.path} as={NavLink} to={link.path}>
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline-light"
              className="ml-2"
            >
              Logout
            </Button>
          ) : (
            <NavLink to="/login">
              <Button variant="outline-light" className="ml-2">
                Login
              </Button>
            </NavLink>
          )}
        </BootstrapNavBar.Collapse>
      </Container>
    </BootstrapNavBar>
  );
}
