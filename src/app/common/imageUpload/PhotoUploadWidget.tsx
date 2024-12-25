import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {

    // Add State for displaying the image after uploading
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper){
            // Convert the image to a blob and then add the upload the image
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview)); 
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Add Photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>

            <Grid.Column />

            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 2 - Resize Image" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>

            <Grid.Column />

            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Preiview & Upload" />
                {files && files.length > 0 && (
                    <>
                        <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}} />
                        
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon='check'/>
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close'/>
                        </Button.Group>
                        
                    </>
                )}
                
            </Grid.Column>
        </Grid>
    )
}