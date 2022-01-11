<div className={classes.root}>
            {loader ? 
                <Typography component="h6" variant="h6" >Loading...</Typography> 
                : 
                cameraPermission ?
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
                    {barCodeEnabled && barCode
                        ?
                        <div>
                            <div style={mirrored ? {"transform":'scaleX(-1)' } : null}>
                                <BarcodeScannerComponent
                                    width={width}
                                    height={height}
                                    onUpdate={(err, result) => {
                                        handleScan(result)
                                    }}
                                    onError={(err) => {
                                        handleError(err)
                                    }}
                                    facingMode={videoConstraintsResolution.facingMode}
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
                                    videoConstraints={videoConstraintsResolution}
                                    screenshotFormat={screenshotFormat}
                                    height={height}
                                    width={width}
                                    mirrored={mirrored}
                                    audioConstraints={audioConstraints}
                                    imageSmoothing={imageSmoothing}
                                    minScreenshotHeight={minScreenshotHeight}
                                    minScreenshotWidth={minScreenshotWidth}
                                    screenshotQuality={screenshotQuality}
                                    forceScreenshotSourceSize={forceScreenshotSourceSize}
                                    onUserMedia={onUserMedia}
                                    onUserMediaError={onUserMediaError}
                                />
                            </div>
                    
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
                            </div>
                        </>
                    }
                </> : <Typography>Camera Not Detected</Typography>
            }
            
        </div>