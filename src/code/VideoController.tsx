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
    current: { imageProps, cropRect, stageDimensions, canvasAction },
    undoStack,
    redoStack,
  } = canvasState;

  const [image, setImage] = useState<Konva.Image | undefined>(undefined);
  const imageRef = useRef<Konva.Image>(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const layerRef = useRef(null);
  const trRef = useRef(null);
  const transformerRef = useRef();

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

  const rectRef = useRef();

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
    dispatch({
      type: CanvasActions.SET_TIKTOK_FORMAT,
    });
  };

  const setYoutubeFormat = () => {
    dispatch({
      type: CanvasActions.SET_YOUTUBE_FORMAT,
    });
  };

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

  useEffect(() => {
    // image transformer
    const transformer = trRef && trRef.current;
    const selectedNode = imageRef && imageRef.current;

    if (selectedNode) {
      selectedNode.scale({ x: 1, y: 1 });
    }

    if (transformer && selectedNode) {
      // @ts-ignore
      transformer.nodes([selectedNode]);
      // @ts-ignore
      transformer.getLayer().batchDraw();
    }
    // }
  }, [canvasAction, imageProps]);

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

  // single click of image
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

  const showCrop = () => {
    dispatch({
      type: CanvasActions.CROP,
    });
  };

  return (
    <div style={{ background: "white" }}>
      <button onClick={setTikTokFormat}>Set TikTok Format (9:16)</button>
      <button onClick={setYoutubeFormat}>Set Youtube Format (16:9)</button>
      <button
        onClick={showCrop}
        disabled={
          canvasAction !== CanvasActions.SELECT_CROP &&
          canvasAction !== CanvasActions.CROP
        }
      >
        Crop Video
      </button>
      <button onClick={handleRedo} disabled={redoStack.length === 0}>
        redo
      </button>
      <button onClick={handleUndo} disabled={undoStack.length === 1}>
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
          <Group
            // clipX={actualCropedRect.x ?? 0}
            // clipY={actualCropedRect.y ?? 0}
            // clipWidth={actualCropedRect.width ?? stageDimensions.width}
            // clipHeight={actualCropedRect.height ?? stageDimensions.height}
            style={{
              background: "black",
            }}
          >
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
                x={cropRect.x}
                y={cropRect.y}
                width={cropRect.width}
                height={cropRect.height}
                fill="rgba(255,255,255,0.25)"
                draggable
                onDblClick={toggleCropPanel}
                // @ts-ignore
                ref={rectRef}
                dragBoundFunc={(pos) => constrainNode(pos, "rect")}
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
