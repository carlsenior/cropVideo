// hard coded src for example
const src =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

import { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Image, Transformer, Group, Rect } from "react-konva";
import Konva from "konva";
import useKonvaContext from "./useKonvaContext";
import { CanvasActions } from "./store/actions";
import { Vector2d } from "konva/lib/types";

const VideoController = () => {
  const { canvasState, dispatch } = useKonvaContext();

  const {
    current: { imageProps, cropRect, stageDimensions, imageCrop, canvasAction },
    undoStack,
    redoStack,
    keepRatio,
  } = canvasState;

  const [image, setImage] = useState<Konva.Image | undefined>(undefined);
  const imageRef = useRef<Konva.Image>(null);
  const videoRef = useRef(null);
  const rectRef = useRef();
  const animationRef = useRef(null);
  const layerRef = useRef(null);
  const trRef = useRef(null);
  const transformerRef = useRef();

  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // called at the first loading of the video component
  const setVideoDimensions = () => {
    dispatch({
      type: CanvasActions.SET_IMAGE_CROP,
      payload: {
        x: 0,
        y: 0,
        // @ts-ignore
        width: videoRef.current.videoWidth,
        // @ts-ignore
        height: videoRef.current.videoHeight,
      },
    });
  };

  // effect for key event for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z") {
          dispatch({
            type: CanvasActions.UNDO,
          });
        } else if (event.key === "y") {
          dispatch({
            type: CanvasActions.REDO,
          });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // most important - main canvas drawing
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

  // helper function to get actual position of konva shape node
  const getNodePosition = (node: any) => {
    if (!node) return null;
    // @ts-ignore
    const width =
      // @ts-ignore
      node.attrs.scaleX !== undefined
        ? // @ts-ignore
          node.attrs.width * node.attrs.scaleX
        : // @ts-ignore
          node.attrs.width;
    // @ts-ignore
    const height =
      // @ts-ignore
      node.attrs.scaleY !== undefined
        ? // @ts-ignore
          node.attrs.height * node.attrs.scaleY
        : // @ts-ignore
          node.attrs.height;

    return {
      // @ts-ignore
      x: node.attrs.x,
      // @ts-ignore
      y: node.attrs.y,
      width,
      height,
    };
  };

  // constrain transform and moving of node
  const constrainNode = (pos: Vector2d, that: string) => {
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;

    const node = that === "rect" ? rectRef.current : imageRef.current;
    if (node) {
      const nodePosition = getNodePosition(node)!;

      if (pos.x + nodePosition.width > stageDimensions.width) {
        pos.x = stageDimensions.width - nodePosition.width;
      }
      if (pos.y + nodePosition.height > stageDimensions.height) {
        pos.y = stageDimensions.height - nodePosition.height;
      }
    }
    return pos;
  };

  // timer callback - called once at first loading
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  // effect for image transformer
  useEffect(() => {
    // image transformer
    const transformer = trRef && trRef.current;
    const imageNode = imageRef && imageRef.current;

    if (imageNode) {
      imageNode.scale({ x: 1, y: 1 });
      imageNode.crop(imageCrop);
    }

    if (transformer && imageNode) {
      // @ts-ignore
      transformer.nodes([imageNode]);
      // @ts-ignore
      transformer.getLayer().batchDraw();
    }
    // }
  }, [canvasAction, imageCrop, imageProps]);

  // effect for crop transformer
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

  // toggle showing of image Rect
  const toggleImagePanel = () => {
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

  // toggle showing of crop Rect
  const toggleCropPanel = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    clickTimeout.current = setTimeout(() => {
      if (canvasState.current.canvasAction === CanvasActions.SELECT_CROP) {
        dispatch({
          type: CanvasActions.DESELECT_CROP,
        });
      } else {
        dispatch({
          type: CanvasActions.SELECT_CROP,
        });
      }
    }, 200);
  };

  // save crop dimension for undo/redo
  const saveCropPanelDimension = () => {
    const rectPos = getNodePosition(rectRef.current)!;
    if (
      cropRect.x === Math.round(rectPos.x) &&
      cropRect.y === Math.round(rectPos.y) &&
      cropRect.width === Math.round(rectPos.width) &&
      cropRect.height === Math.round(rectPos.height)
    )
      return;
    dispatch({
      type: CanvasActions.SAVE_CROP_DIMENSION,
      payload: rectPos,
    });
  };

  // save image dimension for undo/redo
  const saveImageDimension = () => {
    const imagePos = getNodePosition(imageRef.current)!;
    if (
      imageProps.x === Math.round(imagePos.x) &&
      imageProps.y === Math.round(imagePos.y) &&
      imageProps.width === Math.round(imagePos.width) &&
      imageProps.height === Math.round(imagePos.height)
    )
      return;
    dispatch({
      type: CanvasActions.SAVE_IMAGE_DIMENSION,
      payload: imagePos,
    });
  };

  // process crop action
  const activateCrop = () => {
    dispatch({
      type: CanvasActions.CROP,
    });
  };

  return (
    <div style={{ background: "white" }}>
      <button
        onClick={() => dispatch({ type: CanvasActions.SET_TIKTOK_FORMAT })}
      >
        Set TikTok Format (9:16)
      </button>
      <button
        onClick={() => dispatch({ type: CanvasActions.SET_YOUTUBE_FORMAT })}
      >
        Set Youtube Format (16:9)
      </button>
      <button
        onClick={activateCrop}
        disabled={
          canvasAction !== CanvasActions.SELECT_CROP &&
          canvasAction !== CanvasActions.CROP
        }
      >
        Crop Video
      </button>
      <button
        onClick={() => dispatch({ type: CanvasActions.REDO })}
        disabled={redoStack.length === 0}
      >
        redo
      </button>
      <button
        onClick={() => dispatch({ type: CanvasActions.UNDO })}
        disabled={undoStack.length === 1}
      >
        undo
      </button>
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
        <Layer ref={layerRef} id="layer">
          <Image
            id="image"
            ref={imageRef}
            // @ts-ignore
            image={image}
            x={imageProps.x}
            y={imageProps.y}
            width={imageProps.width}
            height={imageProps.height}
            // shadowBlur={1000}
            draggable={canvasAction === CanvasActions.SELECT_IMAGE}
            onDblClick={toggleCropPanel}
            onClick={toggleImagePanel}
            onDragEnd={saveImageDimension}
            onTransformEnd={saveImageDimension}
            dragBoundFunc={(pos) => constrainNode(pos, "image")}
            style={{
              background: "black",
            }}
            alt=""
          />

          {canvasAction === CanvasActions.SELECT_IMAGE && (
            <Transformer
              id="resize"
              //@ts-ignore
              ref={trRef}
              rotateEnabled={false}
              flipEnabled={false}
              keepRatio={keepRatio}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                // limits for resizing
                if (
                  newBox.width < imageProps.restrict ||
                  newBox.height < imageProps.restrict
                )
                  return oldBox;
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
          )}
          {canvasAction === CanvasActions.SELECT_CROP && (
            <>
              <Rect
                id="crop"
                // @ts-ignore
                ref={rectRef}
                x={cropRect.x}
                y={cropRect.y}
                width={cropRect.width}
                height={cropRect.height}
                fill="rgba(255,255,255,0.25)"
                draggable
                onDblClick={toggleCropPanel}
                dragBoundFunc={(pos) => constrainNode(pos, "rect")}
                onTransformEnd={saveCropPanelDimension}
                onDragEnd={saveCropPanelDimension}
              />
              <Transformer
                // @ts-ignore
                ref={transformerRef}
                rotateEnabled={false}
                flipEnabled={false}
                keepRatio={keepRatio}
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (
                    newBox.width < cropRect.restrict ||
                    newBox.height < cropRect.restrict
                  )
                    return oldBox;
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
      <button onClick={() => dispatch({ type: CanvasActions.CONFIRM_CROP })}>
        Confirm Crop
      </button>
      <br />
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
        onLoadedMetadata={setVideoDimensions}
      >
        Your browser does not support the video tag.
      </video>
      {/* <button onClick={handleUndo}></button> */}
      {/* <button onClick={handleRedo}></button> */}
    </div>
  );
};

export default VideoController;
