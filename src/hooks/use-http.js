import { useState } from "react";
import { useCallback } from "react";

//CUSTOM HOOK HTTP: GET POST DELETE PUT
//sans body , avec body JSON.stringify(), avec body formData
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    //Pour controler la présence du constructeur Formdata
    const controlFormData = requestConfig.body instanceof FormData;

    //Pour ne pas avoir le warning : can't perform a React state update on an unmounted component
    let isActive = false;

    try {
      const url = requestConfig.url;

      const response = await fetch(url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body:
          requestConfig.body && controlFormData
            ? requestConfig.body
            : requestConfig.body
            ? JSON.stringify(requestConfig.body)
            : null,
      });

      const dataResponse = await response.json();

      if (response.ok) {
        applyData(dataResponse.results);
      } else {
        isActive = true;
        setError(dataResponse);
      }
    } catch (error) {
      console.log("-->Dans le catch  sendRequest custom hook");
      console.log(error);
    } finally {
      if (isActive) {
        setError(null);
        setIsLoading(false);
      }
    }
  }, []);

  return {
    sendRequest,
    isLoading,
    error,
  };
};

export default useHttp;
