import { useState } from "react";
import { useSelector } from "react-redux";
import { getParameter, submitLink } from "../../../utils/submit";
import { Tooltip, Notification, Spin } from "@douyinfe/semi-ui";
import {
  IconDeleteStroked,
  IconCloudUploadStroked,
  IconHelpCircle,
  IconCrossCircleStroked,
} from "@douyinfe/semi-icons";
import "../../../assets/styles/submit.css";
import "../../../assets/icons/warning/iconfont.css";
export default function Link(props) {
  const dark = useSelector((state) => state.style.dark);
  const { userid, token, ID } = props;
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconData, setIconData] = useState(null);
  const [iconlink, setIconLink] = useState("");
  const [err, setErr] = useState("");
  const [spin, setSpin] = useState(false);
  const [submitstatus, setSubmitStatus] = useState(true);

  return (
    <div className="websitecontanier">
      <Spin spinning={spin}>
        <form
          className={dark ? "dark-submitform" : "submitform"}
          onSubmit={(e) => {
            e.preventDefault();
            setSpin(true);
            if (name === "" || url === "") {
              Notification.warning({
                className: dark
                  ? "dark-submitNotificationzone"
                  : "submitNotificationzone",
                title: (
                  <div
                    className={
                      dark
                        ? "dark-submitNotificationhead"
                        : "submitNotificationhead"
                    }
                  >
                    警报
                  </div>
                ),
                content: (
                  <div
                    className={
                      dark ? "dark-submitNotification" : "submitNotification"
                    }
                  >
                    重新输入组名,名称以及链接
                  </div>
                ),
              });
              setSpin(false);
              setSubmitStatus(false);
            }
            const iconLink = getParameter(iconlink, icon, "", name, userid);
            submitLink(icon, iconLink, url, "", name, userid, token)
              .then((res) => {
                Notification.info({
                  className: dark
                    ? "dark-submitNotificationzone"
                    : "submitNotificationzone",
                  title: (
                    <div
                      className={
                        dark
                          ? "dark-submitNotificationhead"
                          : "submitNotificationhead"
                      }
                    >
                      提交网站信息
                    </div>
                  ),
                  content: (
                    <div
                      className={
                        dark ? "dark-submitNotification" : "submitNotification"
                      }
                    >
                      {res.content}
                    </div>
                  ),
                });
                setSpin(false);
                if (res.status) {
                  setSubmitStatus(true);
                } else {
                  setSubmitStatus(false);
                }
              })
              .catch((res) => {
                Notification.error({
                  className: dark
                    ? "dark-submitNotificationzone"
                    : "submitNotificationzone",
                  title: (
                    <div
                      className={
                        dark
                          ? "dark-submitNotificationhead"
                          : "submitNotificationhead"
                      }
                    >
                      提交网站信息
                    </div>
                  ),
                  content: (
                    <div
                      className={
                        dark ? "dark-submitNotification" : "submitNotification"
                      }
                    >
                      {res.content}
                    </div>
                  ),
                });
                setSpin(false);
                setSubmitStatus(false);
              });
          }}
        >
          <div
            className={dark ? "dark-submitInputzone" : "submitInputzone"}
            style={{ marginTop: "2rem" }}
          >
            <span>
              网站名称
              <Tooltip content="8个字以内">
                <IconHelpCircle style={{ marginLeft: "0.3rem" }} />
              </Tooltip>
            </span>
            <input
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              className={dark ? "dark-submitshort" : "submitshort"}
              maxLength={8}
            />
          </div>
          <div
            className={dark ? "dark-submitInputzone" : "submitInputzone"}
            style={{ marginTop: "1rem" }}
          >
            <span>
              图标链接
              <Tooltip content="如果上传图片此输入框将不可用">
                <IconHelpCircle style={{ marginLeft: "0.3rem" }} />
              </Tooltip>
            </span>
            <input
              disabled={icon ? true : false}
              type="url"
              className={dark ? "dark-submitlong" : "submitlong"}
              maxLength={255}
              onChange={(e) => {
                setIconLink(e.target.value);
              }}
            />
          </div>
          <div className={dark ? "dark-submitInputzone" : "submitInputzone"}>
            <span>
              网站链接
              <Tooltip content="网站的链接">
                <IconHelpCircle style={{ marginLeft: "0.3rem" }} />
              </Tooltip>
            </span>
            <input
              required
              type="url"
              className={dark ? "dark-submitlong" : "submitlong"}
              maxLength={255}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className={dark ? "dark-submitButtonzone" : "submitButtonzone"}>
            <input
              id={`${ID}`}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              disabled={iconlink ? true : false}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size <= 2097152) {
                  setIcon(file);
                  setIconData(null);
                  setErr(null);
                } else {
                  setIcon(null);
                  setIconData(null);
                  setErr("文件大小超过2Mb");
                  return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setIconData(reader.result);
                  setErr(null);
                };
              }}
            />
            {iconlink ? (
              <Tooltip content={iconlink ? "已经填入链接,无法上传图片" : ""}>
                <label
                  htmlFor={`${ID}`}
                  id={iconlink ? "disabledbutton" : ""}
                  className={dark ? "dark-submitbutton" : "submitbutton"}
                >
                  <IconCloudUploadStroked size="large" />
                </label>
              </Tooltip>
            ) : (
              <label
                htmlFor={`${ID}`}
                id={iconlink ? "disabledbutton" : ""}
                className={dark ? "dark-submitbutton" : "submitbutton"}
              >
                <IconCloudUploadStroked size="large" />
              </label>
            )}
            <div className={dark ? "dark-fileInfo" : "fileInfo"}>
              {iconlink ? (
                <img src={iconlink} className="iconPic" alt="" />
              ) : (
                <></>
              )}
              {iconData ? (
                <div>
                  <img src={iconData} className="iconPic" alt="" />
                  <button
                    className={dark ? "dark-icondelete" : "icondelete"}
                    onClick={() => {
                      setIcon(null);
                      setIconData(null);
                    }}
                  >
                    <IconDeleteStroked />
                  </button>
                </div>
              ) : (
                <></>
              )}
              {err ? (
                <span>
                  <i
                    className="iconfont icon-warning"
                    style={{ color: "red" }}
                  />
                  {err}
                </span>
              ) : (
                <></>
              )}
            </div>
            <button
              className={dark ? "dark-submitbutton" : "submitbutton"}
              type="submit"
            >
              {submitstatus ? (
                "上传"
              ) : (
                <Tooltip content="上传失败,可能是网络原因,或者是登录状态失效">
                  {`失败`}
                  <IconCrossCircleStroked style={{ color: "red" }} />
                </Tooltip>
              )}
            </button>
          </div>
        </form>
      </Spin>
    </div>
  );
}
