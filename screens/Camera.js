import React from 'react'
import {Button,View,Image,Platform,Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'



export default class Camera extends React.Component{
    
    state={
        image:null,

    }
    getPermissionAsync=async()=>{
        if(Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if(status!=='granted'){
                Alert.alert("We Need Camera Permissions To Go Further.")
            }
        }
      }
    componentDidMount(){
        this.getPermissionAsync()
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        let filename=uri.split("/")[uri.split("/").length-1]
        let type=`image/${uri.split('.')[uri.split('.').length-1]}`
        const fileToUpload={uri:uri,name:filename,type:type}
        data.append("digit",fileToUpload)
        fetch("http://37f0-142-154-101-21.ngrok.io/predict-alphabet",{
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/form-data",
                     },
            })
            .then((response)=>response.json())
            .then((result)=>{console.log("Success: ",result)})
            .catch((error)=>{console.log("Error: ",error)})
    }
    _pickImage(){
      try{
        let result = ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
            
        })
        if(!result.cancelled){
            this.setState({
                image:result.data
                
            })
            console.log(result.uri)
            this.uploadImage(result.uri)
        }
      }
      catch(E){
        console.log(E)
      }
    }
    
    render(){
        let{image}=this.state
        return(
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Button title="Pick An Image From Gallery" onPress={this._pickImage()}>
                    
                    </Button>
            </View>
          
        )
    }
}
