import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "./ProductRequest.scss";
import ProductChapters from "../../views/ProductChapters/ProductChapters";
import ProductFeatureForm, { IMoreInfoField } from "../views/ProductFeatureForm/ProductFeatureForm";

interface Filter {
  [key: string]: {
    [key: string]: { selected: boolean };
  };
}

const ProductRequest: NextPage = () => {
  const applianceArray: IMoreInfoField[] = [
    { name: 'refrigerator', selected: false, value: 6 },
    { name: 'tv', selected: false, value: 2 },
    { name: 'dishwasher', selected: false, value: 15 },
    { name: 'space heater', selected: false, value: 15 },
    { name: 'microwave', selected: false, value: 10 },
    { name: 'washing machine', selected: false, value: 10 },
    { name: 'dryer', selected: false, value: 30 },
    { name: 'oven', selected: false, value: 20 },
    { name: 'air conditioner', selected: false, value: 15 },
    { name: 'vacuum cleaner', selected: false, value: 11 },
    { name: 'toaster', selected: false, value: 9 },
    { name: 'blender', selected: false, value: 6 },
    { name: 'coffee maker', selected: false, value: 10 },
    { name: 'electric kettle', selected: false, value: 13 },
    { name: 'hair dryer', selected: false, value: 13 },
    { name: 'iron', selected: false, value: 10 },
    { name: 'fan', selected: false, value: 3 },
    { name: 'stove top', selected: false, value: 15 },
    // { name: 'meth lab', selected: false, value: 0 },  // Not sure about this one
    // { name: 'marijuana growing lights', selected: false, value: 6 }, // Likewise
    { name: 'other', selected: false, value: 10 },
  ];
  return (<>
  <style jsx>{styles}</style>
    <div className="product-listing">
      <ProductChapters/>
 
      <ProductFeatureForm
          title='appliance'
          subtitle='Select applicable appliances that you need power'
          features={applianceArray}
        />
      
    </div>
  </>
  );
};

export default ProductRequest;