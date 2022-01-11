import {React, useState} from 'react';
import Webcam from 'react-webcam';
import {Button, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { useRef, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import BarcodeScannerComponent from "react-qr-barcode-scanner";


const useStyles = makeStyles((theme) => ({
    root: {
        direction: props => props.direction === "rtl" ? "rtl" : props.direction === "ltr" ? "ltr" : "unset",
        textAlign: props => props.direction === "center" ? "center" : null
    },
    button: {
        width: 'auto',
        margin: '10px',
    },
    buttonContainer:{
        textAlign: props => props.direction === "center" ? "center" : null,
        width: props => props.width,
        display: 'inline-block',
        '& .MuiButton-startIcon': {
            marginLeft: props => props.direction === "rtl" ? "8px !important" : "-4px" ,
            marginRight: props => props.direction === "rtl" ? "-4px !important" : "8px"
          },
    },
    resolutionsContainer:{
       padding: "10px"
    },
    barcodeContainer:{
        direction: props => props.direction === "rtl" && props.mirrored ? "ltr" : props.direction === "ltr" && props.mirrored ? "rtl" : props.direction === "ltr" && !props.mirrored ? "ltr" : props.direction === "rtl" && !props.mirrored ? "rtl" : "unset",
        textAlign: props => props.direction === "center" ? "center" : null
    }
}));

//Default array for resolutions
const resolutionsArray = [
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

function WebCamera(props) {
    const webRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const {
        audio = false,
        video = false,
        screenshotFormat = "image/jpeg",
        height="300px",
        width="300px",
        mirrored=true,
        snapText="Snap",
        direction="center",
        imageSmoothing=true,
        screenshotQuality='0.92',
        facingMode="user",
        geoTagging={
            enable: false,
            geoCode_enabled: false,
            reverse_geoCode_handler : null
        },
        resolutions,
        barCode=false,
    } = props;

    const classes = useStyles({ width, direction, mirrored });
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isLocation, setLocation] = useState({
        coordinates:{lat: "", long: ""}
    })
    const [selectedResolution, setSelectedResolution] = useState(resolutionsArray[0].value)
    const [result, setResult] = useState('');
    const [barCodeEnabled, setBarCodeEnbaled] = useState(false);

  const handleStartCaptureClick =()=>{
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }

  const handleDataAvailable = ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    }

  const handleStopCaptureClick=()=>{
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }

  const downloadVideo=()=>{
    if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });       
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
  }

  const parseDateTime=()=>{
        // Parse our locale string to [date, time]
        var date = new Date().toLocaleString('en-US',{hour12:false}).split(" ");
        // Now we can access our time at date[1], and monthdayyear @ date[0]
        var time = date[1];
        var mdy = date[0];
        // We then parse  the mdy into parts
        mdy = mdy.split('/');
        var month = parseInt(mdy[0]);
        var day = parseInt(mdy[1]);
        var year = parseInt(mdy[2]);
        // Putting it all together
        var formattedDate = year + '-' + month + '-' + day + ' ' + time;
        return formattedDate;
  }

    const onCapture = async (type) =>{
        const {snapCallBack, geoTagging, cropMode, barCode} = props;
        let img = null;
        let dateTime = parseDateTime();
        if(type !== 'barCode'){
            if(cropMode === ("S" || 's')){
                img = webRef.current.getScreenshot({width: selectedResolution.width, height: selectedResolution.height})
            }
            else{
                img = webRef.current.getScreenshot();
            }
        }
        const {geoCode_enabled, reverse_geoCode_handler, enabled} = geoTagging;
        let geoCode = "";
        if(geoCode_enabled && reverse_geoCode_handler && enabled){
            await reverse_geoCode_handler(isLocation)
            .then((res)=>{
                geoCode = res;
            })
        }
        const imgArray = {
            buffer: barCode && barCodeEnabled ? null : img,
            geo_tagging:{
                coordinates:{
                    latitude: isLocation.coordinates.lat !== undefined && enabled ? isLocation.coordinates.lat : null,
                    longitude: isLocation.coordinates.long !== undefined && enabled ? isLocation.coordinates.long : null
                },
                geo_code: geoCode_enabled && enabled && geoCode!=="" ? geoCode : null,
                date_time: enabled ? dateTime : null
            },
            content: barCode && barCodeEnabled ? result : null,
            type: barCode && barCodeEnabled ? "bar_code" : "image",
        }
        snapCallBack && snapCallBack(imgArray);   
    }

    const [cameraPermission, setCameraPermission] = useState(false);
    const [loader, setLoader] = useState(true);

    useEffect(()=>{
        if(resolutions && resolutions.length){
            setSelectedResolution(resolutions[0].value);
        }
        else{
            setSelectedResolution(resolutionsArray[0].value)
        }
    },[resolutions])

    const onSuccess = (location)=>{
        setLocation({
            coordinates:{
                lat: location.coords.latitude,
                long: location.coords.longitude,
            }
        })
    }

    const onError =(error)=>{
        switch(error.code) {
            case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.")
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.")
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.")
              break;
            case error.UNKNOWN_ERROR:
              alert("An unknown error occurred.")
              break;
            default:
                console.log('Sorry we are not handling this case');
                break;
        }
    }

    useEffect(()=>{
        if(geoTagging.enabled){
            if(!("geolocation" in Navigator)){
                onError({
                    code:  0,
                    message : "Geolocation not supported",
                })
            }
            if(navigator && navigator.geolocation){
                navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy:true, timeout: 30000});
            }
        }
    },[geoTagging.enabled])

    const handleResolutionChange = (event) =>{
        setSelectedResolution(event.target.value)
    }

    //handler runs on onUpdate for barcode scanner
    const handleScan = (result) => {
        if (result) {
          setResult(result.text);
        }
      }
    
    //handler runs on onError for barcode scanner
    const handleError = (err) => {
        console.error(err)
    }
    
    let videoConstraints= {}
    videoConstraints = {
        facingMode: facingMode,
        width: selectedResolution.width,
        height: selectedResolution.height
    }

    const onUserMedia = ()=>{
        setLoader(false);
        setCameraPermission(true);
    }

    const onUserMediaError = (err)=>{
        setLoader(false);
        setCameraPermission(false);
    }

    return (
        <div className={classes.root}>
            {loader && <Typography component="h6" variant="h6" >Loading...</Typography>}
                <>
                    {cameraPermission ?
                        <>
                            {!barCodeEnabled &&
                                <FormControl className={classes.resolutionsContainer}>
                                    <Select
                                        value={selectedResolution}
                                        onChange={handleResolutionChange}
                                    >
                                        {resolutions && resolutions.length ? resolutions.map((item, index)=>(
                                            <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                                        )) :
                                        resolutionsArray && resolutionsArray.length && resolutionsArray.map((item, index)=>(
                                            <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                            }
                            {barCode ?
                                <div>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={()=>setBarCodeEnbaled(!barCodeEnabled)}
                                        className={classes.button}
                                    >
                                        {barCodeEnabled ? 'Enable Camera' : 'Scan Bar Code'}
                                    </Button>
                                </div>
                                :
                                null
                            }
                        </> : 
                        null
                    }
                    {barCodeEnabled && barCode && cameraPermission 
                        ?
                        <div>
                            <div style={mirrored ? {"transform":'scaleX(-1)' } : null} className={classes.barcodeContainer}>
                                <BarcodeScannerComponent
                                    width={width}
                                    height={height}
                                    onUpdate={(err, result) => {
                                        handleScan(result)
                                    }}
                                    onError={(err) => {
                                        handleError(err)
                                    }}
                                    facingMode={facingMode}
                                />
                            </div>
                            <Button 
                                variant="contained" 
                                color="primary"
                                className={classes.button}
                                onClick={()=>onCapture('barCode')}
                                startIcon={<CameraAltIcon/>}
                            >
                                {snapText}
                            </Button>
                            <div>Scanned Result is: {result}</div>
                        </div>
                        :
                        <>
                            <div>
                                <Webcam
                                    audio={audio}
                                    ref={webRef}
                                    muted
                                    videoConstraints={videoConstraints}
                                    screenshotFormat={screenshotFormat}
                                    height={height}
                                    width={width}
                                    mirrored={mirrored}
                                    imageSmoothing={imageSmoothing}
                                    screenshotQuality={screenshotQuality}
                                    forceScreenshotSourceSize={true}
                                    onUserMedia={onUserMedia}
                                    onUserMediaError={onUserMediaError}
                                />
                            </div>
                    
                            {cameraPermission ?
                                <div className={classes.buttonContainer}>
                                    {video ?
                                        <div>
                                            {capturing ?
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    className={classes.button}
                                                    onClick={handleStopCaptureClick}
                                                    startIcon={<CameraAltIcon/>}
                                                >
                                                    Stop Capture
                                                </Button> 
                                                : 
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    className={classes.button}
                                                    onClick={handleStartCaptureClick}
                                                    startIcon={<CameraAltIcon/>}
                                                >
                                                    Start Capture
                                                </Button>
                                            }
                                            {recordedChunks.length > 0 && 
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    className={classes.button}
                                                    onClick={downloadVideo}
                                                    startIcon={<CameraAltIcon/>}
                                                >
                                                    Download
                                                </Button>
                                            }
                                        </div>  
                                        :   
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            className={classes.button}
                                            onClick={onCapture}
                                            startIcon={<CameraAltIcon/>}
                                        >
                                            {snapText}
                                        </Button>
                                    }
                                </div> : 
                                    !loader ?  
                                        <Typography>Camera Not Detected</Typography>
                                    :
                                null
                            }
                        </>
                    }
                </>
            
        </div>
    )
}

export default WebCamera;