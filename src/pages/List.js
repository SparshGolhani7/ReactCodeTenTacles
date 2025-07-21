import React, { useEffect, useState } from "react";
import Table from "../component/VTable";
import Layout from "../component/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from 'lucide-react';
import { fetchUserList, deleteUser } from "../api";

export default function List() {
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const [token] = useState(localStorage.getItem("token"));
    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [navigate, token]);

    const loadUsers = async () => {
        setLoading(true);
        setError("");
        try {
            console.log("Fetching users...");
            const data = await fetchUserList();
            console.log("API response:", data);
            if (data && data.data) {
                setUsers(data.data);
                localStorage.setItem("users_fallback", JSON.stringify(data.data));
            } else {
                setError("Failed to load users");
            }
        } catch (e) {
            console.error("API fetch error:", e);
            const fallback = localStorage.getItem("users_fallback");
            if (fallback) {
                setUsers(JSON.parse(fallback));
                setError("(Offline) Showing cached users");
            } else {
                setError("Network error");
            }
        }
        setLoading(false);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const handlePageChange = (page) => setCurrentPage(page);
    const handlePerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    // After add/delete, reload users
    const handleUserAddedOrDeleted = () => {
        loadUsers();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token && !role) {
            console.log("No token found, redirecting to login");
            navigate("/");
            return;
        }
        console.log("Fetching users...");
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        setError("");
        try {
            const res = await deleteUser(id);
            if (res.success) {
                loadUsers();
            } else {
                setError(res.message || "Delete failed");
            }
        } catch (e) {
            setError("Network error");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: " Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone No",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Action",
            render: (item) => (
                <>
                    <div className="flex gap-1 text-center justify-center">
                        <button onClick={() => handleDelete(item.id)}>
                            <Trash2 color="#ff0000" size={16} />
                        </button>
                    </div>
                </>
            ),
            key: "action",
            width: 90,
        },
    ];

    return (
        <Layout>
            <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">List</h3>
                    <div className="text-sm text-blue-700 font-bold">Welcome, Admin</div>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700 ">
                    <div className="flex justify-end mb-3 p-2">
                        <Link to="/Stepperform" className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300">Add</Link>
                    </div>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : currentUsers.length === 0 ? (
                        <div className="text-center text-gray-500">No users found</div>
                    ) : (
                        <>
                            <Table cols={columns} data={currentUsers} onDelete={handleUserAddedOrDeleted} onAdd={handleUserAddedOrDeleted} />
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
                                        <button key={i+1} className={`px-3 py-1 rounded ${currentPage === i+1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handlePageChange(i+1)}>{i+1}</button>
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