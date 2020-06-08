import React, {Component} from "react";
import { CheckBox } from "../component/CheckBox";
import {Note} from "../component/Note";
import { getMyImage, getNewImage, saveImage, getImage, DeleteImage , DeleteCurrentImage } from "../Firebase";
import {Loader} from "../component/Loader";
import Zoom from "../component/Zoom";
import LeftZone from '../assets/Left Hip.png'
import RightZone from '../assets/Right Hip.png'


export const rates = [{name: "Normal/Slight", value: 1},
                    {name: "Moderate", value: 2},
                    {name: "NES", value: 3},
                    {name: "End Stage", value: 4},
                    {name: "Replaced", value: 5}];

export default class Home extends Component{

    constructor(props){
        super(props);
        this.state={
            addNote:false,
            xray: { key:"", value:{}},
            isLoading: true,
            rightButton:false,
            leftButton:false,
            leftSide:false,
            rightSide:false,
            activeSide:null,
            left:true,
            FrogEval:true,
            EvalType:'Hip',
            
        }
    }

    async componentDidMount(){

        

        let xray = await getMyImage();
        if(xray == null || xray.value == null){
            console.log('old null')
            var oldkey = localStorage.getItem("oldKey") || "";
            xray =  await getNewImage(oldkey);
            if(xray && xray.value && !xray.value.backImage){
                xray.value.backImage = oldkey;
            }
        }

        if(xray && xray.value ){

            let activeSide=null;
            let left=null;
            let FrogEval=false;
            let EvalType="Hip";


            if(xray.value.rightStatus==1)
            {
                activeSide="Right"
                left=false;
                if(xray.value.RightFrog==true)
                {
                    FrogEval=true;
                }
            }

            else if (xray.value.leftStatus==1)
            {
                activeSide="Left"
                left=false;
                if(xray.value.LeftFrog==true)
                {
                    FrogEval=true;
                }
            }
           

            this.setState({xray,isLoading:false,activeSide,FrogEval,left,EvalType});
           
        }
        
        else{
            this.setState({xray,isLoading:false});
        }

    }

    delete = async () =>{
        if(window.confirm("Are you sure you want to delete this?")){
            this.setState({isLoading:true});
            let {xray} = this.state;
            localStorage.setItem("oldKey", xray.value.backImage);

            await this.deleteAllImages();
            await DeleteCurrentImage(xray.key);
            xray =  await getNewImage(xray.value.backImage);
            if(xray && xray.value){
                let FrogEval=true;
                let EvalType="Hip";
                let activeSide="";
                let left=null;

                if(xray.value.LeftFrog || xray.value.RightFrog)
                FrogEval=false;

                if(xray.value.Hip)
                {
                    activeSide="RightHipImage"
                    left=false;
                }

                this.setState({xray,isLoading:false,EvalType,leftSide:xray.value.Hip,rightSide:xray.value.Hip,activeSide,FrogEval,left});
            }
            else {
                this.setState({addNote:false,xray,isLoading: false,rightButton:false,leftButton:false,leftSide:false,rightSide:false,activeSide:null,left:false,FrogEval:true,EvalType:'Hip',})
            }
            
            
        }
    }

    // deleteAllImages = () =>
    // {
    //     let true1=false;
    //     let true2=false;
    //     let true3=false;
    //     // let true4=false;
    //     let {xray}=this.state
    //     if(xray.value.LeftFrog===true)
    //     {
    //         DeleteImage(xray.value.LeftFrogImage.ImageName).then(()=>{true1=true
    //             if(true1==true&&true2==true&&true3==true)
    //             {
    //                 return true;
    //             }
    //         })
    //     }
    //     else
    //     {
    //         true1=true
    //     }
    //     if(xray.value.RightFrog===true)
    //     {
    //         DeleteImage(xray.value.RightFrogImage.ImageName).then(()=>{true2=true
    //             if(true1==true&&true2==true&&true3==true)
    //             {
    //                 return true;
    //             }
    //         })
    //     }
    //     else
    //     {
    //         true2=true
    //     }
    //     if(xray.value.Hip===true)
    //     {
    //         DeleteImage(xray.value.HipImage.ImageName).then(()=>{true3=true
    //             if(true1==true&&true2==true&&true3==true)
    //                     {
    //                         return true;
    //                     }
    //         })
    //     }
    //     else
    //     {
    //         true3=true
    //     }
        
    // }

