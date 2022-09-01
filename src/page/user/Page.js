import Navbar from "../../component/Navbar";
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../../component/Footer';

const Page = () => {

    const loggedIn = useSelector(state => state.login.loggedIn)

    return (
        <>
            <Navbar showAuth={!loggedIn} />
            <div style={{ marginTop: '45px' }}>
                <Outlet />
            </div>
            <Footer />
        </>
    )

}

export default Page;