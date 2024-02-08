import { useSelector, useDispatch } from "react-redux";
import { setInit } from "../../../slice/identitySlice";
import { useEffect, useState } from "react";
import {
  getWebSite,
  getSearchResult,
  deleteWebSite,
  deleteWebSiteGroup,
} from "../../../utils/Links";
import { KeepLogin } from "../../../utils/login";
import {
  Divider,
  Avatar,
  Popconfirm,
  Tooltip,
  Notification,
  Collapsible,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconSearch,
  IconDeleteStroked,
  IconChevronUp,
  IconChevronDown,
} from "@douyinfe/semi-icons";
import "../../../assets/styles/collect.css";

export default function Collect() {
  const dark = useSelector((state) => state.style.dark);
  const id = useSelector((state) => state.identity.id);
  const token = useSelector((state) => state.identity.token);
  const status = useSelector((state) => state.identity.status);
  const loading = useSelector((state) => state.identity.loading);
  const dispath = useDispatch();
  const [webgroup, setWebgroup] = useState([]);
  const [word, setWord] = useState("");
  const [collapse, setCollapse] = useState(true);
  const [loginNotice, setLoginNotice] = useState(null);
  useEffect(() => {
    if (status) {
      getWebSite(id, token)
        .then((res) => {
          setWebgroup(res.content.websites);
        })
        .catch((errRes) => {
          setWebgroup(errRes.content.websites);
        });
    }
  }, []);
  useEffect(() => {
    if (!status) {
      dispath(KeepLogin());
      dispath(setInit(true));
      setLoginNotice(true);
    } else {
      getWebSite(id, token)
        .then((res) => {
          setWebgroup(res.content.websites);
        })
        .catch((errRes) => {
          setWebgroup(errRes.content.websites);
        });
    }
  }, [status, dispath]);
  useEffect(() => {
    if (!loading && !status && loginNotice) {
      setLoginNotice(
        Toast.warning({
          content: "登录状态失效,请重新登录",
          duration: 0,
          onClose: () => {
            setLoginNotice(null);
          },
        })
      );
    }
  }, [loading]);
  return (
    <div
      style={{
        height: "90vh",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className={dark ? "dark-sitesearch" : "sitesearch"}>
        <form
          style={{ display: "flex", flexDirection: "row" }}
          onSubmit={(e) => {
            e.preventDefault();
            getSearchResult(id, token, word)
              .then((res) => {
                setWebgroup(res.content.websites);
              })
              .catch((res) => {
                setWebgroup(res.content.websites);
              });
          }}
        >
          <input
            type="search"
            className={dark ? "dark-siteinput" : "siteinput"}
            onChange={(e) => setWord(e.target.value)}
          />
          <button className={dark ? "dark-sitebutton" : "sitebutton"}>
            <IconSearch
              className={dark ? "dark-sitesearchIcon" : "sitesearchIcon"}
            />
          </button>
        </form>
      </div>
      <div className="websitecontainer">
        {webgroup.map((group, index) => {
          return (
            <div
              id={group.label}
              key={`webgroup-${index}`}
              className="webgroupcontainer"
            >
              <Divider align="left">
                {group.label === "搜索结果" ? (
                  <Tooltip content={`点击返回原始布局`}>
                    <div
                      className={dark ? "dark-groupname" : "groupname"}
                      onClick={() => {
                        getWebSite(id, token)
                          .then((res) => {
                            setWebgroup(res.content.websites);
                          })
                          .catch((res) => {
                            setWebgroup(res.content.websites);
                          });
                      }}
                    >
                      {group.label}
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip content={`点击删除${group.label}组`}>
                    <Popconfirm
                      position="bottomLeft"
                      className={
                        dark ? "dark-groupnamedelete" : "groupnamedelete"
                      }
                      title={
                        <div style={{ color: dark ? "aliceblue" : "black" }}>
                          删除元素
                        </div>
                      }
                      content={
                        <div
                          className={
                            dark
                              ? "dark-groupnamedeletecontent"
                              : "groupnamecontent"
                          }
                        >
                          {`您正在删除${group.label}组,是否确认?`}
                        </div>
                      }
                      onConfirm={() => {
                        deleteWebSiteGroup(id, token, group.label)
                          .then((res) => {
                            Notification.open({
                              className: dark
                                ? "dark-webdeletenotification"
                                : "webdeletenotification",
                              title: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "black",
                                  }}
                                >
                                  删除结果
                                </div>
                              ),
                              content: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "darkgray",
                                  }}
                                >
                                  {res.content}
                                </div>
                              ),
                            });
                          })
                          .catch((res) => {
                            Notification.open({
                              className: dark
                                ? "dark-webdeletenotification"
                                : "webdeletenotification",
                              title: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "black",
                                  }}
                                >
                                  删除结果
                                </div>
                              ),
                              content: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "darkgray",
                                  }}
                                >
                                  {res.content}
                                </div>
                              ),
                            });
                          });
                      }}
                    >
                      <div className={dark ? "dark-groupname" : "groupname"}>
                        {group.label}
                      </div>
                    </Popconfirm>
                  </Tooltip>
                )}
              </Divider>
              {group.value.icon.map((icon, index) => {
                return (
                  <div
                    key={`${group.label}-ele-${index}`}
                    className={dark ? "dark-websiteCard" : "websiteCard"}
                  >
                    <div
                      className="websiteLink"
                      onClick={() => {
                        window.open(group.value.url[index]);
                      }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      {icon !== "none" ? (
                        <Avatar
                          src={icon}
                          shape="square"
                          style={{ marginRight: "0.5rem" }}
                        />
                      ) : (
                        <></>
                      )}
                      {group.value.name[index]}
                    </div>
                    <Popconfirm
                      position="bottomRight"
                      className={
                        dark ? "dark-groupnamedelete" : "groupnamedelete"
                      }
                      title={
                        <div style={{ color: dark ? "aliceblue" : "black" }}>
                          删除元素
                        </div>
                      }
                      content={
                        <div
                          className={
                            dark
                              ? "dark-groupnamedeletecontent"
                              : "groupnamecontent"
                          }
                        >
                          {`您正在删除${group.label}组的${group.value.name[index]},是否确认?`}
                        </div>
                      }
                      onConfirm={() => {
                        deleteWebSite(
                          id,
                          token,
                          group.label,
                          group.value.name[index]
                        )
                          .then((res) => {
                            Notification.open({
                              className: dark
                                ? "dark-webdeletenotification"
                                : "webdeletenotification",
                              title: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "black",
                                  }}
                                >
                                  删除结果
                                </div>
                              ),
                              content: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "darkgray",
                                  }}
                                >
                                  {res.content}
                                </div>
                              ),
                            });
                          })
                          .catch((res) => {
                            Notification.open({
                              className: dark
                                ? "dark-webdeletenotification"
                                : "webdeletenotification",
                              title: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "black",
                                  }}
                                >
                                  删除结果
                                </div>
                              ),
                              content: (
                                <div
                                  style={{
                                    color: dark ? "aliceblue" : "darkgray",
                                  }}
                                >
                                  {res.content}
                                </div>
                              ),
                            });
                          });
                      }}
                    >
                      <button
                        className={
                          dark ? "dark-websiteButton" : "websiteButton"
                        }
                      >
                        <IconDeleteStroked />
                      </button>
                    </Popconfirm>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="anchorcontainer">
          <button
            className={dark ? "dark-anchorbutton" : "anchorbutton"}
            onClick={() => setCollapse(!collapse)}
          >
            {collapse ? <IconChevronUp /> : <IconChevronDown />}
          </button>
          <Collapsible isOpen={collapse}>
            <div className={dark ? "dark-anchorList" : "anchorList"}>
              {webgroup.map((group, index) => {
                return (
                  <a
                    key={`anchor-${index}`}
                    href={`#${group.label}`}
                    style={{ textDecoration: "none" }}
                    className={dark ? "dark-anchorEle" : "anchorEle"}
                  >
                    {`${group.label}`}
                  </a>
                );
              })}
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
