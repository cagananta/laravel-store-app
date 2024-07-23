import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { useEffect, useState } from "react";

function Product({ auth, products }) {
    const { post } = useForm();
    const [processing, setProcessing] = useState(false);

    const deleteProduct = (product_id) => {
        setProcessing(true);
        post(route("products.destroy", product_id));
        setProcessing(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-4 flex flex-row justify-between items-center">
                            <h2 className="text-black font-bold">Products</h2>
                            <h2 className="text-black font-bold">
                                Total: {products.total}
                            </h2>
                            <Link href="/products/create">
                                <button
                                    className={`inline-flex items-center py-2 px-4 border border-transparent bg-blue-600 text-white text-xs uppercase tracking-widest
                                font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                    processing &&
                                    "opacity-25 cursor-not-allowed"
                                }`}
                                    disabled={processing}
                                >
                                    Create
                                </button>
                            </Link>
                        </div>
                        <div className="p-4">
                            <table className="table-fixed w-full text-sm border border-slate-400 text-left font-light">
                                <thead className="border-b border-slate-400 font-medium">
                                    <tr>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Product Name
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Qty Per Box
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Product Price (Per Box)
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.map(
                                        ({
                                            product_id,
                                            product_name,
                                            qty_per_box,
                                            product_price,
                                        }) => (
                                            <tr
                                                key={product_id}
                                                className="border-b border-slate-400"
                                            >
                                                <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                    {product_name}
                                                </td>
                                                <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                    {qty_per_box}
                                                </td>
                                                <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                    {product_price}
                                                </td>
                                                <td className="border-e border-slate-400 px-2 md:px-4 py-2 font-medium">
                                                    <div className="flex flex-col gap-2 lg:flex-row">
                                                        <Link
                                                            href={route(
                                                                "products.edit"
                                                            )}
                                                            data={{
                                                                id: product_id,
                                                            }}
                                                        >
                                                            <button
                                                                className={`items-center sm:px-2 py-2 md:px-4 border border-transparent bg-yellow-500 text-white text-xs text-center uppercase sm:tracking-widest
                                font-bold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                    processing &&
                                    "opacity-25 cursor-not-allowed"
                                }`}
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Update
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                confirm(
                                                                    "Are you sure?"
                                                                ) &&
                                                                deleteProduct(
                                                                    product_id
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className={`items-center sm:px-2 py-2 md:px-4 border border-transparent bg-red-600 text-white text-xs uppercase sm:tracking-widest
                                font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                    processing &&
                                    "opacity-25 cursor-not-allowed"
                                }`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={products.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Product;
