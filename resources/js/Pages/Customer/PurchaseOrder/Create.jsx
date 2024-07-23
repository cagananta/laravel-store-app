import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import { useState } from "react";

function CreatePurchaseOrder({ auth, products }) {
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [processing, setProcessing] = useState(false);

    const addToCart = (product) => {
        if (!cart.find((p) => p.product_name === product.product_name)) {
            setCart((c) => [...c, product]);
            setTotal(total + product.total_price);
        }
    };

    const updateQuantity = (product_id, newQuantity) => {
        setCart((c) => {
            const updatedCart = c.map((item) => {
                if (item.product_id === product_id) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        total_price: newQuantity * item.product_price,
                    };
                }
                return item;
            });

            const newTotal = updatedCart.reduce(
                (acc, item) => acc + item.total_price,
                0
            );
            setTotal(newTotal);
            return updatedCart;
        });
    };

    const removeFromCart = (product_id) => {
        setCart((c) => {
            const updatedCart = c.filter(
                (item) => item.product_id !== product_id
            );
            const newTotal = updatedCart.reduce(
                (acc, item) => acc + item.total_price,
                0
            );
            setTotal(newTotal);
            return updatedCart;
        });
    };

    const handleSubmit = () => {
        router.post(route("purchase-order.store"), cart, {
            onBefore: () => {
                setProcessing(true);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Purchase Order
                </h2>
            }
        >
            <Head title="Create Purchase Order" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex flex-col sm:flex-row justify-between gap-2">
                            <h2 className="text-black font-bold">
                                Create Purchase Order
                            </h2>
                            <PrimaryButton onClick={() => setShowModal(true)}>
                                Add Item
                            </PrimaryButton>
                            <Link href={route("purchase-order")}>
                                <PrimaryButton className="w-full sm:w-auto">
                                    Back
                                </PrimaryButton>
                            </Link>
                        </div>
                        <div className="p-6">
                            <div className="text-right font-bold text-2xl mb-2">
                                <h5>
                                    Total Amount :
                                    {" " +
                                        "Rp. " +
                                        total.toLocaleString("id-ID", {
                                            minimumFractionDigits: 0,
                                        })}
                                </h5>
                            </div>
                            <table className="table-fixed w-full text-sm border border-slate-400 text-left font-light">
                                <thead className="border-b border-slate-400 font-medium">
                                    <tr>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Product Name
                                        </th>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Qty Per Box
                                        </th>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Product Price (Per Box)
                                        </th>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Quantity (Box)
                                        </th>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Total
                                        </th>
                                        <th className="border-e border-slate-400 px-2 py-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length > 0 &&
                                        cart.map(
                                            ({
                                                product_id,
                                                product_name,
                                                qty_per_box,
                                                product_price,
                                                quantity,
                                                total_price,
                                            }) => (
                                                <tr
                                                    key={product_id}
                                                    className="border-b border-slate-400"
                                                >
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        {product_name}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        {qty_per_box}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        <div className="flex flex-row justify-between">
                                                            <span>Rp. </span>
                                                            <span>
                                                                {product_price}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        <input
                                                            type="number"
                                                            id={`productQuantity_${product_id}`}
                                                            name={`product_quantity_${product_id}`}
                                                            value={quantity}
                                                            min={0}
                                                            onChange={(e) => {
                                                                const newQuantity =
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    );
                                                                updateQuantity(
                                                                    product_id,
                                                                    newQuantity
                                                                );
                                                            }}
                                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        <div className="flex flex-row justify-between">
                                                            <span>Rp. </span>
                                                            <span>
                                                                {total_price.toLocaleString(
                                                                    "id-ID",
                                                                    {
                                                                        minimumFractionDigits: 0,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="border-e border-slate-400 px-2 py-2 font-medium">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                confirm(
                                                                    "Are you sure?"
                                                                ) &&
                                                                removeFromCart(
                                                                    product_id
                                                                )
                                                            }
                                                            className={`inline-flex items-center py-2 px-4 border border-transparent bg-red-600 text-white text-xs uppercase tracking-widest
                                font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition ease-in-out duration-150 `}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 pb-6 flex flex-row justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    confirm("Are you sure ?") && handleSubmit();
                                }}
                                className={`inline-flex items-center py-2 px-4 border border-transparent bg-blue-600 text-white text-xs uppercase tracking-widest
                                font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                    cart.length == 0 &&
                                    "opacity-25 cursor-not-allowed"
                                } ${
                                    processing &&
                                    "opacity-25 cursor-not-allowed"
                                }`}
                                disabled={cart.length == 0 || processing}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} maxWidth="5xl">
                <form className="p-6">
                    <div className="flex flex-row justify-between items-center pb-3 border-b-2 border-black">
                        <h1 className="font-bold text-xl">List Products</h1>
                        <SecondaryButton onClick={() => setShowModal(false)}>
                            Close
                        </SecondaryButton>
                    </div>
                    <div className="mt-4">
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
                                {products.map(
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
                                                <div className="flex flex-row justify-between">
                                                    <span>Rp. </span>
                                                    <span>{product_price}</span>
                                                </div>
                                            </td>
                                            <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart({
                                                            product_id,
                                                            product_name,
                                                            qty_per_box,
                                                            product_price,
                                                            quantity: 1,
                                                            total_price:
                                                                product_price,
                                                        })
                                                    }
                                                    className={`inline-flex items-center py-1 px-3 bg-blue-600 text-white border border-transparent rounded-md text-sm tracking-wide font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition ease-in-out duration-150`}
                                                >
                                                    Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

export default CreatePurchaseOrder;
