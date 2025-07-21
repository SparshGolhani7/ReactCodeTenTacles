import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProductList } from "../../api";
import Layout from "../../component/Layout";
import Table from "../../component/VTable";

export default function Product() {
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, redirecting to login");
            navigate("/");
            return;
        }
        console.log("Fetching products...");
        const loadProducts = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchProductList();
                if (data && data.data) {
                    setProducts(data.data);
                    localStorage.setItem("products_fallback", JSON.stringify(data.data));
                } else {
                    setError("Failed to load products");
                }
            } catch (e) {
                const fallback = localStorage.getItem("products_fallback");
                if (fallback) {
                    setProducts(JSON.parse(fallback));
                    setError("(Offline) Showing cached products");
                } else {
                    setError("Network error");
                }
            }
            setLoading(false);
        };
        loadProducts();
    }, [role]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const handlePageChange = (page) => setCurrentPage(page);
    const handlePerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    // After add/delete, reload products
    const handleProductAddedOrDeleted = () => {
        const loadProducts = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchProductList();
                if (data && data.data) {
                    setProducts(data.data);
                    localStorage.setItem("products_fallback", JSON.stringify(data.data));
                } else {
                    setError("Failed to load products");
                }
            } catch (e) {
                const fallback = localStorage.getItem("products_fallback");
                if (fallback) {
                    setProducts(JSON.parse(fallback));
                    setError("(Offline) Showing cached products");
                } else {
                    setError("Network error");
                }
            }
            setLoading(false);
        };
        loadProducts();
    };

    // Table columns with correct row number and image path
    const columns = [
        {
            title: "#",
            render: (item, idx) => indexOfFirstItem + idx + 1,
            key: "rownum",
        },
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Product Image",
            dataIndex: "image",
            key: "image",
            render: (item) => (
                <>
                    <div className="m-auto flex justify-center">
                        {item.image ? (
                            <img src={item.image.startsWith('http') ? item.image : `https://reactinterviewtask.codetentaclestechnologies.in/${item.image}`} alt={item.name} width="50px" height="50px" className="rounded" />
                        ) : (
                            <span>No image</span>
                        )}
                    </div>
                </>
            )
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },
    ];


    return (
        <Layout>
            <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14 flex justify-between items-center">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">Product</h3>
                    {role === "admin" && (
                        <div className="text-sm text-blue-700 font-bold">Welcome, Admin</div>
                    )}
                    {role === "user" && (
                        <div className="text-sm text-blue-700 font-bold">Welcome, User</div>
                    )}
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700 ">
                    <div className="flex justify-end mb-3 p-2">
                        <Link to="/Add-product" className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300">Add Product</Link>
                    </div>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : currentProducts.length === 0 ? (
                        <div className="text-center text-gray-500">No products found</div>
                    ) : (
                        <>
                            <Table cols={columns} data={currentProducts} onDelete={handleProductAddedOrDeleted} />
                            <div className="flex items-center justify-between mt-4 gap-2">
                                <div>
                                    <select value={itemsPerPage} onChange={handlePerPageChange} className="border rounded px-2 py-1">
                                        <option value={5}>5 per page</option>
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button key={i + 1} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    )
}