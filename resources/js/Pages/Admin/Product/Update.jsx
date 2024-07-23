import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";

function UpdateProduct({ auth, product }) {
    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            product_name: product.product_name,
            qty_per_box: product.qty_per_box,
            product_price: product.product_price,
        });

    const submit = (e) => {
        e.preventDefault();
        put(route("products.update", product.product_id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Update Product
                </h2>
            }
        >
            <Head title="Update Product" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-4 pt-4 flex flex-row justify-between items-center">
                            <h2 className="text-black font-weight-bold font-bold">
                                Update Product
                            </h2>
                            <Link href="/products">
                                <PrimaryButton>Back</PrimaryButton>
                            </Link>
                        </div>
                        <div className="px-4 pb-4 w-11/12 md:w-1/2">
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="productName"
                                        value="Product Name"
                                    />

                                    <TextInput
                                        id="productName"
                                        name="product_name"
                                        value={data.product_name}
                                        className="mt-1 block w-full border-slate-500"
                                        onChange={(e) =>
                                            setData(
                                                "product_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.product_name}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="quantity"
                                        value="Quantity Per Box"
                                    />

                                    <TextInput
                                        type="number"
                                        id="quantity"
                                        name="qty_per_box"
                                        value={data.qty_per_box}
                                        className="mt-1 block w-full border-slate-500"
                                        onChange={(e) =>
                                            setData(
                                                "qty_per_box",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.qty_per_box}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="productPrice"
                                        value="Product Price (Per Box)"
                                    />

                                    <TextInput
                                        type="number"
                                        id="productPrice"
                                        name="product_price"
                                        value={data.product_price}
                                        className="mt-1 block w-full border-slate-500"
                                        onChange={(e) =>
                                            setData(
                                                "product_price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.product_price}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Save
                                    </PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">
                                            Saved.
                                        </p>
                                    </Transition>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default UpdateProduct;
