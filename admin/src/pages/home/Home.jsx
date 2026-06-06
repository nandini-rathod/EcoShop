import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo } from "react";
import { userRequest } from "../../requestMethods";
import { useState } from "react";

export default function Home() {

  const [userstats,setUserStats] = useState([])
  const MONTHS = useMemo(()=>["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],[])

  useEffect(()=>{
    const getstats = async() => {
      try{
        const res = await userRequest.get("/users/stats")
        res.data.map(item=>{
          setUserStats(prev=>[
            ...prev,
            {name:MONTHS[item._id-1] ,"Active User" : item.total}
          ])
        })
      }catch(err){}
    }
    getstats()
  },[MONTHS])

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userstats} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
