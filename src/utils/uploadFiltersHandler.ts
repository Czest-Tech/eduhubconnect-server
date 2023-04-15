
require('dotenv').config()
import fs from 'fs';
import  AWS  from 'aws-sdk/clients/s3';



     
const region:string = process.env._AWS_BUCKET_REGION as string;

const accessKeyId:string = process.env._AWS_ACCESS_KEY as string;
const secretAccessKey:string = process.env._AWS_SECRET_ACCESS_KEYY as string;
const bucketName = process.env._AWS_BUCKET_NAME as string;
const  s3 = new AWS({ region,accessKeyId, secretAccessKey});

 export  const uploadS3 = async(file:any): Promise<object | any> => {
  try {
    const fileStream = await fs.createReadStream(file.path)   
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename
    }
  
    const uploadToBucket = await s3.upload(uploadParams).promise();
    return uploadToBucket;
    
  } catch (error:any) {
    throw new Error(error.message);
  };

}

export  const uploadMultipleS3 = async(files:Array<any>): Promise<Array<object> | any> => {
  console.log(files)
  var len = files.length;
  var fileStruct:any[] = [];
  var filefilesbject:any[] = [];
  var count = 0;
  for(let i = 0; i < len; i++){
 
     fileStruct[i] =  await fs.createReadStream(files[i].path)

     const uploadParams = {
        Bucket: bucketName,
        Body:  fileStruct[i],
        Key: files[i].filename
      }

 
      filefilesbject[i] = await s3.upload(uploadParams).promise();

     count ++;
     if(count == len){
      console.log("log complete")
     }
     
  }

 
  return  filefilesbject;


}

export  const deleteMultipleS3 = async(files:any): Promise<object | any> => {

  const file = files
  var len = file.length;
  var fileStruct:any[] = [];
  var filefilesbject:any[] = [];
  var count = 0;
  for(let i = 0; i < len; i++){
     const uploadParams = {
        Bucket: bucketName,
        Key: file[i]
      }
      filefilesbject[i] = await s3.deleteObject(uploadParams).promise();
      console.log(filefilesbject[i],uploadParams)
     
     count ++;
     if(count == len){
      console.log("log complete")
     }
     
  }

 
  return  filefilesbject;


}


// downloads a file from s3
export function getFileStream(fileKey:any) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  return s3.getObject(downloadParams).createReadStream()
}




