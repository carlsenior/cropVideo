// hard coded src for example
const src =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Image,
  Transformer,
  Group,
  Rect,
  KonvaNodeComponent,
} from "react-konva";
import Konva from "konva";
import useKonvaContext from "./useKonvaContext";
import { CanvasActions } from "./store/actions";
import { Vector2d } from "konva/lib/types";
import { KonvaEventObject } from "konva/lib/Node";

const VideoController = () => {
  const {
    canvasState,
    dispatch,
    // handleDragMove,
    // handleUndo,
    // handleRedo,
    // handleDragEnd,
    // handleDragStart,
    // canvasDispatch,
  } = useKonvaContext();

  const {
    current: { imageProps, cropRect, stageDimensions, canvasAction },
  } = canvasState;

  useEffect(
    () => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
          // if (event.key === "z") {
          //   canvasDispatch({
          //     type: "undo",
          //   });
          // } else if (event.key === "y") {
          //   canvasDispatch({
          //     type: "redo",
          //   });
          // }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [
      /*canvasDispatch*/
    ]
  );

  const [image, setImage] = useState<Konva.Image | undefined>(undefined);
  const imageRef = useRef<Konva.Image>(null);

  const videoRef = useRef(null);

  const updateCanvas = useCallback(() => {
    // @ts-ignore
    if (videoRef.current && videoRef.current.readyState >= 3) {
      // @ts-ignore
      setImage(videoRef.current);
      // @ts-ignore
      layerRef.current.batchDraw();
    }
    // @ts-ignore
    animationRef.current = requestAnimationFrame(updateCanvas);
    return () => {
      animationRef &&
        animationRef.current &&
        cancelAnimationFrame(animationRef.current);
    };
  }, [videoRef]);

  const initialLoad = useRef(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // initial canvas load
  //   useEffect(() => {
  //     console.log("Checking video element and load status...");
  //     if (!videoRef.current) return;

  //     if (
  //       videoLoaded &&
  //       !initialLoad.current &&
  //       videoRef.current.readyState >= 3
  //     ) {
  //       console.log("Video is ready, attempting to fetch first frame...");

  //       videoRef.current.muted = true;
  //       videoRef.current
  //         .play()
  //         .then(() => {
  //           setTimeout(() => {
  //             if (videoRef.current) {
  //               console.log("Pausing video and updating canvas...");
  //               videoRef.current.pause();
  //               videoRef.current.muted = false;
  //               videoRef.current.currentTime = 0;
  //               updateCanvas();
  //               initialLoad.current = true;
  //             }
  //           }, 100);
  //         })
  //         .catch((error) => {
  //           console.error("Error attempting to play video:", error);
  //         });
  //     }
  //   }, [updateCanvas, videoLoaded, videoRef]);

  // useEffect(() => {
  //   const animationFrameId = requestAnimationFrame(updateCanvas);
  //   return () => {
  //     cancelAnimationFrame(animationFrameId);
  //   };
  // }, [updateCanvas]);

  const [showBlank, setShowBlank] = useState<boolean>(false);

  const rectRef = useRef();
  // const [clipDimensions, setClipDimensions] = useState({
  //   x: 0,
  //   y: 0,
  //   width: 720,
  //   height: 360,
  // });

  // Confirm crop selection
  const confirmCrop = () => {
    // imageDispatch({
    // 	type: "set_image_action",
    // 	payload: {
    // 		imageAction: CanvasActions.NONE,
    // 	},
    // });
    // @ts-ignore
    const { x, y, width, height } = rectRef.current.attrs;

    // Update the video dimensions to match the overlay dimensions
    // setStageDimensions({
    //   width: width,
    //   height: height,
    // });

    console.log(x);
    const newVideoPosition = {
      x: -x,
      y: -y,
    };

    const newVideoDimensions = {
      width,
      height,
    };
    // setClipDimensions({ x, y, width, height });

    // imageDispatch({
    // 	type: "crop",
    // 	payload: {
    // 		height: newVideoDimensions.height,
    // 		width: newVideoDimensions.width,
    // 		x: newVideoPosition.x,
    // 		y: newVideoPosition.y,
    // 	},
    // });
  };

  const setTikTokFormat = () => {
    // imageDispatch({
    // 	type: "set_image_action",
    // 	payload: {
    // 		imageAction: CanvasActions.NONE,
    // 	},
    // });
    // const aspectRatio = 9 / 16;
    // // Calculate new canvas width to maintain the aspect ratio based on the current height
    // const newWidth = stageHeight * aspectRatio;
    // // Calculate new video dimensions and position to fit the TikTok format
    // const scale = Math.min(stageHeight / imageHeight, newWidth / imageWidth);
    // const newVideoWidth = imageWidth * scale;
    // const newVideoHeight = imageHeight * scale;
    // const newX = (newWidth - newVideoWidth) / 2;
    // const newY = (stageHeight - newVideoHeight) / 2;
    // Update canvas, video dimensions, and video position
    // setVideoDimensions({ width: newVideoWidth, height: newVideoHeight });
    // setVideoPosition({ x: newX, y: newY });
    // imageDispatch({
    // 	type: "crop",
    // 	payload: {
    // 		width: newVideoWidth,
    // 		height: newVideoHeight,
    // 		x: newX,
    // 		y: newY,
    // 	},
    // });
  };

  const setYoutubeFormat = () => {
    // imageDispatch({
    // 	type: "set_image_action",
    // 	payload: {
    // 		imageAction: CanvasActions.NONE,
    // 	},
    // });

    const aspectRatio = 16 / 9;
    // Calculate new canvas width to maintain the aspect ratio based on the current height
    // const newWidth = stageHeight * aspectRatio;

    // // Calculate new video dimensions and position to fit the YouTube format
    // const scale = Math.min(stageHeight / imageHeight, newWidth / imageWidth);
    // const newVideoWidth = imageWidth * scale;
    // const newVideoHeight = imageHeight * scale;
    // const newX = (newWidth - newVideoWidth) / 2;
    // const newY = (stageHeight - newVideoHeight) / 2;

    // Update canvas, video dimensions, and video position
    // console.log(newWidth);
    // setStageDimensions({ width: newWidth, height: stageHeight });
    // setVideoDimensions({ width: newVideoWidth, height: newVideoHeight });
    // setVideoPosition({ x: newX, y: newY });

    // imageDispatch({
    // 	type: "crop",
    // 	payload: {
    // 		width: newVideoWidth,
    // 		height: newVideoHeight,
    // 		x: newX,
    // 		y: newY,
    // 	},
    // });
  };

  const showCrop = () => {
    // imageDispatch({
    // 	type: "set_image_action",
    // 	payload: {
    // 		imageAction: CanvasActions.CROP,
    // 	},
    // });
  };

  const animationRef = useRef(null);
  const layerRef = useRef(null);

  const getRectPosition = () => {
    if (!rectRef.current) return null;
    const rect = rectRef.current;
    // @ts-ignore
    const width =
      // @ts-ignore
      rect.attrs.scaleX !== undefined
        ? // @ts-ignore
          rect.attrs.width * rect.attrs.scaleX
        : // @ts-ignore
          rect.attrs.width;
    // @ts-ignore
    const height =
      // @ts-ignore
      rect.attrs.scaleY !== undefined
        ? // @ts-ignore
          rect.attrs.height * rect.attrs.scaleY
        : // @ts-ignore
          rect.attrs.height;

    return {
      // @ts-ignore
      x: rect.attrs.x,
      // @ts-ignore
      y: rect.attrs.y,
      width,
      height,
    };
  };

  const constrainRect = (pos: Vector2d) => {
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;

    const rect = rectRef.current;
    if (rect) {
      const rectPosition = getRectPosition()!;

      if (pos.x + rectPosition.width > stageDimensions.width) {
        pos.x = stageDimensions.width - rectPosition.width;
      }
      if (pos.y + rectPosition.height > stageDimensions.height) {
        pos.y = stageDimensions.height - rectPosition.height;
      }
    }
    return pos;
  };

  // const getSnapPosition = (
  //   pos: any,
  //   scaledSize: { width: number; height: number }
  // ) => {
  //   const snapThreshold = 5;

  //   // Define potential snap positions based on the scaled size
  //   const snaps = {
  //     top: 0,
  //     bottom: stageHeight - scaledSize.height,
  //     left: 0,
  //     right: stageWidth - scaledSize.width,
  //     centerX: (stageWidth - scaledSize.width) / 2,
  //     centerY: (stageHeight - scaledSize.height) / 2,
  //   };

  //   // Calculate the distance to each snap position
  //   const distances = {
  //     top: Math.abs(pos.y),
  //     bottom: Math.abs(pos.y - snaps.bottom),
  //     left: Math.abs(pos.x),
  //     right: Math.abs(pos.x - snaps.right),
  //     centerX: Math.abs(pos.x + scaledSize.width / 2 - stageWidth / 2),
  //     centerY: Math.abs(pos.y + scaledSize.height / 2 - stageHeight / 2),
  //   };

  //   // Initial new positions are the current positions
  //   let newX = pos.x;
  //   let newY = pos.y;

  //   // Determine the closest snap positions based on these distances
  //   Object.entries(distances).forEach(([key, distance]) => {
  //     if (distance < snapThreshold) {
  //       switch (key) {
  //         case "top":
  //           newY = snaps.top;
  //           break;
  //         case "bottom":
  //           newY = snaps.bottom;
  //           break;
  //         case "left":
  //           newX = snaps.left;
  //           break;
  //         case "right":
  //           newX = snaps.right;
  //           break;
  //         case "centerX":
  //           newX = snaps.centerX;
  //           break;
  //         case "centerY":
  //           newY = snaps.centerY;
  //           break;
  //       }
  //     }
  //   });

  //   return { x: newX, y: newY }; // Return the new position, possibly adjusted for snapping
  // };

  // todo redo / undo make sure it works for resizing

  const loaded = useRef(false);

  // todo dispatch the data to stage dimensions object in canvas props, right now using a default value
  // const setVideoAndStageDimensions = () => {
  // 	if (loaded.current) {
  // 		const videoElement = videoRef.current;
  // 		if (videoElement) {
  // 			const naturalWidth = videoElement.videoWidth;
  // 			const naturalHeight = videoElement.videoHeight;

  // 			imageDispatch({
  // 				type: "set_dimensions",
  // 				payload: {
  // 					width: naturalWidth,
  // 					height: naturalHeight,
  // 				},
  // 			});

  // 			setStageDimensions({
  // 				width: naturalWidth,
  // 				height: naturalHeight,
  // 			});
  // 		}
  // 	}
  // 	loaded.current = true;
  // };

  // timer callback
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  // effect for image transformer
  const trRef = useRef(null);
  useEffect(() => {
    // image transformer
    const transformer = trRef && trRef.current;
    const selectedNode = imageRef && imageRef.current;
    if (transformer && selectedNode) {
      // @ts-ignore
      transformer.nodes([selectedNode]);
      // @ts-ignore
      transformer.getLayer().batchDraw();
    }
    // }
  }, [canvasAction]);

  // effect for crop transformer
  const transformerRef = React.useRef();
  useEffect(() => {
    if (transformerRef && transformerRef.current) {
      // Update the transformer's nodes
      if (rectRef.current) {
        // @ts-ignore
        rectRef.current.scale({ x: 1, y: 1 });
      }
      // @ts-ignore
      transformerRef.current.nodes([rectRef.current]);
      // @ts-ignore
      transformerRef.current.getLayer().batchDraw();
    }
  }, [canvasAction, cropRect]);

  // single click of image
  const handleImageClick = () => {
    if (clickTimeout.current !== null) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    clickTimeout.current = setTimeout(() => {
      if (canvasState.current.canvasAction === CanvasActions.SELECT_IMAGE) {
        dispatch({
          type: CanvasActions.RELEASE_IMAGE,
        });
      } else {
        dispatch({
          type: CanvasActions.SELECT_IMAGE,
        });
      }
    }, 200);
  };

  // redo
  const handleRedo = () => {
    dispatch({ type: CanvasActions.REDO });
  };
  // undo
  const handleUndo = () => {
    dispatch({ type: CanvasActions.UNDO });
  };

  // double click of image
  const toggleCropPanel = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    if (canvasState.current.canvasAction === CanvasActions.SELECT_CROP) {
      dispatch({
        type: CanvasActions.DESELECT_CROP,
      });
    } else {
      dispatch({
        type: CanvasActions.SELECT_CROP,
      });
    }
  };

  const saveCropPanelDimension = () => {
    const rectPos = getRectPosition()!;
    // @ts-ignore
    // rectRef.current.scale({ x: 1, y: 1 });
    dispatch({
      type: CanvasActions.SAVE_CROP_DIMENSION,
      payload: rectPos,
    });
  };

  return (
    <div style={{ background: "white" }}>
      <button onClick={setTikTokFormat}>Set TikTok Format (9:16)</button>
      <button onClick={setYoutubeFormat}>Set Youtube Format (16:9)</button>
      <button onClick={showCrop}>Crop Video</button>
      <button onClick={handleRedo}>redo</button>
      <button onClick={handleUndo}>undo</button>
      <Stage
        id="stage"
        x={stageDimensions.x}
        y={stageDimensions.y}
        width={stageDimensions.width}
        height={stageDimensions.height}
        style={{
          width: stageDimensions.width,
          height: stageDimensions.height,
          background: "red ",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onDblClick={toggleCropPanel}
      >
        <Layer ref={layerRef} id="layer" style={{ background: "black" }}>
          <Group
            // clipX={canvasAction === CanvasActions.SELECT_CROP ? cropRect.x : 0}
            // clipY={canvasAction === CanvasActions.SELECT_CROP ? cropRect.y : 0}
            // clipWidth={
            //   canvasAction === CanvasActions.SELECT_CROP
            //     ? cropRect.width
            //     : stageDimensions.width
            // }
            // clipHeight={
            //   canvasAction === CanvasActions.SELECT_CROP
            //     ? cropRect.height
            //     : stageDimensions.height
            // }
            style={{
              background: "black",
            }}
          >
            <Image
              id="image"
              ref={imageRef}
              // @ts-ignore
              image={image}
              width={imageProps.width}
              height={imageProps.height}
              draggable
              x={imageProps.x}
              y={imageProps.y}
              shadowBlur={1000}
              // onDragEnd={handleDragEnd}
              // onDragMove={handleDragMove}
              // onDragStart={handleDragStart}
              onDblClick={toggleCropPanel}
              onClick={handleImageClick}
              style={{
                background: "black",
              }}
              alt=""
            />
          </Group>

          {canvasAction === CanvasActions.SELECT_IMAGE && (
            <Transformer
              id="resize"
              //@ts-ignore
              ref={trRef}
              rotateEnabled={false}
              flipEnabled={false}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                // limits for resizing
                if (newBox.width < 100 || newBox.height < 100) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
          {canvasAction === CanvasActions.SELECT_CROP && (
            <>
              <Rect
                id="crop"
                x={cropRect.x}
                y={cropRect.y}
                width={cropRect.width}
                height={cropRect.height}
                fill="rgba(255,255,255,0.25)"
                draggable
                onDblClick={toggleCropPanel}
                // @ts-ignore
                ref={rectRef}
                dragBoundFunc={constrainRect}
                onTransformEnd={saveCropPanelDimension}
                onDragEnd={saveCropPanelDimension}
              />
              <Transformer
                // @ts-ignore
                ref={transformerRef}
                rotateEnabled={false}
                flipEnabled={false}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 100 || newBox.height < 100) return oldBox;
                  if (newBox.x < 0 || newBox.y < 0) return oldBox;
                  if (
                    Math.round(newBox.x) + Math.round(newBox.width) >
                    stageDimensions.width
                  )
                    return oldBox;
                  if (
                    Math.round(newBox.y) + Math.round(newBox.height) >
                    stageDimensions.height
                  )
                    return oldBox;
                  return newBox;
                }}
              />
            </>
          )}
        </Layer>
      </Stage>
      <button onClick={confirmCrop}>Confirm Crop</button>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        controls
        // onEnded={() => setPlaying(false)}
        style={
          {
            //   display: "none",
          }
        }
        onCanPlay={() => {
          setVideoLoaded(true);
        }}
        onLoadedData={updateCanvas}
        // onLoadedMetadata={setVideoAndStageDimensions}
      >
        Your browser does not support the video tag.
      </video>
      {/* <button onClick={handleUndo}></button> */}
      {/* <button onClick={handleRedo}></button> */}
    </div>
  );
};

export default VideoController;
