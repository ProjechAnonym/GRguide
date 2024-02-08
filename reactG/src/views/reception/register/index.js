import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { postUserMessage, checkPassword } from "../../../utils/register";
import { Input, Tooltip, Modal, Spin } from "@douyinfe/semi-ui";
import { IconUser, IconLock, IconMail } from "@douyinfe/semi-icons";
import "../../../assets/styles/reception.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(false);
  const nav = useNavigate();
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
        title="密码不一致!"
        visible={passwordAlert}
        onOk={() => setPasswordAlert(false)}
        onCancel={() => setPasswordAlert(false)}
        closeOnEsc={true}
        footer={
          <button className="buttons" onClick={() => setPasswordAlert(false)}>
            确认
          </button>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        两次密码输入不一致,请检查!
      </Modal>
      <Modal
        title="注册失败!"
        visible={result}
        onOk={() => setResult(false)}
        onCancel={() => setResult(false)}
        closeOnEsc={true}
        footer={
          <button className="buttons" onClick={() => setResult(false)}>
            确认
          </button>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        注册失败,请重试!
      </Modal>
      <Spin size="large" spinning={sending}>
        <div>
          <form
            className="container"
            method="POST"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              if (checkPassword(password, confirm)) {
                setSending(true);
                postUserMessage(username, password, email)
                  .then((res) => {
                    setSending(false);
                    if (res.valueOf) {
                      nav("/");
                    } else {
                      setResult(true);
                    }
                  })
                  .catch((err) => {
                    setSending(false);
                    setResult(true);
                    console.error(err);
                  });
              } else {
                setPasswordAlert(true);
              }
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
            <div className="inputzone">
              <div className="labels">
                密码
                <Tooltip content="必须包含大小写字母和数字的组合,不能使用特殊字符,长度在8-20之间">
                  <IconLock className="icons"></IconLock>
                </Tooltip>
              </div>
              <Input
                className="inputs"
                showClear
                mode="password"
                type="password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
                onChange={(string) => setPassword(string)}
              />
            </div>
            <div className="inputzone">
              <div className="labels">
                验证密码
                <Tooltip content="再次输入密码">
                  <IconLock className="icons"></IconLock>
                </Tooltip>
              </div>
              <Input
                className="inputs"
                showClear
                mode="password"
                type="password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
                onChange={(string) => setConfirm(string)}
              />
            </div>
            <div className="inputzone">
              <div className="labels">
                邮箱
                <IconMail className="icons"></IconMail>
              </div>
              <Input
                className="inputs"
                showClear
                type="email"
                onChange={(string) => setEmail(string)}
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
