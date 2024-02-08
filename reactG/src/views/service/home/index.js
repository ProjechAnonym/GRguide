import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Avatar, Badge, Modal, Notification, Toast } from "@douyinfe/semi-ui";
import { IconSearch, IconDelete } from "@douyinfe/semi-icons";
import { KeepLogin } from "../../../utils/login";
import { getLink, deleteLink } from "../../../utils/Links";
import { config } from "../../../assets/config";
import "../../../assets/styles/home.css";
import { setInit } from "../../../slice/identitySlice";

export default function Home() {
  const dispatch = useDispatch();
  const linkcontainer = useRef(null);
  const dark = useSelector((state) => state.style.dark);
  const id = useSelector((state) => state.identity.id);
  const token = useSelector((state) => state.identity.token);
  const status = useSelector((state) => state.identity.status);
  const loading = useSelector((state) => state.identity.loading);
  const [engine, setEngine] = useState(
    config.searchEngine[0].groupValue[0].searchvalue
  );
  const [visible, setVisible] = useState(false);
  const [elename, setElename] = useState("");
  const [content, setContent] = useState("");
  const [loginNotice, setLoginNotice] = useState(null);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    if (!status) {
      dispatch(KeepLogin());
      dispatch(setInit(true));
      setLoginNotice(true);
    } else {
      getLink(id, token)
        .then((res) => {
          if (res.status) {
            setLinks(res.content.link);
          } else {
            setLinks([
              {
                url: "null",
                name: "null",
                icon: require("../../../assets/pics/question_mark.png"),
              },
            ]);
          }
        })
        .catch(() => {
          setLinks([
            {
              url: "null",
              name: "null",
              icon: require("../../../assets/pics/question_mark.png"),
            },
          ]);
        });
    }
  }, [status, dispatch]);
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
  useEffect(() => {
    if (status) {
      getLink(id, token)
        .then((res) => {
          if (res.status) {
            setLinks(res.content.link);
          } else {
            setLinks([
              {
                url: "null",
                name: "null",
                icon: require("../../../assets/pics/question_mark.png"),
              },
            ]);
          }
        })
        .catch(() => {
          setLinks([
            {
              url: "null",
              name: "null",
              icon: require("../../../assets/pics/question_mark.png"),
            },
          ]);
        });
    }
  }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
      <Modal
        title={`是否删除${elename}`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footer={
          <>
            <button
              className="buttons"
              onClick={() => {
                deleteLink(id, elename, token)
                  .then((res) => {
                    Notification.open({
                      className: dark
                        ? "dark-homenotification"
                        : "homenotification",
                      title: "删除结果",
                      content: `${res.content}`,
                      duration: 3,
                    });
                  })
                  .catch((res) => {
                    Notification.open({
                      className: dark
                        ? "dark-homenotification"
                        : "homenotification",
                      title: "删除结果",
                      content: `${res.content}`,
                      duration: 3,
                    });
                  });
                setVisible(false);
              }}
            >
              确认
            </button>
            <button className="buttons" onClick={() => setVisible(false)}>
              取消
            </button>
          </>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        您正在尝试删除{`${elename}`}链接,是否确定？
      </Modal>
      <div className={dark ? "dark-home" : "home"}>
        <div className={dark ? "dark-search" : "search"}>
          <select
            onChange={(e) => setEngine(e.target.value)}
            className={dark ? "dark-select" : "select"}
          >
            {config.searchEngine.map((group, index) => {
              return (
                <optgroup
                  key={`selector-group-${index}`}
                  label={group.label}
                  className={dark ? "dark-select-group" : "select-group"}
                >
                  {group.groupValue.map((ele, eleIndex) => {
                    return (
                      <option
                        value={ele.searchvalue}
                        key={`selector-${group[0]}-${eleIndex}`}
                        className={dark ? "dark-select-item" : "select-item"}
                      >
                        {ele.searchlabel}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
          <div>
            <form
              style={{ display: "flex", flexDirection: "row" }}
              onSubmit={(e) => {
                e.preventDefault();
                window.open(`${engine}${content}`, "_blank");
              }}
            >
              <input
                type="search"
                onChange={(e) => setContent(e.target.value)}
                className={dark ? "dark-input" : "input"}
              ></input>
              <button type="submit" className={dark ? "dark-submit" : "submit"}>
                <IconSearch />
              </button>
            </form>
          </div>
        </div>
        <div
          className={dark ? "dark-linkzone" : "linkzone"}
          ref={linkcontainer}
          onWheel={(eve) => {
            const container = linkcontainer.current;
            container.scrollLeft += eve.deltaY / 10;
          }}
        >
          {links.map((link, index) => {
            return index < links.length - 3 ? (
              <div
                key={`link-${index}`}
                className={dark ? "dark-shortlink" : "shortlink"}
              >
                <Avatar
                  alt={link.name}
                  src={
                    link.icon === "none"
                      ? require("../../../assets/pics/question_mark.png")
                      : `${link.icon}`
                  }
                  className={dark ? "dark-avatar" : "avatar"}
                  onClick={() => window.open(link.url, "_blank")}
                  shape="square"
                >
                  {link.name}
                </Avatar>
                <Badge
                  className={dark ? "dark-shortlinkbutton" : "shortlinkbutton"}
                  onClick={() => {
                    setVisible(true);
                    setElename(link.name);
                  }}
                  count={<IconDelete />}
                  theme="solid"
                ></Badge>
              </div>
            ) : (
              <div
                key={`link-${index}`}
                className={dark ? "dark-shortlink" : "shortlink"}
              >
                <Avatar
                  alt={link.name}
                  src={link.icon}
                  className={dark ? "dark-avatar" : "avatar"}
                  onClick={() => window.open(link.url, "_blank")}
                  shape="square"
                >
                  {link.name}
                </Avatar>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
