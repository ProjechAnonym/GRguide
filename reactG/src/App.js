import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Divider, Layout, Popover, Avatar } from "@douyinfe/semi-ui";
import { routes } from "./router";
import NavBar from "./views/service/navbar";
import "./assets/icons/iconfont.css";
import "./assets/styles/footer.css";
import "./assets/styles/layout.css";

function App() {
  const { Footer, Sider, Content } = Layout;
  const dark = useSelector((state) => state.style.dark);
  return (
    <div className="App" style={{ height: "100vh" }}>
      <Layout className={dark ? "dark-layout" : "layout"}>
        <Content>
          <BrowserRouter>
            <Layout style={{ height: "100%" }}>
              <Sider>
                <NavBar></NavBar>
              </Sider>
              <Content>
                <Routes>
                  {routes.map((route) => (
                    <Route
                      path={route.path}
                      key={`route_${route.name}`}
                      element={route.component}
                    ></Route>
                  ))}
                </Routes>
              </Content>
            </Layout>
          </BrowserRouter>
        </Content>
        <Footer style={{ justifyContent: "center", alignItems: "center" }}>
          <Divider>
            <a
              href="https://blog.sifulin.top"
              className={dark ? "dark-links" : "links"}
            >
              <i className="iconfont icon-boke"></i>
            </a>
            <a
              href="https://t.me/+5yh2rgXjWBlmMDk1"
              className={dark ? "dark-links" : "links"}
            >
              <i className="iconfont icon-telegram"></i>
            </a>
            <a
              href="https://github.com/ProjechAnonym"
              className={dark ? "dark-links" : "links"}
            >
              <i className="iconfont icon-github"></i>
            </a>
            <a
              href="https://www.youtube.com/@Linsifu666"
              className={dark ? "dark-links" : "links"}
            >
              <i className="iconfont icon-Youtube"></i>
            </a>
            <a
              href="https://space.bilibili.com/8337954?spm_id_from=333.1007.0.0"
              className={dark ? "dark-links" : "links"}
            >
              <i className="iconfont icon-bilibili"></i>
            </a>
            <Popover
              content={
                <div style={{ fontSize: "0.55rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Avatar
                      src={require("./assets/pics/alipay.png")}
                      shape="square"
                      size="large"
                    ></Avatar>
                    <Avatar
                      src={require("./assets/pics/wechatpay.png")}
                      shape="square"
                      size="large"
                    ></Avatar>
                  </div>
                  <span>这个月只有五块钱了,扫码赏口饭吧~~</span>
                </div>
              }
              position="top"
            >
              <div className={dark ? "dark-links" : "links"}>
                <i className="iconfont icon-Donate"></i>
              </div>
            </Popover>
          </Divider>
          <p className={dark ? "dark-developer" : "developer"}>
            designed by 江南千鹤
          </p>
          <p className={dark ? "dark-developer" : "developer"}>
            developed by sifulin
          </p>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
