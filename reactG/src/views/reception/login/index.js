import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setInit } from "../../../slice/identitySlice";
import { LoginRequest, KeepLogin } from "../../../utils/login";
import { Input, Tooltip, Spin, Modal } from "@douyinfe/semi-ui";
import { IconUser, IconLock, IconHelpCircle } from "@douyinfe/semi-icons";
import "../../../assets/styles/reception.css";
export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [diallog, setDiallog] = useState(false);
  const [lastLoading, setLastLoading] = useState(false);
  const [auto, setAuto] = useState(false);
  const init = useSelector((state) => state.identity.init);
  const loading = useSelector((state) => state.identity.loading);
  const status = useSelector((state) => state.identity.status);
  const id = useSelector((state) => state.identity.id);
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    if (status) {
      nav(`/user/${id}/home`);
    }
  }, [status]);

  useEffect(() => {
    if (!init) {
      dispatch(KeepLogin());
      dispatch(setInit(true));
    } else {
      if (lastLoading && auto) {
        if (!status) {
          setDiallog(true);
          setInit(true);
        }
      }
    }
    setLastLoading(loading);
  }, [loading]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Modal
        title="登录失败!"
        visible={diallog}
        onOk={() => setDiallog(false)}
        onCancel={() => setDiallog(false)}
        closeOnEsc={true}
        footer={
          <button className="buttons" onClick={() => setDiallog(false)}>
            确认
          </button>
        }
        style={{ width: "20rem", fontSize: "1.2rem" }}
      >
        登录失败,检查账户或者密码是否输入错误!
      </Modal>
      <Spin size="large" spinning={loading}>
        <div>
          <form
            className="container"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(LoginRequest([username, password]));
              setAuto(true);
            }}
            style={{ height: "15rem" }}
          >
            <div className="inputzone">
              <div className="labels">
                用户名
                <Tooltip content="10位以内,仅字母和数字有效">
                  <IconUser className="icons" />
                </Tooltip>
              </div>
              <div className="inputs">
                <Input
                  minLength={1}
                  maxLength={10}
                  type="text"
                  pattern="^[A-Za-z0-9]+$"
                  onChange={(e) => setUsername(e)}
                />
              </div>
            </div>
            <div className="inputzone">
              <div className="labels">
                密码
                <Tooltip content="必须包含大小写字母和数字的组合,不能使用特殊字符,长度在8-20之间">
                  <IconLock className="icons"></IconLock>
                </Tooltip>
                <Tooltip content="点击找回密码">
                  <NavLink to={"/reset"}>
                    <IconHelpCircle className="icons"></IconHelpCircle>
                  </NavLink>
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
            <div className="buttonGroup">
              <button className="buttons" type="submit">
                登录
              </button>
              <NavLink to={"/register"}>
                <button className="buttons">注册</button>
              </NavLink>
            </div>
          </form>
        </div>
      </Spin>
    </div>
  );
}
