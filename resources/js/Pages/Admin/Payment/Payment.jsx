import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import DateFormatter from "@/Components/FormatDate";
import Pagination from "@/Components/Pagination";

export default function Payment({ auth, invoices }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Purchase Order
                </h2>
            }
        >
            <Head title="Purchase Order" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 flex flex-row justify-between">
                            <h2 className="text-black font-bold">
                                Purchase Order
                            </h2>
                        </div>
                        <div className="p-6">
                            <table className="table-fixed w-full text-sm border border-slate-400 text-left font-light">
                                <thead className="border-b border-slate-400 font-medium">
                                    <tr>
                                        <th className="border-e border-slate-400 px-3 py-2">
                                            Invoice Number
                                        </th>
                                        <th className="border-e border-slate-400 px-3 py-2 ">
                                            Amount
                                        </th>
                                        <th className="border-e border-slate-400 px-3 py-2">
                                            Status
                                        </th>
                                        <th className="border-e border-slate-400 px-3 py-2">
                                            Billed Date
                                        </th>
                                        <th className="border-e border-slate-400 px-3 py-2">
                                            Confirm Paid Date
                                        </th>
                                        <th className="border-e border-slate-400 px-3 py-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.data.length > 0 &&
                                        invoices.data.map(
                                            ({
                                                invoice_id,
                                                invoice_number,
                                                amount,
                                                status,
                                                billed_date,
                                                paid_date,
                                            }) => (
                                                <tr
                                                    key={invoice_id}
                                                    className="border-b border-slate-400"
                                                >
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        {invoice_number}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        <div className="flex flex-row justify-between">
                                                            <p>Rp. </p>
                                                            <p>
                                                                {amount.toLocaleString(
                                                                    "id-ID",
                                                                    {
                                                                        minimumFractionDigits: 0,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        {status == "B"
                                                            ? "Billed"
                                                            : "Paid"}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        <DateFormatter
                                                            date={billed_date}
                                                        />
                                                    </td>
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        {paid_date}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-3 py-2 font-medium">
                                                        <Link
                                                            href={route(
                                                                "purchase-order.show"
                                                            )}
                                                            data={{
                                                                id: invoice_id,
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                className={`inline-flex items-center py-2 px-3 border border-transparent bg-blue-600 text-white text-xs uppercase tracking-widest
                                font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 `}
                                                            >
                                                                View Detail
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                            <Pagination links={invoices.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
