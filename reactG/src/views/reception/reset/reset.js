import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { postUser, resetPassword } from "../../../utils/reset";
import { checkPassword } from "../../../utils/register";
import { Spin, Tooltip, Input, Modal } from "@douyinfe/semi-ui";
import { IconLock, IconUser } from "@douyinfe/semi-icons";
import "../../../assets/styles/reception.css";
export function IdentityConfirm() {
  // title用于设置Modal对话框标题
  const [title, setTile] = useState("");
  // content用于设置Modal对话框内容
  const [content, setContent] = useState("");
  // username用于将要查找的用户名发送给后端
  const [username, setUsername] = useState("");
  // 设置Modal对话框是否出现
  const [visible, setVisible] = useState(false);
  // sending状态用于判断是否显示Spin
  const [sending, setSending] = useState(false);
  return (
    <div
      className="register"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Modal
        title={`${title}`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footer={
          <button className="buttons" onClick={() => setVisible(false)}>
            确认
          </button>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        {`${content}`}
      </Modal>

      <Spin size="large" spinning={sending}>
        <div>
          <form
            className="container"
            style={{ height: "9rem" }}
            onSubmit={(e) => {
              e.preventDefault();
              // 发送时设置Spin标签
              setSending(true);
              // 发送用户名给后端
              postUser(username)
                .then((res) => {
                  // 结束后设置Spin标签结束旋转
                  setSending(false);
                  if (res.valueOf) {
                    // 显示对话框
                    setVisible(true);
                    setTile("发送成功");
                    setContent("发送成功,请到邮箱确认");
                  } else {
                    // 显示对话框
                    setVisible(true);
                    setTile("发送失败");
                    setContent("发送失败,请查看用户名是否错误");
                  }
                })
                .catch((err) => {
                  // 结束后设置Spin标签结束旋转
                  setSending(false);
                  // 显示对话框
                  setVisible(true);
                  setTile("发送失败");
                  setContent("发送失败,确认用户名是否正确");
                  console.error(err);
                });
            }}
          >
            <div className="inputzone">
              <div className="labels">
                用户名
                <Tooltip content="10位以内,仅字母和数字有效">
                  <IconUser className="icons" />
                </Tooltip>
              </div>
              <Input
                className="inputs"
                minLength={1}
                maxLength={10}
                type="text"
                pattern="^[A-Za-z0-9]+$"
                onChange={(string) => setUsername(string)}
              />
            </div>
            <div className="buttonGroup">
              <button type="submit" className="buttons">
                提交
              </button>
              <NavLink to="/">
                <button className="buttons">返回</button>
              </NavLink>
            </div>
          </form>
        </div>
      </Spin>
    </div>
  );
}

export function EditPassword() {
  // title用于设置Modal对话框标题
  const [title, setTile] = useState("");
  // content用于设置Modal对话框内容
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const nav = useNavigate();
  const { id, token } = useParams();
  return (
    <div
      className="register"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Modal
        title={`${title}`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footer={
          <button className="buttons" onClick={() => setVisible(false)}>
            确认
          </button>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        {`${content}`}
      </Modal>
      <Spin size="large" spinning={sending}>
        <div>
          <form
            style={{ height: "15rem" }}
            className="container"
            onSubmit={(e) => {
              e.preventDefault();
              if (checkPassword(password, confirm)) {
                setSending(true);
                resetPassword(password, id, token)
                  .then((res) => {
                    setSending(false);
                    if (res.valueOf) {
                      nav("/");
                    } else {
                      setVisible(true);
                      setTile("发送失败");
                      setContent("发送失败,请查看用户名是否错误");
                    }
                  })
                  .catch((err) => {
                    setSending(false);
                    setVisible(true);
                    setTile("发送失败");
                    setContent("发送失败,请检查网络");
                    console.error(err);
                  });
              } else {
                setVisible(true);
                setTile("密码不一致");
                setContent("密码不一致,请检查密码");
              }
            }}
          >
            <div className="inputzone">
              <div className="labels">
                密码
                <Tooltip content="必须包含大小写字母和数字的组合,不能使用特殊字符,长度在8-20之间">
                  <IconLock className="icons" />
                </Tooltip>
              </div>
              <Input
                className="inputs"
                mode="password"
                type="password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
                onChange={(string) => setPassword(string)}
              />
            </div>
            <div className="inputzone">
              <div className="labels">
                确认密码
                <Tooltip content="再次输入密码">
                  <IconLock className="icons" />
                </Tooltip>
              </div>
              <Input
                className="inputs"
                mode="password"
                type="password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
                onChange={(string) => setConfirm(string)}
              />
            </div>
            <div className="buttonGroup">
              <button type="submit" className="buttons">
                提交
              </button>
              <NavLink to="/">
                <button className="buttons">返回</button>
              </NavLink>
            </div>
          </form>
        </div>
      </Spin>
    </div>
  );
}
