import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axios, token } = useAppContext();

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

  // ================= FETCH PLANS =================

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get(
        "/api/credit/plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(
          data.message || "Failed to fetch plans"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const purchasePlan = async (planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase',{planId}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if(data.success){
          window.location.href = data.url
        }else{
           toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div
        className="
        flex items-center justify-center
        min-h-screen
        bg-white dark:bg-[#070707]
        text-black dark:text-white
      "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen w-full
      bg-white dark:bg-[#070707]
      text-black dark:text-white
      px-6 py-14
      flex flex-col items-center
      transition-all duration-300
    "
    >
      {/* ================= HEADING ================= */}

      <div className="text-center mb-14">
        <h1
          className="
          text-4xl md:text-5xl
          font-bold
        "
        >
          Credit Plans
        </h1>

        <p
          className="
          mt-3 text-gray-500
          dark:text-gray-400
          text-sm md:text-base
        "
        >
          Upgrade your AI experience with more credits
        </p>
      </div>

      {/* ================= CARDS ================= */}

      <div
        className="
        flex flex-wrap
        justify-center gap-6
      "
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              relative
              w-[285px]
              rounded-2xl
              border
              p-6
              shadow-md
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-xl
              
              ${
                index === 1
                  ? "bg-[#f8f4ff] dark:bg-[#1b1228] border-purple-400"
                  : "bg-white dark:bg-[#111111] border-gray-200 dark:border-white/10"
              }
            `}
          >
            {/* Popular Tag */}

            {index === 1 && (
              <div
                className="
                absolute top-4 right-4
                px-3 py-1 rounded-full
                text-[10px] font-semibold
                bg-gradient-to-r
                from-fuchsia-600 to-purple-500
                text-white
              "
              >
                POPULAR
              </div>
            )}

            {/* Plan Name */}

            <h2
              className="
              text-2xl font-semibold
              mb-4
            "
            >
              {plan.name}
            </h2>

            {/* Price */}

            <div
              className="
              flex items-end gap-1
              mb-7
            "
            >
              <span
                className="
                text-4xl font-bold
                text-fuchsia-600
                dark:text-fuchsia-400
              "
              >
                ${plan.price}
              </span>

              <span
                className="
                text-sm mb-1
                text-gray-500
                dark:text-gray-300
              "
              >
                / {plan.credits} credits
              </span>
            </div>

            {/* Features */}

            <ul className="space-y-3 mb-8">
              {features[index].map((feature, i) => (
                <li
                  key={i}
                  className="
                  flex items-center gap-3
                  text-sm
                  text-gray-700 dark:text-gray-200
                "
                >
                  {/* Tick */}

                  <div
                    className="
                    w-5 h-5
                    rounded-full
                    flex items-center justify-center
                    text-white text-xs
                    bg-gradient-to-r
                    from-fuchsia-600
                    to-purple-500
                  "
                  >
                    ✓
                  </div>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}

            <button onClick={()=> toast.promise(purchasePlan(plan._id),{loading:'processing...'})}
              className="
              w-full py-3
              rounded-xl
              text-white
              font-semibold
              text-sm
              bg-gradient-to-r
              from-fuchsia-600
              to-purple-500
              hover:opacity-90
              transition-all duration-300
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