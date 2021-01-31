import React, { Suspense } from "react";
import MatxLoading  from "../MatxLoading/MatxLoading";

const MatxSuspense = ({ children }) => {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
};

export default MatxSuspense;
