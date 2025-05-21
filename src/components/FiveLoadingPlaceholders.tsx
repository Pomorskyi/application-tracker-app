import React from "react";
import PlaceholderLoading from "react-placeholder-loading";

const FiveLoadingPlaceholders = () => {
  return (
    <div className="m-5 flex flex-col align-middle gap-10">
      <PlaceholderLoading shape="rect" width="100%" height={20} />
      <PlaceholderLoading shape="rect" width="100%" height={20} />
      <PlaceholderLoading shape="rect" width="100%" height={20} />
      <PlaceholderLoading shape="rect" width="100%" height={20} />
      <PlaceholderLoading shape="rect" width="100%" height={20} />
    </div>
  );
};

export default FiveLoadingPlaceholders;
