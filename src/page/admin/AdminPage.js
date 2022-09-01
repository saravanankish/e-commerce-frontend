import AdminNavbar from "../../component/AdminNavbar";
import { Outlet } from 'react-router-dom';
import Footer from '../../component/Footer';
import AddBrandDialog from "../../component/AddBrandDialog";
import { useState } from "react";

const AdminPage = () => {

    const [openAddBrand, setOpenAddBrand] = useState(false);

    return (
        <>
            <AddBrandDialog open={openAddBrand} setOpen={setOpenAddBrand} />
            <AdminNavbar setOpenAddBrand={setOpenAddBrand} />
            <div style={{ marginTop: '45px' }}>
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default AdminPage;