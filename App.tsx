import { useEffect, useRef, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Camera, Orientation, useCameraDevice } from 'react-native-vision-camera';

type PhotoModel = {
    uri: string;
    visionCameraWidth: number;
    visionCameraHeight: number;
    imageWidth: number;
    imageheight: number;
};

export default App = () => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        (async () => {
            const newCameraPermission = await Camera.requestCameraPermission();
            setInit(true);
        })();
    }, []);

    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);

    const [orientation, setOrientation] = useState<Orientation>('portrait');
    const [images, setImages] = useState<PhotoModel[]>([]);

    if (!init) {
        return <></>;
    }
    if (device == null) return <></>;
    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                orientation={orientation}
            />
            <Button
                title="Take photo"
                onPress={async () => {
                    const photoResult = await cameraRef.current?.takePhoto({});
                    if (photoResult) {
                        Image.getSize('file:///' + photoResult?.path, (w, h) => {
                            setImages((prev) => {
                                return [
                                    ...prev,
                                    {
                                        uri: 'file:///' + photoResult.path,
                                        visionCameraWidth: photoResult.width,
                                        visionCameraHeight: photoResult.height,
                                        imageWidth: w,
                                        imageheight: h,
                                    },
                                ];
                            });
                        });
                    }
                }}
            />
            <View style={{ backgroundColor: 'red', height: 30 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Button
                        title="LandLeft"
                        onPress={() => {
                            setOrientation('landscape-left');
                        }}
                    />
                    <Button
                        title="LandRight"
                        onPress={() => {
                            setOrientation('landscape-right');
                        }}
                    />
                    <Button
                        title="Port"
                        onPress={() => {
                            setOrientation('portrait');
                        }}
                    />
                    <Button
                        title="PortDown"
                        onPress={() => {
                            setOrientation('portrait-upside-down');
                        }}
                    />
                </View>
            </View>
            <ScrollView
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    backgroundColor: 'black',
                }}
                horizontal={true}
            >
                {images.map((image, index) => {
                    return (
                        <View key={index} style={{ flex: 1 }}>
                            <Image
                                style={{ flex: 1 }}
                                source={{
                                    uri: image.uri,
                                }}
                                height={200}
                                width={200}
                            />

                            <Text
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 20,
                                    color: 'red',
                                }}
                            >
                                VC: {image.visionCameraWidth}x{image.visionCameraHeight}. RN:{' '}
                                {image.imageWidth}x{image.imageheight}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};