    handleCheck = (checked, field, value) =>{
        let {xray} = this.state;
        if(xray.value[this.state.activeSide].zone1==5)
        {
            xray.value[this.state.activeSide].zone1=""
            xray.value[this.state.activeSide].zone2=""
            xray.value[this.state.activeSide].zone3=""
        }

        xray.value[this.state.activeSide][field]= checked ?  value : null;
        this.setState({xray});
    }

    handleCheckAll = (checked, value) =>{
        let {xray} = this.state;
        xray.value[this.state.activeSide].zone1= checked ?  value : null;
        xray.value[this.state.activeSide].zone2= checked ?  value : null;
        xray.value[this.state.activeSide].zone3= checked ?  value : null;
        this.setState({xray});
    }

    nextImage = async ()=>{
        let {xray} = this.state;

        await this.saveChanges();
        if(xray && xray.value && xray.value.nextImage){
            console.log('nextImage')
            xray = await getImage(xray.value.nextImage);           
        }
        else {
            console.log('newImage')
            xray = await getNewImage(xray.key);
            if(xray && xray.value){
                xray.value.backImage =localStorage.getItem("oldKey");
            }
        }

        if(xray && xray.value){
            let FrogEval=true;
            let activeSide="";
            let left=null;
            let EvalType="Hip";

            if(xray.value.LeftFrog || xray.value.RightFrog)
            FrogEval=false;

            if(xray.value.Hip)
            {
                activeSide="RightHipImage"
                left=false;
            }

            xray.value.backImage =localStorage.getItem("oldKey");
            this.setState({xray,isLoading:false,EvalType,leftSide:xray.value.Hip,rightSide:xray.value.Hip,activeSide,FrogEval,left});
        }
        else {
            this.setState({addNote:false,xray,isLoading: false,rightButton:false,leftButton:false,leftSide:false,rightSide:false,activeSide:null,left:false,FrogEval:true,EvalType:'Hip',})
        }
    }

    nextImageAfterDeleted = async (xray)=>{

        if(xray && xray.value && xray.value.nextImage){
            console.log('nextImageAfterDeleted')
            xray = await getImage(xray.value.nextImage);           
        }
        else {
            console.log('noNewImageAfterDELETED')
            xray=null;
        }

        if(xray && xray.value){
            let FrogEval=true;
            let activeSide="";
            let left=null;
            let EvalType="Hip";

            if(xray.value.LeftFrog || xray.value.RightFrog)
            FrogEval=false;

            if(xray.value.Hip)
            {
                activeSide="RightHipImage"
                left=false;
            }

            xray.value.backImage =localStorage.getItem("oldKey");
            this.setState({xray,isLoading:false,EvalType,leftSide:xray.value.Hip,rightSide:xray.value.Hip,activeSide,FrogEval,left});
        }
        else {
            this.setState({addNote:false,xray,isLoading: false,rightButton:false,leftButton:false,leftSide:false,rightSide:false,activeSide:null,left:false,FrogEval:true,EvalType:'Hip',})
        }
    }

    FrogView = () =>
    {
        let {xray} = this.state;
        let activeSide="";
        let left=null;

        if(xray.value.RightFrog===true )
        {
            left=false
            activeSide="RightFrogImage"
        }
           
        else if(xray.value.LeftFrog===true )
        {
            activeSide="LeftFrogImage";
            left=true
        }

        this.setState({FrogEval:true,activeSide,left,leftSide:xray.value.LeftFrog,rightSide:xray.value.RightFrog,EvalType:'Frog'})
    }

    saveChanges= async ()=>{
        let {xray} = this.state;
        // xray.value.rightLateral = xray.value.rightLateral || xray.value.d_rightLateral;
        // xray.value.leftLateral = xray.value.leftLateral || xray.value.d_leftLateral;
        // xray.value.rightMedial = xray.value.rightMedial || xray.value.d_rightMedial;
        // xray.value.leftMedial = xray.value.leftMedial || xray.value.d_leftMedial;
        if(xray.value.isError && xray.value.comment==="")
        {
            alert('Please add note about error');
        }

        else {
            this.setState({isLoading:true});
            localStorage.setItem("oldKey", xray.key);
            
            xray.value.isEvaluated=true;
            xray.value.status =3;
            xray.value.evaluatedOn = (new Date()).toJSON();
            await saveImage(xray.key, xray.value);
            

            this.setState({isLoading:false});
        }
        
    }

