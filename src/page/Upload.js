import React, { Component } from 'react';
import {uploadObject, UploadImage, DeleteImage, getDefaultRates, setDefaults ,setPelvisDefaults , setRightFrogDefaults , setLeftFrogDefaults} from '../Firebase';
import FileDrop from "react-file-drop";
import CSVReader from "react-csv-reader";
import {rates} from "./Home";

let fileLength=0;
let afterUpload=[];
let removeMe=[];
let UniImagesObject={};
let upload=true;
// let beforeUpload=[];
export default class Upload extends Component {
    constructor() {
        super()
        
        this.state ={            
           
            defaults: {},
            images:[],
            upload:true,
           
        }
            this.handleChange=this.handleChange.bind(this);
            
           
    }

    async componentWillMount(){
        fileLength=0;
        afterUpload=[];
        removeMe=[];
        UniImagesObject={};
        upload=true;

        // beforeUpload=[];
        let config = await getDefaultRates();
        this.setState({defaults: config.value});
      
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
      
    }
    

    handleDrop = (files, event)=>{

        if(this.state.upload===false)
        {
            console.log('uploading in process')
            return;
        }

        fileLength=fileLength+files.length;

        console.log(files.length)

        var images=this.state.images||[];
        for(var i=0;i<files.length;i++){
            if (files[i].type==="image/png" || files[i].type==="image/jpg" || files[i].type==="image/jpeg"){
                console.log('here')

                var reader = new FileReader();
                let file=files[i]
                
                reader.onload = (e) => this.pushImage(e,file,images)

            reader.readAsDataURL(files[i]);
                
            }
        }
        
    }
    
    pushImage = (e,file,images) =>
    {
        
        console.log(file)
        images.push({name:file.name, src:e.target.result ,isUploading:false,file:file});

        if(images.length===fileLength)
        {
            this.setState({images}); 
            console.log('uploaded')
        }
    }

    uploadHanlder = async ()=>{
        if(this.state.images.length===0)
        {
            alert('Please upload file(s) first!')
            return;
        }

        this.setState({upload:false})

       

        if(upload===false)
        {
            console.log('uploading in process')
            return;
        }
        afterUpload=this.state.images;
        // beforeUpload=this.state.images;       
        
        upload=false;
        

        const global=this;
        for(let i=0;i<afterUpload.length;i++)
        {
            let file = afterUpload[i];
            if(file.isUploading){
              
            }
            else {

                let refnum = parseInt(file.name);
                console.log(refnum)
                UniImagesObject[refnum]={RefNum:refnum,HipImage:{},userName:"Not Evaluated",LeftHipImage:{},RightHipImage:{},LeftFrogImage:{},RightFrogImage:{},Hip:false,LeftFrog:false,RightFrog:false,createdOn: (new Date()).toJSON(),backImage:"",nextImage:"",isEvaluated:false, evaluator: "",status: 1 ,leftStatus:1,rightStatus:1,isError:'',comment:''};
                console.log(UniImagesObject);
               
                
                
                for(let j=0;j<afterUpload.length;j++)
                {
                    if(afterUpload[j].isUploading){

                    }

                    
                    // let ImagesObject=UniImagesObject[refnum];
                    else if(parseInt(afterUpload[j].name)===refnum)
                    {
                        afterUpload[j].isUploading = true;
                        UploadImage(afterUpload[j].file)
                        .then( (url) => {
                      
                            // if(afterUpload[j].name.match(/ Left Pelvis/gi)!=null)
                            // {
                            //     UniImagesObject[refnum].LeftHip=true;
                            //     UniImagesObject[refnum].LeftHipImage={imageUrl:'',zone1:'', zone2:'',zone3:'',imageName:''};
                            //     UniImagesObject[refnum].LeftHipImage.imageUrl=url;
                            //     UniImagesObject[refnum].LeftHipImage.ImageName=afterUpload[j].name;   
                            // }

                            if(afterUpload[j].name.match(/Pelvis/gi)!=null)
                            {
                                UniImagesObject[refnum].Hip=true;
                                UniImagesObject[refnum].HipImage={imageUrl:'',ImageName:''};
                                UniImagesObject[refnum].LeftHipImage={zone1:'', zone2:'',zone3:''};
                                UniImagesObject[refnum].RightHipImage={zone1:'', zone2:'',zone3:''};

                                UniImagesObject[refnum].HipImage.imageUrl=url;
                                UniImagesObject[refnum].HipImage.ImageName=afterUpload[j].name;   
                            }

                            // else if(afterUpload[j].name.match(/Right Pelvis/gi)!=null)
                            // {
                            //     UniImagesObject[refnum].RightHip=true;
                            //     UniImagesObject[refnum].RightHipImage={imageUrl:'',zone1:'', zone2:'',zone3:'',imageName:''};
                            //     UniImagesObject[refnum].RightHipImage.imageUrl=url;
                            //     UniImagesObject[refnum].RightHipImage.ImageName=afterUpload[j].name;
                            // }

                            else if(afterUpload[j].name.match(/Left Frog/gi)!=null)
                            {     
                                UniImagesObject[refnum].LeftFrog=true;
                                UniImagesObject[refnum].LeftFrogImage={comment:'',imageUrl:'',zone1:'', zone2:'',zone3:'',ImageName:''};
                                UniImagesObject[refnum].LeftFrogImage.imageUrl=url;
                                UniImagesObject[refnum].LeftFrogImage.ImageName=afterUpload[j].name;  
                            }

                            else if(afterUpload[j].name.match(/Right Frog/gi)!=null)
                            {                         
                                UniImagesObject[refnum].RightFrog=true;
                                UniImagesObject[refnum].RightFrogImage={comment:'',imageUrl:'',zone1:'', zone2:'',zone3:'',ImageName:''};
                                UniImagesObject[refnum].RightFrogImage.imageUrl=url;
                                UniImagesObject[refnum].RightFrogImage.ImageName=afterUpload[j].name;   
                            }
                        
                            else
                            {
                                console.log(file.name+' file type/name match error')
                            }

                            let {images} = this.state;
                            images= images.filter(e=>e.name!==afterUpload[j].name);
                            fileLength=fileLength-1;
                            global.setState({images});
                            

                            if(images.length==0)
                            {
                                global.uploadImagesObject();
                            }
                        })

                        .catch((err)=>{
                            console.log(err)
                            afterUpload[j].error="Failed to upload file! " +err;

                            let {images} = this.state;
                            images= images.filter(e=>e.name!==afterUpload[j].name);
                            fileLength=fileLength-1;
                            global.setState({images});
                            if(images.length==0)
                            {
                                global.uploadImagesObject();
                            }
                            
                        })

                        // this.setState({images:afterUpload});
                    }
                            
                }
                // this.setState({images:afterUpload});

            }
            
        }


        for(let k=0;k<removeMe.length;k++)
        {
            afterUpload = afterUpload.filter(e=>e.name!==removeMe[k]);
            fileLength = fileLength-1;
        }
        this.setState({images:afterUpload});
    }

