import { Link } from "@inertiajs/react";

function FilePreviewLink({ id, filename, className = "" }) {
    function handlePreview(e) {
        e.preventDefault();
        // var newWindow = window.open(`/payment/preview-file/${id}`, "_self");
        // window.location.href = `/payment/preview-file/${id}`;
    }

    return (
        <a
            href={`/payment/preview-file/${id}`}
            className={className}
            target="_blank"
        >
            {filename}
        </a>
    );
}

export default FilePreviewLink;
