import {React, useState} from 'react';
import WebCamera from '../common/WebCamera';

function WebCamComponent(props){
    const [imageArray, setImageArray] = useState({});
    const snapCallBackHandler = (props) =>{ 
        setImageArray(props);
    }

    const resolutions = [
        {
            label:"2MP",
            value:{
                width: 1600,
                height: 1200
            }  
        },
        {
            label:"3MP",
            value:{
                width: 2048,
                height: 1536
            }  
        },
        {
            label:"4MP",
            value:{
                width: 2688,
                height: 1520
            } 
        },
        {
            label:"5MP",
            value:{
                width: 2560,
                height: 1920
            } 
        },
        {
            label:"6MP",
            value:{
                width: 3032,
                height: 2008
            } 
        },
        {
            label:"8MP",
            value:{
                width: 3264,
                height: 2448
            } 
        }
    ]

     const getBarCodeData = (data)=>{
        console.log(data)
     }

    return (
        <>            
            <WebCamera
                audio={false} //to enable audio recording feature
                video={false} //to enable the video recording feature
                height='200px' //height of the camera canvas in px
                width='400px' //width of the camera canvas in px
                screenshotFormat="image/jpeg" //define the image format(jpeg, png)
                snapText="Snap" //name for button to click the photo
                snapCallBack={snapCallBackHandler} //Action on button click
                mirrored={true} //to enable the mirroring feature.
                direction="center" //to set direction of layout and rendering element.
                screenshotQuality='1' //to set the quality of captured photo and value lies b/w 0 to 1
                facingMode="user" //send the facing mode i.e user for front and enviornment for rear or external
                resolutions={resolutions} //to send the custom array of resolutions
                cropMode="C" //C for cropping, S for Cropping + Shrinking and by default value would be "C" 
                geoTagging={{
                    enabled:true, //to enable the location for latitude and langitude
                    geoCode_enabled: true, //to get the geo_code in data buffer
                }}
                enableQrCode={true} //to enable the barcode feature
                getBarCodeData={getBarCodeData}
                videoBtns={{
                    start: "Start",
                    stop:"Stop",
                    download:"Download"
                }}
                
            />
        </>
    )
}

export default WebCamComponent;