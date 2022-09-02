import AdminNavbar from "../../component/AdminNavbar";
import { Outlet } from 'react-router-dom';
import Footer from '../../component/Footer';
import AddBrandDialog from "../../component/AddBrandDialog";
import AddCategoryDialog from "../../component/AddCategoryDialog";
import { useState } from "react";

const AdminPage = () => {

    const [openAddBrand, setOpenAddBrand] = useState(false);
    const [openAddCategory, setOpenAddCategory] = useState(false);

    return (
        <>
            <AddBrandDialog open={openAddBrand} setOpen={setOpenAddBrand} />
            <AddCategoryDialog open={openAddCategory} setOpen={setOpenAddCategory} />
            <AdminNavbar
                setOpenAddBrand={setOpenAddBrand}
                setOpenAddCategory={setOpenAddCategory}
            />
            <div style={{ marginTop: '45px', minHeight: "76vh" }}>
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default AdminPage;