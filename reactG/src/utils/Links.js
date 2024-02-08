import axios from "axios";
import { config } from "../assets/config";
export async function getLink(id, token) {
  try {
    const res = await axios.get(`${config.API}/user/${id}/getlink`, {
      headers: { Authorization: token },
    });

    if (res.status === 200) {
      return { status: true, content: res.data };
    } else {
      throw { status: false, content: res.data };
    }
  } catch (err) {
    console.error(err);
    throw { status: false, content: err };
  }
}
export async function deleteLink(id, name, token) {
  try {
    const formdata = new FormData();
    formdata.append("name", name);
    const res = await axios.post(
      `${config.API}/user/${id}/deletelink`,
      formdata,
      {
        headers: { Authorization: token },
      }
    );
    if (res.status === 200) {
      return { status: true, content: `删除${name}成功` };
    } else {
      throw { status: false, content: `删除${name}失败` };
    }
  } catch (err) {
    console.error(err);

    throw { status: false, content: `删除${name}失败` };
  }
}
export async function getWebSite(id, token) {
  try {
    const res = await axios.get(`${config.API}/user/${id}/getwebsite`, {
      headers: { Authorization: token },
    });
    if (res.status === 200) {
      return { status: true, content: res.data };
    } else {
      throw {
        status: false,
        content: {
          websites: [
            {
              label: "none",
              value: {
                icon: ["none"],
                url: ["none"],
                name: ["none"],
              },
            },
          ],
        },
      };
    }
  } catch (err) {
    console.error(err);
    throw {
      status: false,
      content: {
        websites: [
          {
            label: "none",
            value: {
              icon: ["none"],
              url: ["none"],
              name: ["none"],
            },
          },
        ],
      },
    };
  }
}
export async function getSearchResult(id, token, word) {
  const formdata = new FormData();
  formdata.append("word", word);
  try {
    const res = await axios.post(`${config.API}/user/${id}/search`, formdata, {
      headers: { Authorization: token },
    });
    if (res.status === 200) {
      return { status: true, content: res.data };
    } else {
      throw {
        status: false,
        content: {
          websites: [
            {
              label: "none",
              value: {
                icon: ["none"],
                url: ["none"],
                name: ["none"],
              },
            },
          ],
        },
      };
    }
  } catch (err) {
    console.error(err);
    throw {
      status: false,
      content: {
        websites: [
          {
            label: "none",
            value: {
              icon: ["none"],
              url: ["none"],
              name: ["none"],
            },
          },
        ],
      },
    };
  }
}
export async function deleteWebSite(id, token, group, name) {
  const formdata = new FormData();
  formdata.append("group", group);
  formdata.append("name", name);
  try {
    const res = await axios.post(
      `${config.API}/user/${id}/deleteweb`,
      formdata,
      {
        headers: { Authorization: token },
      }
    );
    if (res.status === 200) {
      return { status: true, content: `删除${group}的${name}成功` };
    } else {
      throw { status: false, content: `删除${group}的${name}失败` };
    }
  } catch (err) {
    console.error(err);
    throw { status: false, content: `删除${group}的${name}失败` };
  }
}
export async function deleteWebSiteGroup(id, token, group) {
  const formdata = new FormData();
  formdata.append("group", group);
  try {
    const res = await axios.post(
      `${config.API}/user/${id}/deletewebgroup`,
      formdata,
      {
        headers: { Authorization: token },
      }
    );
    if (res.status === 200) {
      return { status: true, content: `删除${group}成功` };
    } else {
      throw { status: false, content: `删除${group}失败` };
    }
  } catch (err) {
    console.error(err);
    throw { status: false, content: `删除${group}失败` };
  }
}