    prevImage = async ()=>{
        console.log('PrevImage Called')
        let {xray} = this.state;
        let oldKey=xray.key;
        console.log(oldKey);
        await this.saveChanges();
        if(xray && xray.value && xray.value.backImage){
            xray = await getImage(xray.value.backImage);
        }
        else xray=null;

        if(xray && xray.value){
            console.log('Has previous')

            if(xray.value.Hip)
            {
            let FrogEval=true;
            let activeSide="";
            let left=null;
            let EvalType="Hip";

            if(xray.value.LeftFrog || xray.value.RightFrog)
            FrogEval=false;

            if(xray.value.Hip)
            {
                activeSide="RightHipImage"
                left=false;
            }


            this.setState({xray,isLoading:false,EvalType,leftSide:xray.value.Hip,rightSide:xray.value.Hip,activeSide,FrogEval,left});
        }

        else
        {
            console.log('Image Deleted')
            if(oldKey===xray.value.nextImage)
            {
                alert('No Back Image Found');
            }
            this.nextImageAfterDeleted(xray);

        }
    }
        else {
            this.setState({addNote:false,xray:null,isLoading: false,rightButton:false,leftButton:false,leftSide:false,rightSide:false,activeSide:null,left:false,FrogEval:true,EvalType:'Hip',})
        }
   



    }
    rightHip =()=>{
        if(this.state.EvalType==="Hip")
        {
            if(this.state.xray.value.Hip)
            this.setState({
                left:false,
                activeSide:'RightHipImage'
            })
           else alert('Right Hip Does Not Exist')
        }

        if(this.state.EvalType==="Frog")
        {
            if(this.state.xray.value.RightFrog)
            this.setState({
                left:false,
                activeSide:'RightFrogImage'
            })
           else alert('Right Frog Does Not Exist')
        }
    }