    uploadImagesObject = () =>
    {

        console.log(UniImagesObject);
        // UniImagesObject.forEach((obj,id)=>console.log(obj))
        for (let [key, value] of Object.entries(UniImagesObject)) {
            // if(value.LeftFrog==false && value.RightFrog==false && value.LeftHip==false && value.RightHip==false)
            if(value.LeftFrog==false && value.RightFrog==false && value.Hip==false)
            {
                alert('No Relevant Image Found at ref: '+ value.RefNum + ' or Patient Data already Exist' )
            }
            else uploadObject(value);
        }
        fileLength=0;
        afterUpload=[];
        removeMe=[];
        UniImagesObject={};
        upload=true;
        this.setState({images:[],upload:true})
    }
    handleDefault = async (csv) =>{
        this.setState({process: true});
        try {
            if(csv.length>1){        
                for(var i=1; i<csv.length;i++){     
                   
                
                    if(csv[i].length===17){
                        var refnum=parseInt(csv[i][1])
                        if(csv[i][1].match(/Pelvis/gi)!=null)
                        {
                            var leftZone1=rates.find(d=>d.name === csv[i][6]);
                            var leftZone2=rates.find(d=>d.name === csv[i][7]);
                            var leftZone3=rates.find(d=>d.name === csv[i][8]);

                            var rightZone1=rates.find(d=>d.name === csv[i][3]);
                            var rightZone2=rates.find(d=>d.name === csv[i][4]);
                            var rightZone3=rates.find(d=>d.name === csv[i][5]);
                            
                           

                             await setPelvisDefaults(refnum, leftZone1 ? leftZone1.value : "",
                        leftZone2 ? leftZone2.value : "", leftZone3 ? leftZone3.value : "",
                        rightZone1 ? rightZone1.value : "",
                        rightZone2 ? rightZone2.value : "", rightZone3 ? rightZone3.value : "");


                        }

                        else if(csv[i][1].match(/Left Frog/gi)!=null)
                        {
                            var zone1=rates.find(d=>d.name === csv[i][12]);
                            var zone2=rates.find(d=>d.name === csv[i][13]);
                            var zone3=rates.find(d=>d.name === csv[i][14]);

                            await setLeftFrogDefaults(refnum, zone1 ? zone1.value : "",
                        zone2 ? zone2.value : "", zone3 ? zone3.value : "",);
                        }

                        else if(csv[i][1].match(/Right Frog/gi)!=null)
                        {
                            var zone1=rates.find(d=>d.name === csv[i][12]);
                            var zone2=rates.find(d=>d.name === csv[i][13]);
                            var zone3=rates.find(d=>d.name === csv[i][14]);

                            await setRightFrogDefaults(refnum, zone1 ? zone1.value : "",
                        zone2 ? zone2.value : "", zone3 ? zone3.value : "",);
                        }
                        // var lmRate  = rates.find(d=>d.name === csv[i][5]);
                        // var rmRate = rates.find(d=>d.name ===csv[i][4]);
                        // var llRate = rates.find(d=>d.name===csv[i][6]);
                        // var rlRate = rates.find(d=>d.name ===csv[i][3]);
                        // await setDefaults(refnum, lmRate ? lmRate.value : "",
                        // rmRate ? rmRate.value : "", rlRate ? rlRate.value : "");
                    }
                }
            }
        }catch(e){
console.log(e);
        }
        this.setState({process: false});
    }

