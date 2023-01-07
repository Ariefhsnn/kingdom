import axios from "axios";
import { toastify } from "../utils/useFunction";

export const getGroupById = async(id, token) => {
    let groupData;
    const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

    try {
      const res = await axios.get(`v1/group/${id}`, config);  
      let { data, status } = res;
      if(status == 200 || status == 201){
        groupData = data.data;
        console.log(data, 'datadata')
      }
    } catch (error) {
        let { data } = error.response;
        toastify(data?.message, "error");
    }
    
    return groupData;
}