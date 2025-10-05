import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(null);   // ✅ useState, not useFormState
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      return response; // ✅ return response so caller can also use it
    } catch (error) {
      setError(error);
      toast.error(error.message || "Something went wrong");
      throw error; // rethrow so caller can catch if needed
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
