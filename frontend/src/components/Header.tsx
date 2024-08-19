import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { Icon, responsive, Text } from '@gilbarbara/components';
import { Nav, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';

import { logOut } from '~/actions';

const HeaderWrapper = styled.header`
  z-index: 200;

  &:before {
    bottom: 0;
    content: '';
    height: 2px;
    left: 0;
    position: absolute;
    right: 0;
  }
`;

const Logout = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  padding: 0;

  ${responsive({ lg: { fontSize: '16px' } })};

  span {
    display: inline-block;
    text-transform: uppercase;
  }

  &:hover {
    color: #888;
  }

  &:focus {
    outline: none;
  }
`;

const NavLink = styled(Nav.Link)`
  font-size: 14px;
  ${responsive({ lg: { fontSize: '16px' } })};
`;

const NavbarWrapper = styled(Navbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Brand = styled(Navbar.Brand)`
  font-size: 20px;
  ${responsive({ lg: { fontSize: '20px' } })};
`;

interface Props {
  token: string;
  toggleSidebar?: () => void;
}

export default function Header(props: Props) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);

  const { isAuthenticated, role } = user;

  const handleClickLogout = async () => {
    const response = await axios.post('http://localhost:5000/api/users/logout', {
      token: props.token
    });
    if (response.data.success) {
      dispatch(logOut());
    }
    else {
      console.log(response.data)
    }
  };

  return (
    <HeaderWrapper data-component-name="Header">
      <NavbarWrapper variant="dark" expand="lg">
        {role === "admin" &&
          <Button variant="outline-light" className="d-lg-none toggle-button" onClick={props.toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </Button>
        }
        <Brand href="/">
          Eventide
        </Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <NavContainer>
            {isAuthenticated ?
              <>{
                role === "user" ?
                <Nav className="m-auto" id="list">
                  <NavLink href="/" className="text-white active">
                    Events
                  </NavLink>
                  <NavLink href="/mybookings" className="text-white">
                    My Bookings
                  </NavLink>
                </Nav>
                :
                <Nav className="m-auto" id="list">
                </Nav>
              }
                <Logout data-component-name="Logout" onClick={handleClickLogout}>
                  <Text>Logout</Text>
                  <Icon ml="xs" name="sign-out" />
                </Logout>
              </>
              :
              <Nav className="m-auto" id="list">
                <NavLink href="/login" className="text-white active">
                  Login
                </NavLink>
                <NavLink href="register" className="text-white">
                  Sign Up
                </NavLink>
              </Nav>
            }
          </NavContainer>
        </Navbar.Collapse>
      </NavbarWrapper>
    </HeaderWrapper>
  );
}
