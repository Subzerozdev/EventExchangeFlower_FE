import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadFile = async (file: File) => {
  const storageRef = ref(storage, file.name); // Tham chiếu đến nơi lưu file trên Firebase
  const response = await uploadBytes(storageRef, file); // Upload file lên Firebase
  const downloadURL = await getDownloadURL(response.ref); // Lấy URL của file đã upload
  return downloadURL; // Trả về URL để lưu vào database
}

export default uploadFile;
