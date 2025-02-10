import { sendBackup } from "../dataRequests/messageRequest";

export const  messageBackup = async(messages)=>{

        const result = await sendBackup(messages);
        if (result) {

          console.info("Başarılı Bir Şekilde Buckup Alındı")
        
          } else {
            console.error("Backup İşlemi Hatalı.")
          }

}