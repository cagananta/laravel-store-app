import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import CreateUserInformationForm from "./Partials/CreateUserInformationForm";
import UpdateUserInformationForm from "./Partials/UpdateUserInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status, customer }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {auth.user.usertype == "customer" ? (
                        customer === null ? (
                            <div
                                id="delivery-information"
                                className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
                            >
                                <CreateUserInformationForm
                                    auth={auth}
                                    className="max-w-xl"
                                />
                            </div>
                        ) : (
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <UpdateUserInformationForm
                                    customer={customer}
                                    className="max-w-xl"
                                />
                            </div>
                        )
                    ) : (
                        ""
                    )}

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