    leftHip =()=>{
        if(this.state.EvalType==="Hip")
        {    if(this.state.xray.value.Hip)
            {
                this.setState({
                    left:true,
                    activeSide:'LeftHipImage'
                })
            }

            else alert('Left Hip Does Not Exist')
        }
        else if(this.state.EvalType==="Frog")
        {    if(this.state.xray.value.LeftFrog)
            {
                this.setState({
                    left:true,
                    activeSide:'LeftFrogImage'
                })
            }

           else alert('Left Frog Does Not Exist')
        }
        
    }
    render (){
        let {xray, isLoading} = this.state;
        const lB = this.state.left;
        if(xray==null || xray.value==null){
            return (
                <section>
                     {this.props.isAdmin && (
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
                    <h2>No Data Found</h2>
                </section>
            );
        }

        return (
        
        <section>
           
            {/* {this.props.isAdmin && (<div className="w-row">
                <div className="column-5 w-col w-col-12">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }}> Upload</button>
                </div>
            </div>)} */}

            {this.props.isAdmin && (
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
            <div className="columns-6 w-row">
                <div className="column-right-padding w-col w-col-7">
                    <h3 className="heading-4">SBS X-ray Review</h3>
                </div>
                <div className="w-col w-col-5">
                    <p className="small-paragraph">Patient Reference Number: {xray.value.RefNum}</p>
                </div>
            </div>
            {
                isLoading?
                <Loader loading={isLoading}/>
            :
                <div>
                    <div className="columns-2 w-row">

                    {
                    this.state.activeSide=='Right'?
                        <img src={RightZone}  alt="ZONES" style={{width:'25%',height:220,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',opacity:lB?'0.5':'1',borderStyle:!lB?'solid':'none'}}/>
                    :
                        null
                    }
                    
                    {
                        this.state.activeSide==="Right"?
                        <span style={{width:'50%'}}>
                        <Zoom src={xray.value.HipImage.imageUrl.imageUrl} style={{width:'98%',height:"200px",marginRight:0,marginLeft:'2%'}}/>
                        </span>
                        :null
                    }
                    {
                        this.state.FrogEval===true && this.state.activeSide==="Right"?
                        <span style={{width:'50%'}}>
                        <Zoom src={xray.value.RightFrogImage.imageUrl.imageUrl} style={{width:'98%',height:"200px",marginRight:0,marginLeft:'2%'}}/>
                        </span>
                        :null
                    }

                    {/* {
                        this.state.EvalType==="Frog"&&xray.value.LeftFrog===true?
                        <span style={{width:xray.value.RightFrog?'24%':'39%',marginRight:'1%'}}>
                        <Zoom src={xray.value.LeftFrogImage.imageUrl.imageUrl} style={{width:'98% !important',height:'200px !important',marginRight:0,marginLeft:'2%'}}/>
                        </span>
                        :null
                    } */}
            
                    {/* {
                    this.state.rightSide?   
                        <img src={xray.value.RightHipImage.imageUrl.imageUrl} style={{width:'20%',height:200,marginRight:'2%',marginLeft:!this.state.rightSide?'50%':0}}/>
                    :
                        null
                    } */}
                    
                    {
                        this.state.leftSide?
                        <img src={LeftZone} alt="ZONES" style={{width:'25%',height:220,borderWidth:lB?3:0,borderColor:lB?'white':'none',opacity:lB?'1':'0.5',borderStyle:lB?'solid':'none'}}/>
                        
                    :null
                    }
                   
                            
                    </div>
                    <div>
                        {this.state.rightSide?<a className="button-confirm w-button" onClick={this.rightHip} style={{marginRight:30,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}>Right {this.state.EvalType}</a>:null}
                        {this.state.leftSide? <a className="button-confirm w-button" onClick={this.leftHip} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>Left {this.state.EvalType}</a>:null}
                    </div>

                    {xray.value[this.state.activeSide]
                    
                    ?
                        <table className="tablet">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>
                                            <p className="table-text c">Zone 1</p>
                                    </td>
                                    <td >
                                            <p className="table-text c">Zone 2</p>
                                    </td>
                                    <td>
                                            <p className="table-text c">Zone 3</p>
                                    </td>
                                    <td>
                                        <a  className="view-report button-7 w-button"
                                            onClick={()=>{
                                                xray.value.isError = true;
                                                this.setState({addNote:true, xray})
                                            }}>X-ray Error
                                        </a>
                                    </td>
                                </tr>
                                {rates.map(i=>
                                    (<tr key={i.value}>
                                        <td style={{verticalAlign:"bottom"}}>
                                            <p className="table-text">{i.name}</p>
                                            </td>

                                            {
                                                i.value<5?
                                                <td><CheckBox checked={xray.value[this.state.activeSide].zone1===i.value} default={xray.value.d_rightMedial===i.value}
                                                onChange={(checked)=>{this.handleCheck(checked, "zone1", i.value)}}/></td>
                                                :
                                                <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'100%',verticalAlign:"bottom"}}> </span></td>
                                            }
                                            {
                                                i.value<5?
                                                <td><CheckBox checked={xray.value[this.state.activeSide].zone2===i.value} default={xray.value.d_rightMedial===i.value}
                                                onChange={(checked)=>{this.handleCheck(checked, "zone2", i.value)}}/></td>:
                                                
                                                <td><CheckBox checked={xray.value[this.state.activeSide].zone1===i.value} default={xray.value.d_rightLateral===i.value}
                                                onChange={(checked)=>{this.handleCheckAll(checked,  i.value)}}/></td>
                                            }
                                            {
                                                i.value<5?
                                                <td><CheckBox checked={xray.value[this.state.activeSide].zone3===i.value} default={xray.value.d_leftMedial===i.value}
                                                onChange={(checked)=>{this.handleCheck(checked, "zone3", i.value)}}/></td>:
                                                <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'100%',verticalAlign:"bottom"}}> </span></td>
                                            }
                                        
                                        <td>

                                            {i.value===5 && (<a href="#" className="view-report button-7 green w-button"
                                                onClick={()=>this.setState({addNote:true})}>Add Note</a>)}
                                            {/* {i.value===3 && (<a href="#" className="view-report button-7 red w-button"
                                                onClick={this.delete}>Delete</a>)} */}
                                        </td>
                                    </tr>)
                                )}
                            </tbody>
                        </table>
                    :null
                    }
                   
                    <a className="button-confirm w-button" onClick={this.prevImage} style={{position:"fixed", left:50, bottom:20}}>Back</a>
                    <a className="button-confirm w-button" onClick={this.nextImage} style={{position:"fixed", left:"auto", right:50, bottom:20}}> Next </a >
    
                    <Note show={this.state.addNote} onSubmit={(value)=>{
                    xray.value.comment = value;
                    this.setState({addNote:false, xray})
                    }} onCancel={()=>{
                        xray.value.isError= false;
                        this.setState({addNote:false, xray})
                        }} 
                    />
                </div>
            } 

        </section>
        );
    }
}


