import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, router, useForm } from "@inertiajs/react";
import DateFormatter from "@/Components/FormatDate";
import Modal from "@/Components/Modal";
import { useRef, useState } from "react";
import TextInput from "@/Components/TextInput";
import FilePreviewLink from "@/Components/FilePreviewLink";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

export default function PaymentDetails({ auth, invoice }) {
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [confirmingResetPayment, setConfirmingResetPayment] = useState(false);
    const passwordInput = useRef();

    const { data, setData, post, processing, reset, errors } = useForm({
        invoice_id: "",
        password: "",
    });

    function submit() {
        router.post(
            route("payment.confirm-payment"),
            {
                invoice_id: invoice.invoice_id,
                paid_amount: payment,
            },
            {
                onBefore: function () {
                    setLoading(true);
                },
                onFinish: function () {
                    setLoading(false);
                    setPayment("");
                },
            }
        );
    }

    function formatNumber(n) {
        return n.toLocaleString("id-ID", { minimumFractionDigits: 0 });
    }

    function handlePaymentChange(e) {
        const value = e.target.value;
        setPayment(value);
    }

    function confirmResetPayment() {
        setConfirmingResetPayment(true);
    }

    function resetPayment(e) {
        e.preventDefault();
        post(route("payment.reset"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    }

    function closeModal() {
        setConfirmingResetPayment(false);
        reset();
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Purchase Order Details
                </h2>
            }
        >
            <Head title="Purchase Order Details" />

            <div className={`py-4`}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h2 className="text-black font-bold">Invoice</h2>
                            <PrimaryButton
                                className="w-min sm:w-auto bg-red-600"
                                onClick={() => {
                                    setData("invoice_id", invoice.invoice_id);
                                    confirmResetPayment();
                                }}
                                disabled={loading}
                            >
                                Reset
                            </PrimaryButton>
                            <PrimaryButton
                                className="w-min sm:w-auto"
                                onClick={() => history.back()}
                                disabled={loading}
                            >
                                Back
                            </PrimaryButton>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="px-6 pt-4 pb-2 flex flex-row justify-between items-center">
                            <h2 className="font-bold text-3xl">INVOICE</h2>
                        </div>
                        <div className="px-6 grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <p className="font-bold">Invoice number</p>
                                <p>{invoice.invoice_number}</p>
                            </div>
                            <div>
                                <p className="font-bold">Date</p>
                                <p>
                                    <DateFormatter date={invoice.created_at} />
                                </p>
                            </div>
                        </div>
                        <div className="px-6 grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="font-bold">Billed to</p>
                                <p>{invoice.users.name}</p>
                                <p>{invoice.users.customer.address}</p>
                                <p>{invoice.users.customer.city}</p>
                                <p>Zipcode: {invoice.users.customer.zipcode}</p>
                            </div>
                            <div>
                                <p className="font-bold">From</p>
                                <p className="font-bold">PT Example Test</p>
                                <p>Street Name</p>
                                <p>City</p>
                                <p>Phone: 01234567890</p>
                                <p>Email: email address</p>
                            </div>
                        </div>
                        <div className="px-6 pb-4">
                            <table className="table-fixed w-full text-sm border border-slate-300 text-left font-light">
                                <thead className="border-b border-slate-300 font-medium">
                                    <tr>
                                        <th className="border-e border-slate-300 px-2 py-2">
                                            Product Name
                                        </th>
                                        <th className="border-e border-slate-300 px-2 py-2">
                                            Total Qty (Unit)
                                        </th>
                                        <th className="border-e border-slate-300 px-2 py-2">
                                            Total Qty (Box)
                                        </th>
                                        <th className="border-e border-slate-300 px-2 py-2">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.invoice_details.length > 0 &&
                                        invoice.invoice_details.map((row) => (
                                            <tr
                                                key={row.product_id}
                                                className="border-b border-slate-300"
                                            >
                                                <td className="border-e border-slate-300 px-2 py-2">
                                                    {row.products.product_name}
                                                </td>
                                                <td className="border-e border-slate-300 px-2 py-2 text-right">
                                                    {row.total_qty}
                                                </td>
                                                <td className="border-e border-slate-300 px-2 py-2 text-right">
                                                    {row.total_box}
                                                </td>
                                                <td className="border-e border-slate-300 px-2 py-2 text-right">
                                                    <div className="flex flex-row justify-between">
                                                        <p>Rp. </p>
                                                        <p>
                                                            {row.total_price.toLocaleString(
                                                                "id-ID",
                                                                {
                                                                    minimumFractionDigits: 0,
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 pb-6">
                            <div className="grid grid-cols-6 gap-4 grid-flow-row">
                                <div className="col-span-4">
                                    {invoice.payments.length > 0 && (
                                        <>
                                            <h2 className="font-bold mb-2">
                                                Payment Transaction
                                            </h2>
                                            <table className="table-fixed w-full text-xs text-left font-light border border-slate-300">
                                                <thead className="border-b border-slate-300 font-medium">
                                                    <tr>
                                                        <th className="border-e border-slate-300 px-2 py-1 w-3/12">
                                                            File
                                                        </th>
                                                        <th className="border-e border-slate-300 px-2 py-1 w-4/12">
                                                            Description
                                                        </th>
                                                        <th className="border-e border-slate-300 px-2 py-1 w-3/12">
                                                            Upload Time
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoice.payments.map(
                                                        (row) => (
                                                            <tr
                                                                key={
                                                                    row.payment_id
                                                                }
                                                                className="border-b border-slate-300"
                                                            >
                                                                <td className="border-e border-slate-300 px-2 py-1">
                                                                    <FilePreviewLink
                                                                        id={
                                                                            row.payment_id
                                                                        }
                                                                        filename={
                                                                            row.filename
                                                                        }
                                                                        className="text-blue-600 underline"
                                                                    />
                                                                </td>
                                                                <td className="border-e border-slate-300 px-2 py-1">
                                                                    {
                                                                        row.description
                                                                    }
                                                                </td>
                                                                <td className="border-e border-slate-300 px-2 py-1">
                                                                    <DateFormatter
                                                                        date={
                                                                            row.created_at
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <h2 className="font-bold mb-2">
                                        Amount Due
                                    </h2>
                                    <table className="table-fixed w-full text-sm text-left font-light border border-slate-300">
                                        <tbody>
                                            <tr className="border-b border-slate-300">
                                                <td className="font-bold border-e border-slate-300 px-2 py-1 w-4/12">
                                                    Total
                                                </td>
                                                <td className="flex flex-row justify-between px-2 py-1">
                                                    <p>Rp. </p>
                                                    <p>
                                                        {invoice.amount.toLocaleString(
                                                            "id-ID",
                                                            {
                                                                minimumFractionDigits: 0,
                                                            }
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-300">
                                                <td className="font-bold border-e border-slate-300 px-2 py-1 w-4/12">
                                                    Paid Amount
                                                </td>
                                                <td className="flex flex-row justify-between px-2 py-1">
                                                    <p>Rp. </p>
                                                    <p>
                                                        {invoice.paid_amount.toLocaleString(
                                                            "id-ID",
                                                            {
                                                                minimumFractionDigits: 0,
                                                            }
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-300">
                                                <td className="font-bold border-e border-slate-300 px-2 py-1 w-4/12">
                                                    Unpaid Amount
                                                </td>
                                                <td className="flex flex-row justify-between px-2 py-1">
                                                    <p>Rp. </p>
                                                    <p>
                                                        {(
                                                            invoice.amount -
                                                            invoice.paid_amount
                                                        ).toLocaleString(
                                                            "id-ID",
                                                            {
                                                                minimumFractionDigits: 0,
                                                            }
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr
                                                className={`border-b border-slate-300 ${
                                                    !showInput && "hidden"
                                                } ${
                                                    invoice.paid_amount >=
                                                        invoice.amount &&
                                                    "hidden"
                                                }`}
                                            >
                                                <td className="font-bold border-e border-slate-300 px-2 py-1 w-4/12">
                                                    Payment
                                                </td>
                                                <td className="flex flex-row justify-between px-2 py-1 items-center">
                                                    <p className="mr-4">Rp. </p>
                                                    <p>
                                                        {formatNumber(
                                                            Number(payment)
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr
                                                className={`border-b border-slate-300 ${
                                                    !showInput && "hidden"
                                                } ${
                                                    invoice.paid_amount >=
                                                        invoice.amount &&
                                                    "hidden"
                                                }`}
                                            >
                                                <td className="font-bold border-e border-slate-300 px-2 py-1 w-4/12">
                                                    Input Payment
                                                </td>
                                                <td className="flex flex-row justify-between px-2 py-1 items-center">
                                                    <p className="mr-4">Rp. </p>
                                                    <TextInput
                                                        id="payment"
                                                        type="number"
                                                        value={payment}
                                                        onChange={
                                                            handlePaymentChange
                                                        }
                                                        className="py-1 w-full text-sm"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {invoice.amount - invoice.paid_amount === 0 ? (
                                <div className="text-center mt-4 py-1 rounded-md bg-green-300">
                                    <strong>Paid at {invoice.paid_date}</strong>
                                </div>
                            ) : (
                                <div className="flex flex-row justify-end mt-4 gap-4">
                                    <button
                                        type="button"
                                        className={`inline-flex items-center py-2 px-4 border border-transparent text-white text-xs uppercase tracking-wider font-bold rounded-md  focus:outline-none focus:ring-2  focus:ring-offset-2 transition ease-in-out duration-150 ${
                                            !showInput
                                                ? "bg-green-600 hover:bg-green-700 focus:ring-green-600"
                                                : "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        } ${
                                            loading &&
                                            "opacity-25 cursor-not-allowed"
                                        }`}
                                        onClick={() => {
                                            setShowInput(!showInput);
                                            setPayment("");
                                        }}
                                        disabled={loading}
                                    >
                                        {showInput
                                            ? "Close"
                                            : "Confirm Payment"}
                                    </button>
                                    <button
                                        type="button"
                                        className={`inline-flex items-center py-2 px-4 border border-transparent text-white text-xs uppercase tracking-wider font-bold rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 focus:outline-none focus:ring-2  focus:ring-offset-2 transition ease-in-out duration-150 ${
                                            !showInput && "hidden"
                                        } ${
                                            loading &&
                                            "opacity-25 cursor-not-allowed"
                                        }`}
                                        onClick={() => submit()}
                                        disabled={loading}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={confirmingResetPayment} onClose={closeModal}>
                <form onSubmit={resetPayment} className="p-6">
                    <div className="flex flex-row justify-between items-center pb-2 mb-4 border-b-2 border-black">
                        <h1 className="font-bold text-xl">
                            Are you sure you want to reset the confirm payment?
                        </h1>
                        <SecondaryButton onClick={closeModal}>
                            Close
                        </SecondaryButton>
                    </div>
                    <div className="pb-4">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div className="pb-2">
                        <DangerButton disabled={processing}>Reset</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
