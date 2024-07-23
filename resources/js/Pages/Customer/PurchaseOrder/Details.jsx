import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import DateFormatter from "@/Components/FormatDate";
import Modal from "@/Components/Modal";
import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import FilePreviewLink from "@/Components/FilePreviewLink";

function PurchaseOrderDetail({ auth, invoice }) {
    const { data, setData, post, progress, processing, reset } = useForm({
        invoice_id: invoice.invoice_id,
        file: undefined,
        description: "",
    });
    const { errors } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route("payment.store"), {
            onFinish: () => {
                setShowModal(false);
                reset();
            },
        });
    }

    function deleteFile(payment_id) {
        if (confirm("Are you sure?")) {
            router.post(
                route("payment.delete"),
                {
                    payment_id: payment_id,
                },
                {
                    onStart: setLoading(true),
                    onFinish: setLoading(false),
                }
            );
        }
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

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h2 className="text-black font-bold">Invoice</h2>
                            <PrimaryButton
                                className="w-min sm:w-auto"
                                onClick={() => history.back()}
                            >
                                Back
                            </PrimaryButton>
                        </div>
                    </div>
                    {Object.keys(errors).length !== 0 ? (
                        <div className="bg-red-300 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                            <div className="px-6 py-4 flex flex-row">
                                <ul className="list-inside">
                                    {Object.entries(errors).map(
                                        ([key, value]) => (
                                            <li
                                                key={key}
                                                className="list-disc font-bold"
                                            >
                                                {value}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
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
                                                        <th className="border-e border-slate-300 px-2 py-1 w-2/12">
                                                            Action
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
                                                                <td className="border-e border-slate-300 px-2 py-1">
                                                                    {invoice.amount -
                                                                        invoice.paid_amount !==
                                                                        0 && (
                                                                        <button
                                                                            type="button"
                                                                            className={`inline-flex items-center py-1 px-2 my-1 border border-transparent bg-red-600 text-white text-xs uppercase tracking-wide font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                                                                loading &&
                                                                                "opacity-25 cursor-not-allowed"
                                                                            }`}
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                deleteFile(
                                                                                    row.payment_id
                                                                                );
                                                                            }}
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
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
                                                    Left Amount
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
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {invoice.amount - invoice.paid_amount === 0 ? (
                                <div className="text-center mt-4 py-1 rounded-md bg-blue-200">
                                    <strong>
                                        Paid at{" "}
                                        <DateFormatter
                                            date={invoice.paid_date}
                                            type="datetime"
                                        />
                                    </strong>
                                </div>
                            ) : (
                                <div className="flex flex-row justify-end mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex items-center py-2 px-4 border border-transparent bg-green-600 text-white text-xs uppercase tracking-wider font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition ease-in-out duration-150"
                                        onClick={() => setShowModal(true)}
                                        disabled={processing}
                                    >
                                        Submit Payment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} maxWidth="2xl">
                <div className="px-6 py-4 flex flex-row justify-between items-center">
                    <h2 className="font-bold">Payment Submission</h2>
                    <button
                        type="button"
                        className="inline-flex items-center py-2 px-4 border border-transparent bg-red-600 text-white text-xs uppercase tracking-wider font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition ease-in-out duration-150"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </div>
                <hr className="border-slate-400" />
                <div className="px-6 py-4">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="paymentFile"
                                value="Proof of Payment File"
                            />
                            <input
                                id="paymentFile"
                                name="file"
                                type="file"
                                onChange={(e) =>
                                    setData("file", e.target.files[0])
                                }
                                className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white text-sm mb-1"
                            />
                            {progress && (
                                <progress
                                    value={progress.percentage}
                                    max="100"
                                    className="w-full"
                                >
                                    {progress.percentage}%
                                </progress>
                            )}
                        </div>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="description"
                                value="Description"
                            />
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm w-full"
                            ></textarea>
                        </div>
                        <div className="mb-4 text-center">
                            <button
                                type="submit"
                                className="inline-flex items-center py-2 px-4 border border-transparent bg-blue-600 text-white text-xs uppercase tracking-wider font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

export default PurchaseOrderDetail;
