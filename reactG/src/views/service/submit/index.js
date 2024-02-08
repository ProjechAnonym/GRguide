import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setInit } from "../../../slice/identitySlice";
import { KeepLogin } from "../../../utils/login";
import { IconMinusCircle, IconPlusCircle } from "@douyinfe/semi-icons";
import _ from "lodash";
import Website from "./website";
import Link from "./link";
import "../../../assets/styles/submitPage.css";
export default function Submit() {
  const dark = useSelector((state) => state.style.dark);
  const id = useSelector((state) => state.identity.id);
  const token = useSelector((state) => state.identity.token);
  const dispatch = useDispatch();
  const [linkArray, setLinkArray] = useState([0]);
  const [webArray, setWebArray] = useState([0]);
  useEffect(() => {
    dispatch(KeepLogin());
    dispatch(setInit(true));
  });
  return (
    <div className="submitPagecontainer">
      <div className="submitPageButtonzone">
        <button
          className={dark ? "dark-submitPageButton" : "submitPageButton"}
          onClick={() => {
            const tempArray = _.cloneDeep(webArray);
            if (tempArray.length !== 1) {
              tempArray.pop();
              setWebArray(tempArray);
            }
          }}
        >
          <IconMinusCircle />
        </button>
        <button
          onClick={() => {
            const tempArray = _.cloneDeep(webArray);
            tempArray.push(webArray[webArray.length - 1] + 1);
            setWebArray(tempArray);
          }}
          className={dark ? "dark-submitPageButton" : "submitPageButton"}
        >
          <IconPlusCircle />
        </button>
      </div>
      <div className="submitPageInputzone">
        {webArray.map((web, index) => {
          return (
            <div key={`web-${index}`} style={{ margin: "0.2rem" }}>
              <Website ID={`web-${web}`} id={id} token={token} />
            </div>
          );
        })}
      </div>

      <div className="submitPageButtonzone">
        <button
          className={dark ? "dark-submitPageButton" : "submitPageButton"}
          onClick={() => {
            const tempArray = _.cloneDeep(linkArray);
            if (tempArray.length !== 1) {
              tempArray.pop();
              setLinkArray(tempArray);
            }
          }}
        >
          <IconMinusCircle />
        </button>
        <button
          onClick={() => {
            const tempArray = _.cloneDeep(linkArray);
            tempArray.push(linkArray[linkArray.length - 1] + 1);
            setLinkArray(tempArray);
          }}
          className={dark ? "dark-submitPageButton" : "submitPageButton"}
        >
          <IconPlusCircle />
        </button>
      </div>
      <div className="submitPageInputzone">
        {linkArray.map((web, index) => {
          return (
            <div key={`link-${index}`}>
              <Link ID={`link-${web}`} userid={id} token={token} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
