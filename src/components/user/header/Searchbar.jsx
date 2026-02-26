import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Form from "../../common/form/Form";

const Searchbar = () => {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        // Redirect to shop with search param
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div className="relative w-full max-w-sm py-3">

            <Form onSubmit={handleSearch}>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="
            w-full
            border border-gray-300
            rounded-full
            py-2 pl-4 pr-10
            text-sm

            focus:outline-none
            focus:ring-2
            focus:ring-gray-200
            transition
            text-gray-700
          "
                />

                <button
                    type="submit"
                    className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2

            text-gray-500
            hover:text-black
            transition
          "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

            </Form>

        </div>
    );
};

export default Searchbar;