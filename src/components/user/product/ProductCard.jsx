import { Link } from "react-router-dom";

const ProductCard = ({ item }) => (

  <div
    className="
      bg-white rounded-3xl overflow-hidden
      border shadow-sm

      hover:shadow-xl
      hover:-translate-y-1

      transition-all duration-300
    "
  >

    <Link to={`/products/${item._id}`} className="block overflow-hidden group">

      <img
        src={item?.thumbnail?.url}
        alt="product"
        className="
          aspect-[3/4]
          w-full object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />

    </Link>


    <div className="p-3 lg:p-4">


      <p className="text-xs uppercase text-gray-500 tracking-wide">
        {item.category}
      </p>

      <p className="mt-1 font-semibold text-sm lg:text-base line-clamp-2">

        {item.title}
      </p>


      <div className="flex items-center gap-3 mt-2">

        <span className="font-semibold text-sm lg:text-base">

          ₹{item.price}
        </span>

        <span className="text-xs lg:text-sm line-through text-gray-400">

          ₹{item.mrp}
        </span>

      </div>

      {/* Color Variants */}
      {item.allColors?.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3">

          {item.allColors.slice(0, 5).map((c, idx) => {

            const dot = (
              <span
                key={idx}
                title={c.name}
                className={`
            w-3 h-3 lg:w-4 lg:h-4

            rounded-full
            border border-gray-300
                  inline-block
            transition-transform

            ${c.inStock
                    ? "cursor-pointer hover:scale-125"
                    : "opacity-30 cursor-not-allowed"}
          `}
                style={{ backgroundColor: c.colorHex }}
              />
            );

            // Clickable only if in stock
            if (c.inStock) {
              return (
                <Link
                  key={idx}
                  to={`/products/${item._id}?color=${c.colorName}`}
                >
                  {dot}
                </Link>
              );
            }

            return dot;
          })}

          {/* +More indicator */}
          {item.allColors.length > 5 && (
            <span className="text-xs text-gray-500 ml-1">
              +{item.allColors.length - 5}
            </span>
          )}

        </div>
      )}


    </div>

  </div>
);

export default ProductCard;