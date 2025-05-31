import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setcurrentuser } from "../action/currentuser";
import { getUserProfile } from "../Api/index";
import { useNavigate } from "react-router-dom";

const GoPremiumButton = ({ setUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentuser = useSelector((state) => state.currentuserreducer);
  const userId = currentuser?.result?._id;

  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/create-order`
      );

      const options = {
        key: "rzp_test_uqwVUrmX3Q1xBy",
        amount: data.amount,
        currency: data.currency,
        name: "YourTube Premium",
        description: "Upgrade to Premium",
        order_id: data.orderId,
        handler: async function (response) {
          // 2. Verify payment on backend
          await axios.post(
            `${process.env.REACT_APP_API_URL}/user/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            }
          );

          // 3. Fetch updated user profile
          const updatedUserRes = await getUserProfile(userId);
          const updatedUser = updatedUserRes.data;

          // 4. Update user state (local + Redux)
          if (updatedUser) {
            const savedProfile = localStorage.getItem("Profile");

            if (!savedProfile) {
              console.warn("No user profile found in localStorage");
              return;
            }

            const parsedProfile = JSON.parse(savedProfile);

            // Replace only the result, keep token unchanged
            parsedProfile.result = updatedUser;

            setUser(parsedProfile);
            localStorage.setItem("Profile", JSON.stringify(parsedProfile));
            dispatch(setcurrentuser(parsedProfile));
          } else {
            console.error("Error: updatedUser is null, not updating state!");
          }
          // navigate("/");
          navigate("/", { state: { refresh: true } });
          
          // alert("Payment successful! Premium activated.");
        },
        prefill: {
          name: currentuser?.result?.name || "",
          email: currentuser?.result?.email || "",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <button
      style={{
        backgroundColor: "black",
        color: "white",
        border: "white 1px solid",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "bold",
      }}
      onClick={handlePayment}
    >
      Go Premium
    </button>
  );
};

export default GoPremiumButton;
