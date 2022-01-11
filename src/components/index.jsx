import {React, useState} from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import WebCamera from '../genericComponent/WebCamera';

const GOOGLE_API_KEY = "J4SPF3rBWNBZOAdl6wxUxzw3JUwY6i9Fhs-4EJmf5-Y"

const useStyles = makeStyles((theme)=>({
    heading:{
        textAlign: 'center',
    },
    imagePreviewContainer:{
        textAlign: 'center',
    },
    btnContainer:{
        margin: '10px'
    },
    btnDivContainer:{
        textAlign:'center'
    },
    geoTagContainer:{
        position: 'relative',
        display: 'inline-block',
    },
    geoTag:{
        position: "absolute",
        textAlign: 'center',
        color: "white",
        bottom:'0',
        right: '35%'
    }
}))

function WebCamComponent(props){
    const [imageArray, setImageArray] = useState({});
    const [isShowJSON, getOutputJSON] = useState(false);
    const classes = useStyles({});
    const snapCallBackHandler = (props) =>{ 
        console.log('props', props)
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

    //reversegeoCode function
    const getReverseGeoCodeHandler = (location) =>{
      return fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.coordinates.lat}%2C${location.coordinates.long}&lang=en-US&apikey=${GOOGLE_API_KEY}`)
        .then(response => response.json())
    
    }

    return (
        <>
            <Typography variant="h5" component="h2" className={classes.heading}>Please align the document with camera</Typography>
            
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
                    reverse_geoCode_handler : getReverseGeoCodeHandler //function of reverse geo code
                }}
                barCode={true} //to enable the barcode feature
            />
            <div className={classes.imagePreviewContainer}>
                <Typography variant="h6" component="h6">Image Preview</Typography>
                {imageArray && Object.keys(imageArray).length !== 0 && imageArray.buffer !==null ? 
                    <div className={classes.geoTagContainer}>
                        <img src={imageArray.buffer} alt="screenshot" width='30%' height='30%' />
                        {imageArray.geo_tagging && imageArray.geo_tagging.geo_code && imageArray.geo_tagging.geo_code.items && imageArray.geo_tagging.geo_code.items[0] && imageArray.geo_tagging.geo_code.items[0].address.city ? <Typography className={classes.geoTag}>{imageArray.geo_tagging.geo_code.items[0].address.city}</Typography> : null}
                    </div>
                    : 
                    <Typography>No Image Found</Typography>
                }
            </div>
            {imageArray ? <div className={classes.imagePreviewContainer}>
                <Button variant="contained" color="primary" onClick={()=>getOutputJSON(true)}>Show JSON Data</Button>
                {isShowJSON ? 
                    <div>{JSON.stringify(imageArray)}</div>
                    :
                    null
                }
            </div> : null}
        </>
    )
}

export default WebCamComponent;