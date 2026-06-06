import { useEffect, useState } from "react";
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [income, setIncome] = useState([]);
  const [sales, setSales] = useState(0);
  const [cost, setCost] = useState(0);
  const [perc, setPerc] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch income data
        const incomeResponse = await userRequest.get("orders/income");
        setIncome(incomeResponse.data);

        // Fetch sales data
        const salesResponse = await userRequest.get("orders/sales");
        setSales(salesResponse.data.sales);

        // Fetch cost data
        const costResponse = await userRequest.get("orders/cost");
        setCost(costResponse.data.cost);

        if (incomeResponse.data.length > 1) {
          const percentage = ((incomeResponse.data[1].total * 100) / incomeResponse.data[0].total) - 100;
          setPerc(Math.floor(percentage));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          {income.length > 1 ? (
            <>
              <span className="featuredMoney">${income[1].total}</span>
              <span className="featuredMoneyRate">
                %{perc}{" "}
                {perc < 0 ? (
                  <ArrowDownward className="featuredIcon negative" />
                ) : (
                  <ArrowUpward className="featuredIcon" />
                )}
              </span>
            </>
          ) : (
            <span className="featuredMoney">Loading...</span>
          )}
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${sales}</span>
        </div>
        <span className="featuredSub">Total Sales</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${cost}</span>
        </div>
        <span className="featuredSub">Total Cost</span>
      </div>
    </div>
  );
}
