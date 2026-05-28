import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const features = [
    [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
    [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
    [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  ];

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#070707] text-black dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-white
        dark:bg-[#070707]
        text-black
        dark:text-white
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-16
        transition-all
        duration-300
      "
    >
      {/* Heading */}
      <h1 className="text-5xl font-bold mb-16">
        Credit Plans
      </h1>

      {/* Cards */}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="
              w-[320px]
              rounded-2xl
              border
              p-7
              transition-all
              duration-300
              hover:scale-105
              bg-white
              dark:bg-[#0d0d0d]
              border-gray-300
              dark:border-purple-900/40
              shadow-lg
            "
          >
            {/* Plan Name */}
            <h2 className="text-3xl font-semibold mb-5">
              {plan.name}
            </h2>

            {/* Price */}
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-bold">
                ${plan.price}
              </span>

              <span className="text-lg mb-1 text-gray-600 dark:text-gray-300">
                / {plan.credits} credits
              </span>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-10 text-lg text-gray-700 dark:text-gray-200">
              {features[index].map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            {/* Button */}
            <button
              className="
                w-full
                py-3
                rounded-lg
                font-semibold
                text-lg
                transition-all
                duration-300
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-500
                hover:opacity-90
                text-white
              "
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;