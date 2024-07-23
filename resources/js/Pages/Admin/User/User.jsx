import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import React, { useState } from "react";

export default function User({ auth, users }) {
    const [activeIndex, setActiveIndex] = useState(null);

    function handleDetailButton(index) {
        if (index === activeIndex) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-4 flex flex-row justify-between items-center">
                            <h2 className="text-black font-bold">Users</h2>
                            <h2 className="text-black font-bold">
                                Total: {users.total}
                            </h2>
                        </div>
                        <div className="p-4">
                            <table className="table-fixed w-full text-sm border border-slate-400 text-left font-light">
                                <thead className="border-b border-slate-400 font-medium">
                                    <tr>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Name
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Email
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Type
                                        </th>
                                        <th className="border-e border-slate-400 px-4 py-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map(
                                        (
                                            { name, email, usertype, customer },
                                            index
                                        ) => (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-slate-400">
                                                    <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                        {name}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-4 py-2 font-medium">
                                                        {email}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-4 py-2 font-medium capitalize">
                                                        {usertype}
                                                    </td>
                                                    <td className="border-e border-slate-400 px-4 py-2 font-medium capitalize">
                                                        {customer !== null && (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className={`inline-flex items-center py-1 px-2 border border-transparent bg-blue-600 text-white tracking-wide rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition ease-in-out duration-150 ${
                                                                    activeIndex ===
                                                                        index &&
                                                                    "bg-gray-600 focus:ring-gray-600"
                                                                }`}
                                                                onClick={() =>
                                                                    handleDetailButton(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                Details
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                {customer !== null &&
                                                    activeIndex === index && (
                                                        <tr className="border-b border-slate-400 bg-gray-200">
                                                            <td colSpan="4">
                                                                <div className="px-4 py-2">
                                                                    <div className="flex flex-row">
                                                                        <p className="basis-1/4">
                                                                            Phone
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                customer.phone
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <p className="basis-1/4">
                                                                            City
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                customer.city
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <p className="basis-1/4">
                                                                            Address
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                customer.address
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <p className="basis-1/4">
                                                                            Zipcode
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                customer.zipcode
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                            </React.Fragment>
                                        )
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={users.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
