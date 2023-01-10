import axios from "axios";

const token = localStorage.getItem("token");

export const filePreview = (file, setSelectedFile) => {
  if (!file || file.length === 0) return;
  const fileUrl = URL.createObjectURL(file);
  const fileName = file.name;
  const fileType = file.type.split("/")[0];

  setSelectedFile({ fileUrl, fileType, fileName });
};

export const uploadFile = async (file, url, setSelectedFile) => {
  if (!file) {
    return;
  }

  if (file.size > 10000000) {
    return "Error: Select files under 10MB.";
  }
  const formData = new FormData();
  formData.append("file", file);
  let fileLink = undefined;
  try {
    const { data } = await axios.post(`${url}/uf`, formData, { headers: { Authorization: token } });
    if (data) {
      fileLink = data.file_link;
      setSelectedFile({ fileUrl: undefined, fileType: undefined, fileName: "" });
      return fileLink;
    }
  } catch (error) {
    console.log(error);
    return fileLink;
  }
};

export const isLink = (link) => {
  const res = link.startsWith("https://res.cloudinary.com/dnzuptxvy");

  return res;
};
