import React, { Suspense } from "react";
import Loader from "./Loader";

// ==============================|| LOADABLE - LAZY LOADING ||============================== //
const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader width={200} height={200} />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;