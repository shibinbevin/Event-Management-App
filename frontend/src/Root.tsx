import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import useTreeChanges from 'tree-changes-hook';

import { name } from '~/config';

import { useAppSelector } from '~/modules/hooks';
import theme from '~/modules/theme';

// import Footer from '~/components/Footer';
import Header from '~/components/Header';
import AdminRoute from '~/components/AdminRoute'
import PrivateRoute from '~/components/PrivateRoute';
import PublicRoute from '~/components/PublicRoute';
import SystemAlerts from '~/containers/SystemAlerts';
import Event from './components/Event';
import Venue from './components/Venue';
import User from './components/User';
import Home from '~/routes/Home';
import UserBookings from '~/routes/UserBookings';
import NotFound from '~/routes/NotFound';
import Register from '~/routes/Register';
import Login from '~/routes/Login';
import AdminDashboard from '~/routes/AdminDashboard'
import { selectUser } from '~/selectors';
import Dashboard from './components/Dashboard';
import EventDetail from '~/routes/EventDetail';
import EventBookings from '~/components/EventBookings';
import Category from '~/components/Category';
import ForgotPassword from '~/components/ForgotPassword';
import ResetPassword from '~/components/ResetPassword';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  opacity: 1 !important;
  position: relative;
  transition: opacity 0.5s;
`;

const Main = styled.main`
  min-height: 100vh;
  padding: 0;
`;

function Root() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { changed } = useTreeChanges(user);

  const { isAuthenticated, token, role } = user;

  useEffect(() => {
    // if (changed('isAuthenticated', true)) {
    //   dispatch(alertShow('Hello! And welcome!', { type: 'success', icon: 'bell', timeout: 10 }));
    // }
  }, [dispatch, changed]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppWrapper data-component-name="app">
          <Helmet
            defaultTitle={name}
            defer={false}
            encodeSpecialCharacters
            htmlAttributes={{ lang: 'pt-br' }}
            titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            titleTemplate={`%s | ${name}`}
          >
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          {role != "admin" && <Header token={token}></Header>}
          <Main>
            <Routes>
              <Route
                element={
                  <Home />
                }
                path="/"
              />
              <Route
                element={
                  <EventDetail/>
                }
                path="/event/:event_id"
              />
              <Route
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} role={role}>
                    <UserBookings />
                  </PrivateRoute>
                }
                path="/mybookings"
              />
              <Route
                element={
                  <PublicRoute isAuthenticated={isAuthenticated} role={role}>
                    <Register />
                  </PublicRoute>
                }
                path="/register"
              />
              <Route
                element={
                  <PublicRoute isAuthenticated={isAuthenticated} role={role}>
                    <Login />
                  </PublicRoute>
                }
                path="/login"
              />
              <Route
                element={
                  <PublicRoute isAuthenticated={isAuthenticated} role={role}>
                    <ForgotPassword />
                  </PublicRoute>
                }
                path="/forgot-password"
              />
              <Route
                element={
                  <PublicRoute isAuthenticated={isAuthenticated} role={role}>
                    <ResetPassword />
                  </PublicRoute>
                }
                path="/reset-password"
              />
              <Route
                path="/dashboard/*"
                element={
                  <AdminRoute isAuthenticated={isAuthenticated} role={role}>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route path='' element={<Dashboard />} />
                <Route path="events" element={<Event />} />
                <Route path="venue" element={<Venue />} />
                <Route path="user" element={<User />} />
                <Route path="category" element={<Category />} />
                <Route path="events/:event_id" element={<EventBookings />} />
              </Route>
              <Route element={<NotFound />} path="*" />
            </Routes>
          </Main>
          <SystemAlerts />
        </AppWrapper>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default Root;
