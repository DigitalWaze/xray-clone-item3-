import React, { Component } from 'react';
import { UploadImage, DeleteImage, getDefaultRates, setDefaults } from '../Firebase';
import FileDrop from "react-file-drop";
import CSVReader from "react-csv-reader";
import {rates} from "./Home";
export default class Upload extends Component {
    constructor() {
        super()
        
        this.state ={            
            email: '',
            password: '',
            rightLateral:'',
            rightMedial:'',
            leftLateral:'',
            leftMedial:'',
            ImageName:'',
            Description:'',
            files: [],
            defaults: {}    
        }
            this.upload = this.upload.bind(this);
            this.handleChange=this.handleChange.bind(this);
            
           
    }

    async componentWillMount(){
        let config = await getDefaultRates();
        this.setState({defaults: config.value});
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
      
    }
    async upload() {
        const {rightLateral,rightMedial,leftLateral,leftMedial,ImageName}=this.state;
       

        var imgs = document.querySelector("#img").files;
        for(var i=0;i<imgs.length;i++){
            await UploadImage(imgs[i],rightMedial,rightLateral,leftLateral,leftMedial,ImageName,false,"");
        }
    }

    handleDrop = (files, event)=>{
        alert(files.length)
        var f = this.state.files || [];
        for(var i=0;i<files.length;i++){
            if (files[i].type==="image/png" || files[i].type==="image/jpg" || files[i].type==="image/jpeg"){
                f.push({file:files[i], isUploading:false, isUploaded:false});
            }
        }
        //f= f.concat(files.map(i=>{ return { file:i,isUploading:false, isUploaded:false} }));
        this.setState({files: f});

        this.uploadHanlder();
    }   

    uploadHanlder = async ()=>{
        let {files} = this.state;        
        let {rightLateral,rightMedial,leftLateral,leftMedial, 
            // defaults
        }=this.state;
        // if(defaults){
        //     rightLateral = defaults.rightLateral || rightLateral;
        //     leftLateral = defaults.leftLateral || leftLateral;
        //     rightMedial = defaults.rightMedial || rightMedial;
        //     leftMedial = defaults.leftMedial || leftMedial;
        // }

        for(var i=0;i<files.length;i++){
            var file = files[i];
            console.log(file.file.type);
            if(file.isUploaded || file.isUploading){

            }
            else {
                file.isUploading = true;
                try{
                    var url = await UploadImage(file.file, rightMedial,rightLateral,leftLateral,leftMedial,file.file.name, false,"");
                    file.url= url.imageUrl;
                    file.key=url.key;
                }catch (err){
                    file.error="Failed to upload file! " +err;
                }
                
                file.isUploaded= true;
                this.setState({files});
            }
            
        }
    }

    handleDefault = async (csv) =>{
        this.setState({process: true});
        try {
            if(csv.length>1){        
                for(var i=1; i<csv.length;i++){     
                    if(csv[i].length===9){
                        var lmRate  = rates.find(d=>d.name === csv[i][5]);
                        var rmRate = rates.find(d=>d.name ===csv[i][4]);
                        var llRate = rates.find(d=>d.name===csv[i][6]);
                        var rlRate = rates.find(d=>d.name ===csv[i][3]);
                        await setDefaults(csv[i][1], lmRate ? lmRate.value : "",
                        rmRate ? rmRate.value : "", llRate ? llRate.value : "", rlRate ? rlRate.value : "");
                    }
                }
            }
        }catch(e){
console.log(e);
        }
        this.setState({process: false});
    }

    render() {
       let {files} = this.state;
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
                    {files.length > 0 && files.map(i=>{
                        if(i.error){
                            return (
                                <div className="w-col w-col-3">
                                    <img src={require("../assets/img/error.png")} alt=""  className="img-xray" key={i.file.name} title={i.error}/>
                                </div>
                            )
                        }
                        else if(i.isUploaded){
                            return (
                                <div className="w-col w-col-3">
                                    <span className="circle-btn" onClick={()=>{
                                        DeleteImage(i.file.name, i.key)
                                        files = files.filter(e=>e.file.name!==i.file.name);
                                        this.setState({files});
                                    }}>X</span>
                                    <img src={i.url} alt="" className="img-xray" key={i.file.name}/>
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
                    {files.length===0 &&  (<h2>1. Drop X-ray files here!</h2>)}

                    <div className="absolute-bottom">
                        <span className="small-title">
                            Or click &nbsp;
                        </span>
                        <button className="button-confirm w-button" onClick={()=>{
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
                            document.getElementById("slCsv").click();
                        }}>Browse</button>
                        <span className="small-title"> &nbsp; to upload CSV</span>
                    </section>)}
                    {this.state.process && (<span className="small-title">Processing CSV...</span>)}
                    <CSVReader cssClass="csv-reader-input" label=""
                        onFileLoaded={this.handleDefault} onError={()=>{console.log("error")}}
                        inputId="slCsv" />                   
                    
                </div>
                </div>
                
            </section>
        )
    }
}