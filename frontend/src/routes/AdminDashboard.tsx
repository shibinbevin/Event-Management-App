import Sidebar from '~/components/Sidebar';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Header from '~/components/Header';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';


const AdminDashboard: React.FC = () => {
    const [sidebarActive, setSidebarActive] = useState(false);

    const {token} = useAppSelector(selectUser);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    }

    return (
        <div className={`App ${sidebarActive ? 'shifted' : ''}`}>
            <Header token={token} toggleSidebar={toggleSidebar} />
            <Sidebar active={sidebarActive} />
            <main className={`main-content ${sidebarActive ? 'shifted' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminDashboard;