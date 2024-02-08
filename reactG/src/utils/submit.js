import axios from "axios";
import { config } from "../assets/config";

function getFileExtension(filename) {
  return filename.split(".").pop();
}
function encodeURIExceptEnglish(text) {
  return text
    .split("")
    .map((char) => {
      if (/[a-zA-Z0-9]/.test(char)) {
        return char;
      } else {
        return encodeURIComponent(char);
      }
    })
    .join("");
}
export function getParameter(iconlink, iconfile, group, name, id) {
  let iconUrl;
  if (iconfile === null && iconlink === "") {
    iconUrl = "none";
  } else if (iconlink !== "" && iconfile === null) {
    iconUrl = iconlink;
  } else {
    if (group === "") {
      iconUrl = `${config.API}/getpic/userid${id}/link/${encodeURIExceptEnglish(
        name
      )}.${getFileExtension(iconfile.name)}`;
    } else {
      iconUrl = `${config.API}/getpic/userid${id}/${encodeURIExceptEnglish(
        group
      )}/${encodeURIExceptEnglish(name)}.${getFileExtension(iconfile.name)}`;
    }
  }
  return iconUrl;
}
export async function submitWeb(
  iconfile,
  iconlink,
  url,
  group,
  name,
  id,
  token
) {
  if (iconfile) {
    const icondata = new FormData();
    icondata.append("file", iconfile);
    icondata.append("name", name);
    icondata.append("group", group);
    try {
      const res1 = await axios.post(
        `${config.API}/user/${id}/summitpic`,
        icondata,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res1.status !== 200) {
        throw {
          status: false,
          content: `上传${group}的${name}图片失败,可能是因为文件名有特殊符号`,
        };
      }
    } catch (err) {
      console.error(err);
      throw {
        status: false,
        content: `上传${group}的${name}图片失败,可能是因为文件名有特殊符号`,
      };
    }
  }

  const websitedata = new FormData();
  websitedata.append("group", group);
  websitedata.append("name", name);
  websitedata.append("url", url);
  websitedata.append("icon", iconlink);
  try {
    const res2 = await axios.post(
      `${config.API}/user/${id}/summitweb`,
      websitedata,
      { headers: { Authorization: token } }
    );
    if (res2.status === 200) {
      return { status: true, content: `上传${group}的${name}数据成功` };
    } else {
      return { status: false, content: `上传${group}的${name}数据失败` };
    }
  } catch (err) {
    console.error(err);
    return { status: false, content: `上传${group}的${name}数据失败` };
  }
}
export async function submitLink(
  iconfile,
  iconlink,
  url,
  group,
  name,
  id,
  token
) {
  console.log(id);
  if (iconfile) {
    const icondata = new FormData();
    icondata.append("file", iconfile);
    icondata.append("name", name);
    icondata.append("group", group);
    try {
      const res1 = await axios.post(
        `${config.API}/user/${id}/summitpic`,
        icondata,
        {
          headers: {
            Authorization: token,

            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res1.status !== 200) {
        return {
          status: false,
          content: `上传短链的${name}图片失败,可能是因为文件名有特殊符号`,
        };
      }
    } catch (err) {
      console.error(err);
      return {
        status: false,
        content: `上传短链的${name}图片失败,可能是因为文件名有特殊符号`,
      };
    }
  }

  const websitedata = new FormData();
  websitedata.append("name", name);
  websitedata.append("url", url);
  websitedata.append("icon", iconlink);
  try {
    const res2 = await axios.post(
      `${config.API}/user/${id}/summitlink`,
      websitedata,
      { headers: { Authorization: token } }
    );
    if (res2.status === 200) {
      return { status: true, content: `上传短链的${name}数据成功` };
    } else {
      return { status: false, content: `上传短链的${name}数据失败` };
    }
  } catch (err) {
    console.error(err);
    return { status: false, content: `上传短链的${name}数据失败` };
  }
}