    render() {
       let {images} = this.state;
        return (
            <section>
                <div className="w-row">
                <div className="column-5 w-col w-col-12">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Home");
                    }}> Start Evaluation</button>                    
                </div>  
                </div>
                <div className="w-row">
                <div id="react-file-drop-demo" className="drop-zone">                   
                    <FileDrop onDrop={this.handleDrop}>
                    {images.length > 0 && images.map( (i,key)=>{
                        if(i.error){
                            return (
                                <div className="w-col w-col-3">
                                    <img src={require("../assets/img/error.png")} alt=""  className="img-xray" key={i.file.name} title={i.error}/>
                                </div>
                            )
                        }
                        else if(!i.isUploading)
                        {
                            return (
                                <div className="w-col w-col-3">
                                    
                                    <span className="circle-btn" onClick={()=>{
                                        images = images.filter(e=>e.name!==i.name);
                                       
                                        fileLength=fileLength-1;
                                        
                                        this.setState({images});
                                    }}>X</span>
                                    <img src={i.src} alt="" className="img-xray" />
                                </div>)
                        }
                        
                        else if(i.isUploading){
                            return (
                                <div className="w-col w-col-3">
                                    <img src={require("../assets/img/giphy.gif")} alt=""  className="img-xray" key={i.file.name}/>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="w-col w-col-3">
                                    <img src={require("../assets/img/giphy.gif")} alt=""  className="img-xray blur" key={i.file.name}/>
                                </div>
                            );

                        }
                    })}
                    {images.length===0 &&  (<h2>1. Drop X-ray files here!</h2>)}

                    <div className="absolute-bottom">
                        <span className="small-title">
                            Or click &nbsp;
                        </span>
                        <button className="button-confirm w-button" onClick={()=>{
                            if(upload==false)
                            {
                                console.log('uploading in process')
                                return;
                            }
                            document.getElementById("slFile").click();
                        }}>Browse</button>                 
                        <span className="small-title"> &nbsp; to select X-ray files</span>
                        <input type="file" id="slFile"  className="button-confirm hide" accept=".png,.jpg,.jpeg" multiple={true}
                        onChange={(e)=>{
                            this.handleDrop(e.target.files, e);
                        }}/>
                    </div>
                    </FileDrop>                     
                </div>               
                </div>
                <div className="w-row">
                {/* <div className="column-5 w-col w-col-6">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Home");
                    }}> Home</button>                    
                </div>     */}
                <div className="column-5 w-col w-col-12">
                    {!this.state.process && (<section>
                        <span className="small-title">2. Click &nbsp;</span>
                        <button className="button-confirm w-button" onClick={()=>{
                             if(upload==false)
                             {
                                console.log('uploading in process')
                                return;
                             }
                            document.getElementById("slCsv").click();
                        }}>Browse</button>
                        <span className="small-title"> &nbsp; to upload CSV</span>
                        {this.state.process && (<span className="small-title">Processing CSV...</span>)}
                        <span style={{float:'right'}}>
                             <button className="button-confirm w-button" style={{opacity:this.state.upload?'1':'0.5'}} onClick={this.uploadHanlder} >Upload</button>
                        </span>
                    </section>)}
                    {this.state.process && (<span className="small-title">Processing CSV...</span>)}
                    <CSVReader cssClass="csv-reader-input" label=""
                        onFileLoaded={this.handleDefault} onError={()=>{console.log("error")}}
                        inputId="slCsv" />      
                                     
                    
                </div>
                
                   

                <div>

                </div>
                </div>
                
            </section>
        )
    }
}